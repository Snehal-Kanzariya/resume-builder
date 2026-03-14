const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL    = 'llama-3.3-70b-versatile';

// ── CSV helpers ───────────────────────────────────────────────────────────────

/**
 * Parse a single CSV string into an array of row-objects.
 * Handles quoted fields (including quoted commas and newlines).
 */
function parseCSV(text) {
  const lines  = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows   = [];
  let   line   = [];
  let   field  = '';
  let   inQuote = false;
  let   i = 0;

  while (i < lines.length) {
    const ch = lines[i];
    if (inQuote) {
      if (ch === '"') {
        if (lines[i + 1] === '"') { field += '"'; i += 2; continue; } // escaped quote
        inQuote = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuote = true;
      } else if (ch === ',') {
        line.push(field.trim());
        field = '';
      } else if (ch === '\n') {
        line.push(field.trim());
        field = '';
        if (line.some(c => c !== '')) rows.push(line);
        line = [];
        i++;
        continue;
      } else {
        field += ch;
      }
    }
    i++;
  }
  if (field || line.length) {
    line.push(field.trim());
    if (line.some(c => c !== '')) rows.push(line);
  }

  if (rows.length < 1) return [];

  // First row is headers
  const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, ' ').trim());
  return rows.slice(1).map(cells => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = cells[idx] ?? ''; });
    return obj;
  });
}

function col(row, ...keys) {
  for (const k of keys) {
    const val = row[k.toLowerCase()] ?? row[k] ?? '';
    if (val) return String(val).trim();
  }
  return '';
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

// ── Date normalisation (LinkedIn uses "Mon YYYY" or "YYYY" format) ─────────────
function normDate(raw) {
  if (!raw) return '';
  // Already looks like YYYY-MM or YYYY
  if (/^\d{4}(-\d{2})?$/.test(raw.trim())) return raw.trim();
  // "Jan 2020" → "2020-01"
  const months = { jan:'01', feb:'02', mar:'03', apr:'04', may:'05', jun:'06',
                   jul:'07', aug:'08', sep:'09', oct:'10', nov:'11', dec:'12' };
  const m = raw.trim().toLowerCase().match(/^([a-z]{3})\s+(\d{4})$/);
  if (m) return `${m[2]}-${months[m[1]] ?? '01'}`;
  // Just a year
  if (/^\d{4}$/.test(raw.trim())) return raw.trim();
  return raw.trim();
}

// ── Per-file parsers ──────────────────────────────────────────────────────────

function parseProfile(rows) {
  if (!rows.length) return {};
  const r = rows[0];
  const firstName = col(r, 'First Name', 'first name');
  const lastName  = col(r, 'Last Name',  'last name');
  return {
    fullName:  [firstName, lastName].filter(Boolean).join(' '),
    jobTitle:  col(r, 'Headline', 'headline'),
    location:  col(r, 'Geo Location', 'geo location', 'location', 'zip code'),
    summary:   col(r, 'Summary', 'summary'),
    email:     col(r, 'Email Address', 'email address', 'email'),
    phone:     col(r, 'Phone Numbers', 'phone numbers', 'phone'),
    linkedin:  '',
    portfolio: '',
    github:    '',
  };
}

function parsePositions(rows) {
  return rows
    .filter(r => col(r, 'Company Name', 'company name') || col(r, 'Title'))
    .map(r => {
      const description = col(r, 'Description', 'description');
      const bullets = description
        ? description.split(/\n+/).map(b => b.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)
        : [''];
      const endRaw = col(r, 'Finished On', 'finished on');
      const current = !endRaw || endRaw.toLowerCase() === 'present';
      return {
        id:        generateId(),
        company:   col(r, 'Company Name', 'company name'),
        position:  col(r, 'Title', 'title'),
        startDate: normDate(col(r, 'Started On', 'started on')),
        endDate:   current ? '' : normDate(endRaw),
        current,
        location:  col(r, 'Location', 'location'),
        bullets:   bullets.length ? bullets : [''],
      };
    });
}

function parseEducation(rows) {
  return rows
    .filter(r => col(r, 'School Name', 'school name'))
    .map(r => ({
      id:           generateId(),
      school:       col(r, 'School Name', 'school name'),
      degree:       col(r, 'Degree Name', 'degree name'),
      field:        col(r, 'Field Of Study', 'field of study', 'activities'),
      startDate:    normDate(col(r, 'Start Date', 'start date')),
      endDate:      normDate(col(r, 'End Date', 'end date')),
      gpa:          col(r, 'Grade', 'grade'),
      achievements: col(r, 'Notes', 'notes'),
    }));
}

function parseSkills(rows) {
  const names = rows
    .map(r => col(r, 'Name', 'name', 'skill'))
    .filter(Boolean);
  if (!names.length) return [];
  // Group every 8 into a category
  const chunkSize = 8;
  const groups = [];
  for (let i = 0; i < names.length; i += chunkSize) {
    groups.push({
      id:       generateId(),
      category: i === 0 ? 'Skills' : `Skills (${Math.floor(i / chunkSize) + 1})`,
      items:    names.slice(i, i + chunkSize),
    });
  }
  return groups;
}

function parseCertifications(rows) {
  return rows
    .filter(r => col(r, 'Name', 'name'))
    .map(r => ({
      id:     generateId(),
      name:   col(r, 'Name', 'name'),
      issuer: col(r, 'Authority', 'authority'),
      date:   normDate(col(r, 'Started On', 'started on')),
      link:   col(r, 'Url', 'url'),
    }));
}

// ── Public API: parse array of File objects ────────────────────────────────────
/**
 * Takes an array of CSV File objects from a LinkedIn data export ZIP.
 * Recognises files by name fragment (case-insensitive).
 * Returns a partial resumeData object (missing fields will be empty strings).
 */
export async function parseLinkedInCSV(files) {
  const find = (fragment) =>
    files.find(f => f.name.toLowerCase().includes(fragment.toLowerCase())) ?? null;

  async function readFile(f) {
    if (!f) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error(`Could not read ${f.name}`));
      reader.readAsText(f, 'utf-8');
    });
  }

  const [profileText, positionsText, educationText, skillsText, certsText] =
    await Promise.all([
      readFile(find('Profile')),
      readFile(find('Position')),
      readFile(find('Education')),
      readFile(find('Skill')),
      readFile(find('Certification')),
    ]);

  const profileRows      = profileText  ? parseCSV(profileText)  : [];
  const positionRows     = positionsText ? parseCSV(positionsText) : [];
  const educationRows    = educationText ? parseCSV(educationText) : [];
  const skillRows        = skillsText   ? parseCSV(skillsText)   : [];
  const certRows         = certsText    ? parseCSV(certsText)    : [];

  const personalInfo = parseProfile(profileRows);
  const experience   = parsePositions(positionRows);
  const education    = parseEducation(educationRows);
  const skills       = parseSkills(skillRows);
  const certifications = parseCertifications(certRows);

  return {
    personalInfo,
    experience,
    education,
    skills,
    projects:       [],
    certifications,
    customSections: [],
  };
}

