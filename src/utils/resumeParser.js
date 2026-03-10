const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

/**
 * Sanitise parsed/AI-returned data so every field has the correct type.
 * Safe to call on partial or malformed AI responses.
 */
export function validateParsedData(data) {
  return {
    personalInfo: {
      fullName:  data?.personalInfo?.fullName  || '',
      jobTitle:  data?.personalInfo?.jobTitle  || '',
      email:     data?.personalInfo?.email     || '',
      phone:     data?.personalInfo?.phone     || '',
      location:  data?.personalInfo?.location  || '',
      linkedin:  data?.personalInfo?.linkedin  || '',
      portfolio: data?.personalInfo?.portfolio || '',
      summary:   data?.personalInfo?.summary   || '',
    },
    experience: (Array.isArray(data?.experience) ? data.experience : []).map(e => ({
      id:        e.id        || crypto.randomUUID(),
      company:   e.company   || '',
      position:  e.position  || '',
      startDate: e.startDate || '',
      endDate:   e.endDate   || '',
      current:   Boolean(e.current),
      location:  e.location  || '',
      bullets:   Array.isArray(e.bullets) ? e.bullets.map(String).filter(Boolean) : [''],
    })),
    education: (Array.isArray(data?.education) ? data.education : []).map(e => ({
      id:           e.id           || crypto.randomUUID(),
      school:       e.school       || '',
      degree:       e.degree       || '',
      field:        e.field        || '',
      startDate:    e.startDate    || '',
      endDate:      e.endDate      || '',
      gpa:          e.gpa          || '',
      achievements: e.achievements || '',
    })),
    skills: (Array.isArray(data?.skills) ? data.skills : []).map(s => ({
      id:       s.id       || crypto.randomUUID(),
      category: s.category || '',
      items:    Array.isArray(s.items) ? s.items.map(String) : (s.items ? [String(s.items)] : []),
    })),
    projects: (Array.isArray(data?.projects) ? data.projects : []).map(p => ({
      id:           p.id           || crypto.randomUUID(),
      name:         p.name         || '',
      description:  p.description  || '',
      technologies: p.technologies || '',
      liveLink:     p.liveLink     || '',
      githubLink:   p.githubLink   || '',
    })),
    certifications: (Array.isArray(data?.certifications) ? data.certifications : []).map(c => ({
      id:     c.id     || crypto.randomUUID(),
      name:   c.name   || '',
      issuer: c.issuer || '',
      date:   c.date   || '',
      link:   c.link   || '',
    })),
  };
}

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

