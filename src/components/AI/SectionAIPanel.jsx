import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, X, GitCompare } from 'lucide-react';
import { enhanceSection, hasApiKey } from '../../utils/aiEnhance';
import { useResume } from '../../context/ResumeContext';

// ── Diff helpers ──────────────────────────────────────────────────────────────

function getChangedItems(sectionName, original, enhanced) {
  const items = [];

  if (sectionName === 'personalInfo') {
    if (enhanced.summary && enhanced.summary !== original.summary) {
      items.push({ label: 'Summary', orig: original.summary || '—', ai: enhanced.summary });
    }
    if (enhanced.jobTitle && enhanced.jobTitle !== original.jobTitle) {
      items.push({ label: 'Job Title', orig: original.jobTitle || '—', ai: enhanced.jobTitle });
    }
  }

  if (sectionName === 'experience' && Array.isArray(enhanced)) {
    enhanced.forEach((exp, i) => {
      const orig = original[i];
      if (!orig) return;
      const aiBullets   = (exp.bullets  || []).filter(b => b.trim()).slice(0, 2);
      const origBullets = (orig.bullets || []).filter(b => b.trim()).slice(0, 2);
      if (aiBullets.join('') !== origBullets.join('') && aiBullets.length) {
        items.push({
          label: exp.position ? `${exp.position} @ ${exp.company}` : exp.company,
          orig:  origBullets.join(' · ') || '—',
          ai:    aiBullets.join(' · '),
        });
      }
    });
  }

  if (sectionName === 'education' && Array.isArray(enhanced)) {
    enhanced.forEach((edu, i) => {
      const orig = original[i];
      if (!orig || edu.achievements === orig.achievements) return;
      items.push({
        label: edu.school || 'Education',
        orig:  orig.achievements || '—',
        ai:    edu.achievements  || '—',
      });
    });
  }

  if (sectionName === 'skills' && Array.isArray(enhanced)) {
    enhanced.forEach((cat, i) => {
      const orig = original[i];
      if (!orig) return;
      const origStr = (orig.items || []).join(', ');
      const aiStr   = (cat.items  || []).join(', ');
      if (origStr !== aiStr) {
        items.push({ label: cat.category || 'Skills', orig: origStr || '—', ai: aiStr });
      }
    });
  }

  if (sectionName === 'projects' && Array.isArray(enhanced)) {
    enhanced.forEach((proj, i) => {
      const orig = original[i];
      if (!orig || proj.description === orig.description) return;
      items.push({
        label: proj.name || 'Project',
        orig:  orig.description  || '—',
        ai:    proj.description  || '—',
      });
    });
  }

  if (sectionName === 'certifications' && Array.isArray(enhanced)) {
    enhanced.forEach((cert, i) => {
      const orig = original[i];
      if (!orig || cert.name === orig.name) return;
      items.push({ label: 'Name', orig: orig.name || '—', ai: cert.name || '—' });
    });
  }

  return items;
}

// ── One diff row ──────────────────────────────────────────────────────────────

function DiffRow({ label, orig, ai }) {
  return (
    <div className="mb-3 last:mb-0">
      {label && (
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      )}
      <p className="text-xs text-slate-400 line-through leading-relaxed mb-1 break-words">{orig}</p>
      <p className="text-xs text-emerald-700 leading-relaxed break-words">{ai}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * Drop-in panel for any form section.
 *
 * Props:
 *   sectionName  – key used in resumeData (e.g. 'experience')
 *   sectionData  – current raw data for that section
 *   onAccept(data) – called with enhanced data when user accepts
 */
export default function SectionAIPanel({ sectionName, sectionData, onAccept }) {
  const { resumeData, aiResumeData, setAiResumeData } = useResume();
  const [status,  setStatus]  = useState('idle');   // idle | loading | done | error
  const [aiData,  setAiData]  = useState(null);
  const [error,   setError]   = useState(null);

  const noKey = !hasApiKey();

  async function handleEnhance() {
    setStatus('loading');
    setError(null);
    try {
      const result = await enhanceSection(sectionName, sectionData);
      setAiData(result);
      setStatus('done');
      // Merge this section's AI result into the global aiResumeData snapshot
      // so the "Compare Versions" button lights up in the preview panel
      const base = aiResumeData ?? resumeData;
      setAiResumeData({ ...base, [sectionName]: result });
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  function handleAccept() {
    onAccept(aiData);
    setStatus('idle');
    setAiData(null);
  }

  function handleDismiss() {
    setStatus('idle');
    setAiData(null);
  }

  const diffItems = status === 'done' && aiData
    ? getChangedItems(sectionName, sectionData, aiData)
    : [];

  return (
    <div className="mt-5 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-purple-500" />
          <span className="text-xs font-semibold text-purple-700">AI Enhancement</span>
        </div>

        {status === 'idle' && (
          noKey ? (
            <div className="relative group">
              <button
                disabled
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-200 text-slate-400 cursor-not-allowed"
              >
                <Sparkles size={12} /> Enhance with AI
              </button>
              <div className="absolute bottom-full right-0 mb-2 w-72 p-2.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 hidden group-hover:block pointer-events-none leading-relaxed">
                Add <code className="bg-slate-700 px-1 rounded">VITE_GROQ_API_KEY</code> in your{' '}
                <code className="bg-slate-700 px-1 rounded">.env</code> file. Get a free key at{' '}
                <span className="underline">console.groq.com</span>
                <div className="absolute top-full right-4 border-4 border-transparent border-t-slate-800" />
              </div>
            </div>
          ) : (
            <button
              onClick={handleEnhance}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              <Sparkles size={12} /> Enhance with AI
            </button>
          )
        )}

        {status === 'loading' && (
          <span className="flex items-center gap-1.5 text-xs text-purple-600">
            <Loader2 size={13} className="animate-spin" />
            Enhancing…
          </span>
        )}

        {status === 'done' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={12} /> Dismiss
            </button>
            <button
              onClick={handleAccept}
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <CheckCircle size={12} /> Accept AI Version
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-500">{error}</span>
            <button
              onClick={() => setStatus('idle')}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Diff view */}
      {status === 'done' && (
        <div className="mt-3 pt-3 border-t border-purple-100">
          {diffItems.length > 0 ? (
            <>
              <p className="text-[10px] text-purple-500 font-semibold uppercase tracking-wide mb-2">
                What changed
              </p>
              {diffItems.map((item, i) => (
                <DiffRow key={i} label={item.label} orig={item.orig} ai={item.ai} />
              ))}
            </>
          ) : (
            <p className="text-xs text-slate-400 italic">
              AI kept this section mostly the same — accept to apply any subtle improvements.
            </p>
          )}
          <p className="text-[10px] text-purple-400 mt-3 flex items-center gap-1">
            <GitCompare size={10} />
            Click <strong>Compare Versions</strong> in the preview panel to see the full resume side-by-side.
          </p>
        </div>
      )}
    </div>
  );
}
