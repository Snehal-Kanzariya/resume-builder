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
      github:    data?.personalInfo?.github    || '',
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
    languages: (Array.isArray(data?.languages) ? data.languages : []).map(l => ({
      id:          l.id || crypto.randomUUID(),
      name:        l.name        || '',
      proficiency: ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'].includes(l.proficiency)
        ? l.proficiency : 'Intermediate',
    })),
    // customSections from parser: [{title, entries: [{heading, subheading, description, bullets}]}]
    // Kept in parser format here; importResumeData converts to context format.
    customSections: (Array.isArray(data?.customSections) ? data.customSections : []).map(s => ({
      title:   s.title || '',
      entries: (Array.isArray(s.entries) ? s.entries : []).map(e => ({
        heading:     e.heading     || '',
        subheading:  e.subheading  || '',
        description: e.description || '',
        bullets:     Array.isArray(e.bullets) ? e.bullets.map(String).filter(Boolean) : [],
      })),
    })).filter(s => s.title && s.entries.length > 0),
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
    temperature: 0.1,
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
  "personalInfo": {"fullName":"","jobTitle":"","email":"","phone":"","location":"","linkedin":"","portfolio":"","github":"","summary":""},
  "experience": [{"company":"","position":"","startDate":"","endDate":"","current":false,"location":"","bullets":[""]}],
  "education": [{"school":"","degree":"","field":"","startDate":"","endDate":"","gpa":"","achievements":""}],
  "skills": [{"category":"","items":[""]}],
  "projects": [{"name":"","description":"","technologies":"","liveLink":"","githubLink":""}],
  "certifications": [{"name":"","issuer":"","date":"","description":""}],
  "languages": [{"name":"","proficiency":"Native|Fluent|Advanced|Intermediate|Basic"}],
  "customSections": [{"title":"","entries":[{"heading":"","subheading":"","description":"","bullets":[""]}]}],
  "styleMetadata": {
    "fontFamily":"sans-serif",
    "layout":"single-column",
    "headerStyle":"simple",
    "colorScheme":"minimal",
    "accentColor":"",
    "hasSidebar":false,
    "sidebarPosition":"left",
    "sidebarContent":[]
  }
}`;

const SYSTEM_PROMPT =
  `You are a resume parser. Extract ALL text EXACTLY as written. Do NOT summarize or shorten anything.\n\n` +
  `CRITICAL RULES:\n` +
  `- Extract EVERY section that exists in the resume including non-standard sections\n` +
  `- Common sections: Summary, Experience, Education, Skills, Projects, Certifications\n` +
  `- Also extract if present: Languages, Training, Courses, Hobbies, Volunteer Work, Awards, Publications, Interests\n` +
  `- For standard sections (experience, education, skills, projects, certifications), use the provided schema fields\n` +
  `- For Languages section: extract to the "languages" array with name and proficiency (Native/Fluent/Advanced/Intermediate/Basic)\n` +
  `- For any section not in the standard schema (Training, Awards, Hobbies, Volunteer Work, etc.), put it in customSections array with title and entries\n` +
  `- Copy ALL text word for word — do NOT omit, paraphrase, or summarize any bullet, description, or metric\n` +
  `- Preserve exact dates, numbers, percentages, company names, technologies\n` +
  `- If a job has a tech stack line, include it as the first bullet under that job\n` +
  `- Extract ALL skills with the same category groupings as in the resume\n\n` +
  `STYLE ANALYSIS — also analyze the visual style and return styleMetadata:\n` +
  `- fontFamily: If the resume looks formal/traditional with serif fonts → "serif". If modern/clean → "sans-serif". If code-like → "monospace"\n` +
  `- layout: If there is a distinct sidebar column (skills/education/contact in a separate column) → "two-column". If everything flows top to bottom in one column → "single-column"\n` +
  `- headerStyle: If name has a very large bold style → "bold-header". If there is a dark/colored background bar behind the name → "dark-header". If name is centered → "centered". Otherwise → "simple"\n` +
  `- colorScheme: If blue headings or accents are visible → "blue-accent". If mostly black/gray → "minimal". If dark sidebar or dark header → "dark". If multiple bright colors → "colorful"\n` +
  `- accentColor: The primary non-black color used. Provide as hex code if possible (e.g. "#2196F3"), otherwise describe as "blue", "green", "red", etc.\n` +
  `- hasSidebar: true if the resume has a visually distinct sidebar column, false otherwise\n` +
  `- sidebarPosition: "left" or "right" (which side the sidebar is on). Default "left"\n` +
  `- sidebarContent: array of section names that appear in the sidebar (e.g. ["Skills", "Education", "Languages"])\n\n` +
  `Return ONLY valid JSON matching this exact schema: ${SCHEMA}. No markdown, no explanation.`;

/**
 * Parse raw resume text into structured JSON using Groq AI.
 * @param {string} text - raw extracted text from PDF or DOCX
 * @returns {Promise<object>} - structured resume data
 */
export async function parseResumeText(text) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user',   content: `Parse this resume:\n\n${text}` },
  ];

  let raw = stripFences(await callGroq(messages, 4096));

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Retry once after 4 second delay
    await wait(4000);
    raw = stripFences(await callGroq(messages, 4096));
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
    languages:      validated.languages.length      > 0 ? validated.languages      : (resumeData.languages      || []),
  };
}