// ── Public API: parse LinkedIn PDF text ────────────────────────────────────────
/**
 * Takes raw text extracted from a LinkedIn profile PDF.
 * First tries rule-based extraction, then falls back to Groq AI.
 */
export async function parseLinkedInPDF(text) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY not set — cannot parse LinkedIn PDF.');

  // 4-second rate-limit delay
  await new Promise(r => setTimeout(r, 4000));

  const systemPrompt = `You are a resume parser. Extract ALL information from this LinkedIn profile PDF text into structured JSON. Return ONLY valid JSON matching this exact schema:
{
  "personalInfo": {"fullName":"","jobTitle":"","email":"","phone":"","location":"","linkedin":"","portfolio":"","github":"","summary":""},
  "experience": [{"company":"","position":"","startDate":"","endDate":"","current":false,"location":"","bullets":[""]}],
  "education": [{"school":"","degree":"","field":"","startDate":"","endDate":"","gpa":"","achievements":""}],
  "skills": [{"category":"","items":[""]}],
  "projects": [],
  "certifications": [{"name":"","issuer":"","date":"","link":""}]
}
Use empty string for fields you cannot find. For experience bullets, split description into separate bullet strings.`;

  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: `LinkedIn profile text:\n\n${text}` },
      ],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq error ${res.status}`);
  }

  const data    = await res.json();
  const raw     = data.choices?.[0]?.message?.content ?? '{}';
  const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    // Ensure IDs are generated for all array items
    const addIds = (arr) => (arr || []).map(item => ({ ...item, id: item.id || generateId() }));
    return {
      personalInfo:   { ...parsed.personalInfo },
      experience:     addIds(parsed.experience),
      education:      addIds(parsed.education),
      skills:         addIds(parsed.skills),
      projects:       addIds(parsed.projects),
      certifications: addIds(parsed.certifications),
      customSections: [],
    };
  } catch {
    throw new Error('AI returned invalid JSON while parsing LinkedIn PDF. Please try again.');
  }
}
