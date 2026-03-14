const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL        = 'llama-3.3-70b-versatile';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a cover letter using the Groq API.
 *
 * @param {object} resumeData   - Full resume context
 * @param {string} jobTitle     - Target job title
 * @param {string} company      - Company name
 * @param {string} jobDescription - Pasted job description (optional)
 * @param {string} tone         - 'professional' | 'enthusiastic' | 'formal' | 'conversational'
 * @param {string} length       - 'short' | 'medium' | 'long'
 * @param {string} keyPoints    - Extra points to emphasise (optional)
 * @returns {Promise<string>}   - Plain-text cover letter
 */
export async function generateCoverLetter(
  resumeData,
  jobTitle,
  company,
  jobDescription = '',
  tone = 'professional',
  length = 'medium',
  keyPoints = ''
) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY is not set.');

  await delay(4000);

  const { personalInfo = {}, experience = [], education = [], skills = [] } = resumeData || {};

  const lengthGuide = {
    short:  '2–3 short paragraphs (≈150–200 words)',
    medium: '3–4 paragraphs (≈250–350 words)',
    long:   '4–5 paragraphs (≈400–500 words)',
  }[length] || '3–4 paragraphs';

  const toneGuide = {
    professional:    'professional and polished',
    enthusiastic:    'enthusiastic and energetic while remaining professional',
    formal:          'formal and conservative',
    conversational:  'warm and conversational yet professional',
  }[tone] || 'professional';

  const skillList = skills.map(s => s.items?.join(', ')).filter(Boolean).join('; ');
  const expSummary = experience
    .slice(0, 3)
    .map(e => `${e.position} at ${e.company} (${e.startDate}–${e.current ? 'Present' : e.endDate})`)
    .join('\n');
  const eduSummary = education
    .slice(0, 2)
    .map(e => `${e.degree} in ${e.field} from ${e.school}`)
    .join('\n');

  const prompt = `You are a professional cover letter writer. Write a compelling cover letter for the following applicant and job.

APPLICANT DETAILS:
Name: ${personalInfo.fullName || 'Applicant'}
Current/Recent Title: ${personalInfo.jobTitle || ''}
Email: ${personalInfo.email || ''}
Location: ${personalInfo.location || ''}

Work Experience:
${expSummary || 'Not provided'}

Education:
${eduSummary || 'Not provided'}

Skills: ${skillList || 'Not provided'}

Professional Summary: ${personalInfo.summary || 'Not provided'}

TARGET ROLE:
Job Title: ${jobTitle}
Company: ${company}
${jobDescription ? `Job Description:\n${jobDescription.slice(0, 1500)}` : ''}
${keyPoints ? `Key points to emphasise:\n${keyPoints}` : ''}

INSTRUCTIONS:
- Tone: ${toneGuide}
- Length: ${lengthGuide}
- Start with a strong opening that mentions the specific role and company
- Highlight 2–3 most relevant achievements or skills that match this role
- Show genuine interest in the company (mention something specific if job description was provided)
- End with a clear call to action
- Do NOT include a date, address block, or "Sincerely," signature line — just the letter body paragraphs
- Do NOT use placeholder text like [Your Name]; use the actual provided data
- Output ONLY the letter text — no markdown, no headings, no extra commentary`;

  const resp = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `Groq API error ${resp.status}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}
