const API_KEY  = import.meta.env.VITE_GEMINI_API_KEY;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export function hasApiKey() {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function stripFences(text) {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/**
 * Single Gemini call with one retry on 429.
 * Returns parsed JSON or throws.
 */
async function callGemini(prompt, retryCount = 0) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  // Rate limited — wait and retry once
  if (response.status === 429) {
    if (retryCount >= 1) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    await wait(4000);
    return callGemini(prompt, retryCount + 1);
  }

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const text = stripFences(raw);

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Gemini returned non-JSON for this section. Try again.`);
  }
}

/**
 * Calls Gemini to enhance a single resume section.
 * Returns parsed JSON matching the original section schema.
 */
export async function enhanceSection(sectionName, sectionData) {
  const prompt =
    `You are a professional resume writer. Improve the following resume "${sectionName}" ` +
    `to be more impactful, use strong action verbs, add quantified metrics where possible, ` +
    `and make it ATS-friendly. ` +
    `Return ONLY raw JSON — no markdown backticks, no code fences, no explanation, no commentary. ` +
    `The JSON must match the exact same schema as the input. ` +
    `Here is the data: ${JSON.stringify(sectionData)}`;

  return callGemini(prompt);
}

const ENHANCEABLE_SECTIONS = [
  'personalInfo',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
];

/**
 * Enhances all resume sections sequentially with a 2-second delay between calls
 * to avoid hitting the Gemini free-tier rate limit.
 * Sections that fail are kept as-is (graceful degradation).
 *
 * @param {object}   resumeData      - current resume state
 * @param {function} onProgress      - optional callback(sectionName, index, total)
 */
export async function enhanceFullResume(resumeData, onProgress) {
  const enhanced = { ...resumeData };

  // Only process sections that have data
  const toProcess = ENHANCEABLE_SECTIONS.filter(section => {
    const data = resumeData[section];
    if (!data) return false;
    if (Array.isArray(data) && data.length === 0) return false;
    return true;
  });

  for (let i = 0; i < toProcess.length; i++) {
    const section = toProcess[i];

    if (onProgress) onProgress(section, i + 1, toProcess.length);

    try {
      enhanced[section] = await enhanceSection(section, resumeData[section]);
    } catch (err) {
      console.warn(`[AI] Skipping "${section}":`, err.message);
      // Keep original data for this section and continue
    }

    // Wait 2 seconds between calls (skip delay after last section)
    if (i < toProcess.length - 1) {
      await wait(2000);
    }
  }

  return enhanced;
}
