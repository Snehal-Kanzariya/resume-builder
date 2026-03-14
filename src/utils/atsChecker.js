// ── Action verb list (50 strong resume verbs) ─────────────────────────────────
const ACTION_VERBS = new Set([
  'led', 'managed', 'developed', 'built', 'created', 'designed', 'implemented',
  'optimized', 'increased', 'reduced', 'delivered', 'launched', 'coordinated',
  'analyzed', 'streamlined', 'collaborated', 'established', 'executed', 'generated',
  'improved', 'maintained', 'negotiated', 'oversaw', 'planned', 'produced',
  'resolved', 'scaled', 'spearheaded', 'supervised', 'trained', 'transformed',
  'architected', 'automated', 'championed', 'conducted', 'configured', 'deployed',
  'drove', 'engineered', 'facilitated', 'identified', 'integrated', 'introduced',
  'mentored', 'migrated', 'monitored', 'presented', 'refactored', 'researched',
  'reviewed', 'secured', 'supported', 'tested', 'utilized', 'wrote',
]);

// ── Common misspellings found on resumes ──────────────────────────────────────
const MISSPELLINGS = {
  'managment':    'management',
  'expirience':   'experience',
  'developement': 'development',
  'responsable':  'responsible',
  'recieved':     'received',
  'acheived':     'achieved',
  'achived':      'achieved',
  'successfull':  'successful',
  'comunication': 'communication',
  'preformed':    'performed',
  'implmented':   'implemented',
  'colaborated':  'collaborated',
  'analize':      'analyze',
  'analysed':     'analyzed',
  'organied':     'organized',
  'achivement':   'achievement',
  'buisness':     'business',
  'enviornment':  'environment',
  'knowlege':     'knowledge',
  'wrtting':      'writing',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function countSentences(text) {
  if (!text?.trim()) return 0;
  return (text.match(/[.!?]+\s*/g) || []).length || 1;
}

function startsWithActionVerb(bullet) {
  const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
  return ACTION_VERBS.has(firstWord);
}

function hasMetric(bullet) {
  return /\d+/.test(bullet);
}

function hasDatePattern(text) {
  // Accepts: "2020", "Jan 2020", "2020-01", "2020–Present", "Present", "Current"
  return /\d{4}|present|current/i.test(text);
}

function isStandardJobTitle(title) {
  if (!title?.trim()) return false;
  // Reject titles that are clearly not job titles (numbers-only, single char, etc.)
  return title.trim().length >= 3 && !/^\d+$/.test(title.trim());
}

function checkMisspellings(allText) {
  const words = allText.toLowerCase().split(/\s+/);
  const found = [];
  for (const w of words) {
    const clean = w.replace(/[^a-z]/g, '');
    if (MISSPELLINGS[clean] && !found.includes(clean)) found.push(clean);
  }
  return found;
}

// ── Main checker ──────────────────────────────────────────────────────────────
/**
 * Run rule-based ATS analysis against resumeData.
 * Returns { score, maxScore: 100, breakdown }.
 *
 * @param {object} resumeData — from ResumeContext
 */
export function checkATSScore(resumeData) {
  const pi   = resumeData?.personalInfo  ?? {};
  const exp  = resumeData?.experience    ?? [];
  const edu  = resumeData?.education     ?? [];
  const sk   = resumeData?.skills        ?? [];
  const cert = resumeData?.certifications ?? [];

  // Flatten all text for spell-check
  const allText = [
    pi.summary ?? '',
    ...exp.flatMap(e => [e.position ?? '', e.company ?? '', ...(e.bullets ?? [])]),
    ...edu.map(e => `${e.school} ${e.degree} ${e.field}`),
    ...sk.flatMap(s => s.items ?? []),
  ].join(' ');

  // Total skill items (not categories)
  const totalSkills = sk.reduce((n, s) => n + (s.items?.filter(i => i?.trim()).length ?? 0), 0);

  // All bullets across all experience entries
  const allBullets = exp.flatMap(e => (e.bullets ?? []).filter(b => b?.trim()));

  // Bullet checks (only meaningful when bullets exist)
  const bulletActionVerb = allBullets.length > 0
    ? allBullets.filter(startsWithActionVerb).length / allBullets.length
    : 0;
  const bulletMetric = allBullets.length > 0
    ? allBullets.filter(hasMetric).length / allBullets.length
    : 0;

  const expWith3Bullets = exp.filter(e =>
    (e.bullets ?? []).filter(b => b?.trim()).length >= 3
  ).length;
  const allExpHave3 = exp.length > 0 && expWith3Bullets === exp.length;

  // Date checks
  const datesOk = exp.length === 0 || exp.every(e =>
    hasDatePattern(e.startDate) && (e.current || hasDatePattern(e.endDate))
  );

  // Job title check
  const titlesOk = exp.length === 0 || exp.every(e => isStandardJobTitle(e.position));

  // Spell-check
  const misspelled = checkMisspellings(allText);

  // ── Rule definitions ────────────────────────────────────────────────────────
  const rules = [
    {
      id:        'has_summary',
      rule:      'Has professional summary',
      maxPoints: 10,
      passed:    Boolean(pi.summary?.trim()),
      suggestion: 'Add a 2–4 sentence professional summary at the top of your resume.',
    },
    {
      id:        'summary_length',
      rule:      'Summary is 2–4 sentences',
      maxPoints: 5,
      passed:    pi.summary?.trim()
        ? countSentences(pi.summary) >= 2 && countSentences(pi.summary) <= 4
        : false,
      suggestion: 'Keep your summary between 2 and 4 sentences for optimal ATS readability.',
    },
    {
      id:        'has_experience',
      rule:      'Has at least 2 experience entries',
      maxPoints: 10,
      passed:    exp.filter(e => e.company?.trim() || e.position?.trim()).length >= 2,
      suggestion: 'Add at least 2 work experience entries to pass ATS filters.',
    },
    {
      id:        'bullets_count',
      rule:      'Each experience has 3+ bullet points',
      maxPoints: 10,
      passed:    allExpHave3,
      suggestion: `${exp.length - expWith3Bullets} experience entr${exp.length - expWith3Bullets === 1 ? 'y needs' : 'ies need'} more bullets. Add at least 3 per role.`,
    },
    {
      id:        'action_verbs',
      rule:      'Bullets start with action verbs',
      maxPoints: 10,
      passed:    bulletActionVerb >= 0.7,
      suggestion: 'Start bullet points with strong action verbs (led, developed, built, optimized…).',
    },
    {
      id:        'metrics',
      rule:      'Bullet points include quantified metrics',
      maxPoints: 10,
      passed:    bulletMetric >= 0.3,
      suggestion: 'Add numbers to at least 30% of your bullets (e.g. "increased sales by 20%", "managed team of 8").',
    },
    {
      id:        'has_education',
      rule:      'Education section is filled',
      maxPoints: 5,
      passed:    edu.some(e => e.school?.trim()),
      suggestion: 'Add at least one education entry (school and degree).',
    },
    {
      id:        'skills_count',
      rule:      'Has 5+ skills listed',
      maxPoints: 10,
      passed:    totalSkills >= 5,
      suggestion: `You have ${totalSkills} skill${totalSkills === 1 ? '' : 's'}. Add more to reach at least 5.`,
    },
    {
      id:        'contact_info',
      rule:      'Email and phone are filled',
      maxPoints: 5,
      passed:    Boolean(pi.email?.trim()) && Boolean(pi.phone?.trim()),
      suggestion: 'Fill in both email and phone number in Personal Info.',
    },
    {
      id:        'linkedin',
      rule:      'LinkedIn URL is present',
      maxPoints: 5,
      passed:    Boolean(pi.linkedin?.trim()),
      suggestion: 'Add your LinkedIn URL to increase recruiter trust and ATS completeness.',
    },
    {
      id:        'no_empty_sections',
      rule:      'No empty sections visible',
      maxPoints: 5,
      passed:    cert.length > 0 || resumeData?.projects?.length > 0 || totalSkills > 0,
      suggestion: 'Remove or fill in any sections that have no content.',
    },
    {
      id:        'job_titles',
      rule:      'Job titles are clear and standard',
      maxPoints: 5,
      passed:    titlesOk,
      suggestion: 'Use standard job titles (e.g. "Software Engineer" not "Code Wizard").',
    },
    {
      id:        'dates',
      rule:      'Dates are properly formatted',
      maxPoints: 5,
      passed:    datesOk,
      suggestion: 'Fill in start and end dates for all experience entries.',
    },
    {
      id:        'spelling',
      rule:      'No common resume misspellings',
      maxPoints: 5,
      passed:    misspelled.length === 0,
      suggestion: misspelled.length > 0
        ? `Fix misspelling${misspelled.length > 1 ? 's' : ''}: ${misspelled.map(w => `"${w}" → "${MISSPELLINGS[w]}"`).join(', ')}.`
        : 'No common misspellings found.',
    },
  ];

  // ── Score calculation ────────────────────────────────────────────────────────
  const score = rules.reduce((sum, r) => sum + (r.passed ? r.maxPoints : 0), 0);
  const breakdown = rules.map(r => ({
    rule:       r.rule,
    points:     r.passed ? r.maxPoints : 0,
    maxPoints:  r.maxPoints,
    passed:     r.passed,
    suggestion: r.suggestion,
  }));

  return { score, maxScore: 100, breakdown };
}

/**
 * Return letter grade for a score (0–100).
 */
export function scoreToGrade(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A−';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B−';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}
