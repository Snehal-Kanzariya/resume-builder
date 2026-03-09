import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

// ── Action verbs (50 common) ─────────────────────────────────────────────────
const ACTION_VERBS = new Set([
  'achieved','administered','analyzed','architected','automated','boosted',
  'built','championed','collaborated','contributed','coordinated','created',
  'delivered','deployed','designed','developed','directed','drove',
  'engineered','enhanced','established','executed','facilitated','generated',
  'grew','implemented','improved','increased','initiated','integrated',
  'launched','led','managed','mentored','optimized','organized',
  'oversaw','planned','produced','reduced','resolved','scaled',
  'shipped','simplified','solved','spearheaded','streamlined','transformed',
  'unified','utilized','validated',
]);

const METRIC_RE = /\d+\s*(%|x\b|times|percent|k\b|m\b|million|billion|users|clients|customers|hours|days|weeks|months|years|points|fps|ms|seconds|requests|queries|records)/i;

function startsWithActionVerb(text) {
  const first = text.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
  return ACTION_VERBS.has(first);
}

function hasMetric(text) {
  return METRIC_RE.test(text);
}

// ── Tip row ──────────────────────────────────────────────────────────────────
function Tip({ ok, message }) {
  return (
    <div className={`flex items-start gap-2 text-xs py-1 ${ok ? 'text-emerald-700' : 'text-amber-700'}`}>
      {ok
        ? <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-emerald-500" />
        : <AlertTriangle size={13} className="mt-0.5 flex-shrink-0 text-amber-500" />
      }
      <span>{message}</span>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function AISuggestions({ section }) {
  const { resumeData } = useResume();
  const tips = [];

  // ── Personal Info ──────────────────────────────────────────────────────────
  if (section === 'personal') {
    const { summary } = resumeData?.personalInfo ?? {};
    if (summary?.trim()) {
      const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const ok = sentences.length >= 2 && sentences.length <= 4;
      tips.push({
        ok,
        message: ok
          ? `Summary is ${sentences.length} sentences — great length.`
          : `Summary has ${sentences.length} sentence${sentences.length !== 1 ? 's' : ''}. Aim for 2–4.`,
      });
    } else {
      tips.push({ ok: false, message: 'Add a professional summary to introduce yourself.' });
    }
  }

  // ── Experience ─────────────────────────────────────────────────────────────
  if (section === 'experience') {
    const { experience } = resumeData;
    if (experience.length === 0) {
      tips.push({ ok: false, message: 'Add at least one work experience entry.' });
    } else {
      experience.forEach((exp, i) => {
        const label  = exp.company || `Entry ${i + 1}`;
        const filled = exp.bullets.filter(b => b.trim().length > 0);

        // Bullet count
        if (filled.length < 3) {
          tips.push({ ok: false, message: `"${label}" has ${filled.length} bullet${filled.length !== 1 ? 's' : ''}. Aim for 3+.` });
        } else {
          tips.push({ ok: true, message: `"${label}" has ${filled.length} bullets — good.` });
        }

        if (filled.length === 0) return;

        // Action verbs
        const withVerbs = filled.filter(b => startsWithActionVerb(b));
        if (withVerbs.length < filled.length) {
          tips.push({ ok: false, message: `${filled.length - withVerbs.length} bullet(s) in "${label}" don't start with an action verb.` });
        } else {
          tips.push({ ok: true, message: `All bullets in "${label}" start with action verbs.` });
        }

        // Metrics
        const withMetrics = filled.filter(b => hasMetric(b));
        if (withMetrics.length === 0) {
          tips.push({ ok: false, message: `"${label}": Add numbers or metrics (e.g. "increased sales by 30%").` });
        } else {
          tips.push({ ok: true, message: `"${label}" includes ${withMetrics.length} quantified result${withMetrics.length !== 1 ? 's' : ''}.` });
        }
      });
    }
  }

  // ── Education ──────────────────────────────────────────────────────────────
  if (section === 'education') {
    const { education } = resumeData;
    if (education.length === 0) {
      tips.push({ ok: false, message: 'Add your educational background.' });
    } else {
      const complete = education.filter(e => e.school && e.degree);
      tips.push({
        ok: complete.length === education.length,
        message: complete.length === education.length
          ? 'All education entries have school and degree filled in.'
          : `${education.length - complete.length} education entr${education.length - complete.length !== 1 ? 'ies are' : 'y is'} missing school or degree.`,
      });
    }
  }

  // ── Skills ─────────────────────────────────────────────────────────────────
  if (section === 'skills') {
    const total = (resumeData?.skills ?? []).reduce(
      (sum, cat) => sum + cat.items.filter(i => i.trim()).length, 0,
    );
    tips.push({
      ok: total >= 5,
      message: total >= 5
        ? `${total} skills listed — great variety.`
        : `Only ${total} skill${total !== 1 ? 's' : ''} listed. Add at least 5 to stand out.`,
    });
  }

  // ── Projects ───────────────────────────────────────────────────────────────
  if (section === 'projects') {
    const { projects } = resumeData;
    if (projects.length === 0) {
      tips.push({ ok: false, message: 'Add personal or professional projects to showcase your work.' });
    } else {
      const withDesc = projects.filter(p => p.description?.trim().length > 30);
      tips.push({
        ok: withDesc.length === projects.length,
        message: withDesc.length === projects.length
          ? 'All projects have descriptive summaries.'
          : `${projects.length - withDesc.length} project(s) need a more detailed description (30+ chars).`,
      });
      const withLinks = projects.filter(p => p.liveLink || p.githubLink);
      tips.push({
        ok: withLinks.length === projects.length,
        message: withLinks.length === projects.length
          ? 'All projects have links — great for recruiters.'
          : `${projects.length - withLinks.length} project(s) are missing links.`,
      });
    }
  }

  if (tips.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 transition-colors">
      <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
        Resume Tips
      </p>
      {tips.map((t, i) => <Tip key={i} ok={t.ok} message={t.message} />)}
    </div>
  );
}
