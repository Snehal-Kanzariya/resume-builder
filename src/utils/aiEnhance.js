const API_KEY  = import.meta.env.VITE_GEMINI_API_KEY;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export function hasApiKey() {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY);
}

/**
 * Calls Gemini to enhance a single resume section.
 * Returns parsed JSON matching the original section schema.
 */
export async function enhanceSection(sectionName, sectionData) {
  const prompt =
    `You are a professional resume writer. Improve the following resume ${sectionName} ` +
    `to be more impactful, use strong action verbs, add quantified metrics where possible, ` +
    `and make it ATS-friendly. Return ONLY valid JSON matching the exact input schema, ` +
    `no markdown, no explanation. Here is the data: ${JSON.stringify(sectionData)}`;

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  let text = data.candidates[0].content.parts[0].text;

  // Strip markdown code fences if present
  text = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Failed to parse Gemini response as JSON for section: ${sectionName}`);
  }
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
 * Enhances all resume sections one by one.
 * Sections that fail are kept as-is (graceful degradation).
 */
export async function enhanceFullResume(resumeData) {
  const enhanced = { ...resumeData };

  for (const section of ENHANCEABLE_SECTIONS) {
    const data = resumeData[section];
    if (!data) continue;
    if (Array.isArray(data) && data.length === 0) continue;

    try {
      enhanced[section] = await enhanceSection(section, data);
    } catch (err) {
      console.warn(`[AI] Skipping ${section}:`, err.message);
      // keep original section data on failure
    }
  }

  return enhanced;
}
