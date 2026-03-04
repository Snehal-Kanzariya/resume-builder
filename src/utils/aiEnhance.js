const MODEL    = 'gemini-1.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

export function hasApiKey() {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY);
}

const wait = (ms) => new Promise(r => setTimeout(r, ms));

function stripFences(text) {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

async function callGemini(prompt) {
  // 3-second delay before every call to respect free-tier rate limits
  await wait(3000);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if (res.status === 429) {
    // Wait 10 seconds then retry once
    await wait(10000);
    const retry = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    if (!retry.ok) throw new Error(`Rate limit exceeded. Please wait a minute and try again.`);
    return retry;
  }

  if (!res.ok) throw new Error(`Gemini error: ${res.status} ${res.statusText}`);
  return res;
}

/**
 * Enhances ONE resume section via Gemini 1.5 Flash.
 * Sends a single API call; returns parsed JSON matching the input schema.
 */
export async function enhanceSection(sectionName, sectionData) {
  const prompt =
    `You are an expert resume writer. Rewrite and significantly improve this resume section. ` +
    `Use stronger action verbs, add quantified metrics and numbers, make it more impactful and ATS-friendly. ` +
    `Be creative and make real improvements, don't just rephrase. ` +
    `Return ONLY raw JSON matching exact input structure. No markdown. No explanation. ` +
    `Section name: "${sectionName}". Data: ${JSON.stringify(sectionData)}`;

  const res  = await callGemini(prompt);
  const data = await res.json();
  const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const text = stripFences(raw);

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Gemini returned unparseable JSON. Try again.`);
  }
}
