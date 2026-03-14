const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

function getApiKey() {
  return import.meta.env.VITE_GROQ_API_KEY || '';
}

export function hasApiKey() {
  return Boolean(getApiKey());
}

/**
 * Analyse a job description against the current resume data.
 * Returns a structured result with match score, gaps, suggestions, and strengths.
 *
 * @param {string} jobText     – full job description text
 * @param {object} resumeData  – current resume from context
 * @returns {Promise<{matchScore, missingKeywords, suggestedChanges, strengthMatches, summary}>}
 */
export async function analyzeJobDescription(jobText, resumeData) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('GROQ_API_KEY_MISSING');

  // 4-second delay for rate limiting
  await new Promise(r => setTimeout(r, 4000));

  // Flatten resume into a readable text snapshot for the AI
  const resumeSnapshot = JSON.stringify({
    personalInfo: resumeData?.personalInfo,
    experience:   resumeData?.experience?.map(e => ({
      company:  e.company,
      position: e.position,
      bullets:  e.bullets,
    })),
    education:      resumeData?.education?.map(e => ({ school: e.school, degree: e.degree, field: e.field })),
    skills:         resumeData?.skills?.map(s => ({ category: s.category, items: s.items })),
    projects:       resumeData?.projects?.map(p => ({ name: p.name, description: p.description, technologies: p.technologies })),
    certifications: resumeData?.certifications?.map(c => ({ name: c.name, issuer: c.issuer })),
  }, null, 2);

  const systemPrompt = `You are an expert ATS resume optimizer. Compare the job description with the resume data and return a JSON analysis. Return ONLY valid JSON with no markdown formatting.

JSON structure:
{
  "matchScore": <number 0-100>,
  "missingKeywords": [<string>, ...],
  "suggestedChanges": [
    {
      "section": <"summary" | "experience" | "skills" | "projects">,
      "current": <string — exact current text or empty string if adding new>,
      "suggested": <string — improved or new text>,
      "reason": <string — why this change helps>
    },
    ...
  ],
  "strengthMatches": [<string>, ...],
  "summary": <string — 1-2 sentence overview>
}

Rules:
- matchScore: realistic ATS keyword match (0-100)
- missingKeywords: skills, tools, or qualifications in the job description not found in the resume (max 12)
- suggestedChanges: actionable rewrites that improve keyword alignment (max 6). Only suggest changes to existing content — do NOT invent new facts, metrics, or experiences.
- strengthMatches: things the resume already does well vs this job (max 6)
- summary: brief honest assessment`;

  const userMessage = `JOB DESCRIPTION:\n${jobText}\n\nRESUME DATA:\n${resumeSnapshot}`;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage },
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error ${res.status}`);
  }

  const data = await res.json();
  const raw  = data.choices?.[0]?.message?.content || '{}';

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned invalid JSON. Please try again.');
  }
}

/**
 * Apply a subset of suggested changes to the resume data.
 * Each change targets a section by name and replaces `current` text with `suggested`.
 * Uses Groq to merge changes intelligently so context is preserved.
 *
 * @param {object}   resumeData      – current resume from context
 * @param {object[]} selectedChanges – subset of suggestedChanges the user checked
 * @returns {Promise<object>}        – updated resumeData (same shape)
 */
export async function applyJobOptimizations(resumeData, selectedChanges) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('GROQ_API_KEY_MISSING');
  if (!selectedChanges?.length) return resumeData;

  // 4-second delay for rate limiting
  await new Promise(r => setTimeout(r, 4000));

  const systemPrompt = `You are a resume editor. Apply the requested changes to the resume data and return the updated resume as valid JSON. Return ONLY valid JSON with no markdown. Preserve all existing fields and IDs. Only modify the specific text described in each change. Do NOT invent new facts, metrics, or experiences.`;

  const userMessage = `CURRENT RESUME:\n${JSON.stringify(resumeData, null, 2)}\n\nCHANGES TO APPLY:\n${JSON.stringify(selectedChanges, null, 2)}\n\nReturn the complete updated resume JSON.`;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage },
      ],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error ${res.status}`);
  }

  const data = await res.json();
  const raw  = data.choices?.[0]?.message?.content || '{}';
  const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

  try {
    const updated = JSON.parse(cleaned);
    // Always preserve settings from original
    return { ...updated, settings: resumeData.settings };
  } catch {
    throw new Error('AI returned invalid JSON while applying changes.');
  }
}