async function callGroq(messages, maxTokens = 2048) {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) throw new Error('No GROQ API key found. Add VITE_GROQ_API_KEY to your .env file.');

  const body = JSON.stringify({
    model: MODEL,
    messages,
    temperature: 0.3,
    max_tokens: maxTokens,
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
    // Wait 4 seconds and retry once
    await wait(4000);
    res = await fetch(ENDPOINT, opts);
    if (!res.ok) throw new Error(`Groq API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

const SCHEMA = `{
  "personalInfo": {"fullName":"","jobTitle":"","email":"","phone":"","location":"","linkedin":"","portfolio":"","summary":""},
  "experience": [{"company":"","position":"","startDate":"","endDate":"","current":false,"location":"","bullets":[""]}],
  "education": [{"school":"","degree":"","field":"","startDate":"","endDate":"","gpa":""}],
  "skills": [{"category":"","items":[""]}],
  "projects": [{"name":"","description":"","technologies":"","liveLink":"","githubLink":""}],
  "certifications": [{"name":"","issuer":"","date":""}]
}`;

/**
 * Parse raw resume text into structured JSON using Groq AI.
 * @param {string} text - raw extracted text from PDF or DOCX
 * @returns {Promise<object>} - structured resume data
 */
export async function parseResumeText(text) {
  const messages = [
    {
      role: 'system',
      content:
        `You are a resume parser. Extract structured data from the resume text provided. ` +
        `Return ONLY valid JSON matching this exact schema: ${SCHEMA}. ` +
        `Fill every field you can find. Use empty string for missing text fields and false for missing boolean fields. ` +
        `For dates use format like "Jan 2023". ` +
        `For the bullets array in experience, extract each bullet point as a separate string. ` +
        `For skills, group into logical categories (e.g. "Languages", "Frameworks", "Tools"). ` +
        `Do not include any explanation or markdown. Return raw JSON only.`,
    },
    {
      role: 'user',
      content: `Parse this resume:\n\n${text}`,
    },
  ];

  let raw = stripFences(await callGroq(messages, 2048));

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Retry once after 4 second delay
    await wait(4000);
    raw = stripFences(await callGroq(messages, 2048));
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('AI returned unparseable JSON. Please try again.');
    }
  }

  // 4 second delay before next call
  await wait(4000);
  return parsed;
}

/**
 * Generate 5 smart follow-up interview questions based on parsed resume data.
 * @param {object} resumeData - the parsed resume
 * @returns {Promise<Array>} - array of {id, question, field}
 */
export async function generateInterviewQuestions(resumeData) {
  const messages = [
    {
      role: 'system',
      content:
        `Based on the provided resume data, generate exactly 5 smart follow-up questions ` +
        `to help update and improve the resume. Focus on: current role status, new skills ` +
        `picked up since the resume was written, recent achievements with metrics, target role, ` +
        `and any gaps. Return ONLY a JSON array with this exact shape: ` +
        `[{"id":"q1","question":"...","field":"experience","placeholder":"..."}]. ` +
        `The field value must be one of: personalInfo, experience, education, skills, projects, certifications. ` +
        `For each question also include a placeholder field with a realistic example answer the user might type. ` +
        `No markdown, no explanation. Raw JSON array only.`,
    },
    {
      role: 'user',
      content: JSON.stringify(resumeData),
    },
  ];

  let raw;
  try {
    raw = stripFences(await callGroq(messages, 1024));
    const parsed = JSON.parse(raw);
    await wait(4000);
    return parsed;
  } catch {
    // Fallback questions if AI fails or returns bad JSON
    await wait(4000);
    return [
      { id: 'q1', question: 'Are you currently employed? If so, at what company and in what role?',               field: 'experience',     placeholder: 'e.g. I recently moved to Senior Frontend Developer at Google' },
      { id: 'q2', question: 'What new technical skills or tools have you picked up recently?',                    field: 'skills',         placeholder: 'e.g. TypeScript, Next.js, AWS, Docker, GraphQL' },
      { id: 'q3', question: 'What is your target job title or role right now?',                                   field: 'personalInfo',   placeholder: 'e.g. Senior Full Stack Developer at a Series B startup' },
      { id: 'q4', question: 'Any recent achievements or metrics you would like to highlight?',                    field: 'experience',     placeholder: 'e.g. Led a team of 5, increased revenue by 30%, reduced load time by 60%' },
      { id: 'q5', question: 'Are there any new projects or certifications you would like to add?',                field: 'projects',       placeholder: 'e.g. Built an AI-powered dashboard using React and OpenAI API' },
    ];
  }
}

/**
 * Apply user answers to interview questions and return updated resume data.
 * @param {object} resumeData - current resume data
 * @param {Array} answers - array of {id, question, field, answer}
 * @returns {Promise<object>} - updated resume data
 */
export async function applyInterviewAnswers(resumeData, answers) {
  const messages = [
    {
      role: 'system',
      content:
        `You are a resume updater. Given a resume JSON and user answers to follow-up questions, ` +
        `update the resume data by merging the new information into the appropriate sections. ` +
        `Return ONLY the complete updated resume JSON with the exact same structure as the input. ` +
        `No markdown, no explanation. Raw JSON only.`,
    },
    {
      role: 'user',
      content: JSON.stringify({ resumeData, answers }),
    },
  ];

  const raw = stripFences(await callGroq(messages, 2048));

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // AI returned bad JSON — return original data unchanged
    return resumeData;
  }

  // Validate the AI result then deep-merge so we never lose existing data
  const validated = validateParsedData(parsed);
  return {
    personalInfo: { ...(resumeData.personalInfo || {}), ...validated.personalInfo },
    experience:     validated.experience.length     > 0 ? validated.experience     : (resumeData.experience     || []),
    education:      validated.education.length      > 0 ? validated.education      : (resumeData.education      || []),
    skills:         validated.skills.length         > 0 ? validated.skills         : (resumeData.skills         || []),
    projects:       validated.projects.length       > 0 ? validated.projects       : (resumeData.projects       || []),
    certifications: validated.certifications.length > 0 ? validated.certifications : (resumeData.certifications || []),
  };
}
