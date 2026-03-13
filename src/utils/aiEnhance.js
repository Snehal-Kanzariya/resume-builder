const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL    = 'llama-3.3-70b-versatile';

export function hasApiKey() {
  return Boolean(import.meta.env.VITE_GROQ_API_KEY);
}

const wait = (ms) => new Promise(r => setTimeout(r, ms));

function stripFences(text) {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

async function callGroq(sectionData) {
  const key = import.meta.env.VITE_GROQ_API_KEY;

  const body = JSON.stringify({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert resume writer. Improve this resume section. ' +
          'Use stronger action verbs, clearer language, and more impactful phrasing. ' +
          'CRITICAL: Do NOT invent, fabricate, or add any numbers, percentages, metrics, dates, ' +
          'company names, tools, or facts that are not already present in the existing content. ' +
          'Only rewrite and strengthen the language using information that is already there. ' +
          'If no metrics exist in the original, do not add any. ' +
          'Return ONLY raw JSON matching the exact input structure. No markdown backticks. No explanation text.',
      },
      {
        role: 'user',
        content: JSON.stringify(sectionData),
      },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body,
  };

  let res = await fetch(ENDPOINT, opts);

  if (!res.ok) {
    // Wait 3 seconds and retry once
    await wait(3000);
    res = await fetch(ENDPOINT, opts);
    if (!res.ok) throw new Error(`AI error: ${res.status} ${res.statusText}`);
  }

  return res;
}

/**
 * Enhances ONE resume section via Groq (Llama 3.3 70B).
 * Returns parsed JSON matching the input schema.
 */
export async function enhanceSection(sectionName, sectionData) {
  const res  = await callGroq(sectionData);
  const data = await res.json();
  const raw  = data?.choices?.[0]?.message?.content ?? '';
  const text = stripFences(raw);

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('AI returned unparseable JSON. Try again.');
  }

  // 1-second safety margin before allowing the next call
  await wait(1000);
  return parsed;
}
