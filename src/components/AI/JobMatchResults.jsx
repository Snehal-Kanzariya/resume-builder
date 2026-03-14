import { useState } from 'react';
import {
  CheckCircle2, AlertCircle, Plus, Loader2,
  ChevronDown, ChevronUp, Sparkles,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { applyJobOptimizations } from '../../utils/jobOptimizer';

// ── Circular progress ring ─────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const radius = 36;
  const circ   = 2 * Math.PI * radius;
  const fill   = circ - (score / 100) * circ;
  const color  = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label  = score >= 70 ? 'Great match' : score >= 50 ? 'Fair match' : 'Low match';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg width="96" height="96" className="rotate-[-90deg] absolute inset-0">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={fill}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="relative flex flex-col items-center">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{score}</span>
          <span className="text-[10px] text-slate-400">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

// ── Inline diff display ───────────────────────────────────────────────────────
function DiffView({ current, suggested }) {
  if (!current) {
    return <span className="text-emerald-700 dark:text-emerald-400 text-xs">{suggested}</span>;
  }
  return (
    <div className="space-y-1 text-xs">
      {current && (
        <div className="text-red-500 line-through opacity-70 leading-relaxed">{current}</div>
      )}
      <div className="text-emerald-700 dark:text-emerald-400 leading-relaxed">{suggested}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function JobMatchResults({ results, onApplied, onReset }) {
  const { resumeData, setFullResumeData, addSkillCategory, updateSkillCategory } = useResume();
  const [checked,     setChecked]     = useState(() =>
    new Set(results.suggestedChanges?.map((_, i) => i) ?? [])
  );
  const [applying,    setApplying]    = useState(false);
  const [appliedKws,  setAppliedKws]  = useState(new Set());
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [applyError,  setApplyError]  = useState('');

  const { matchScore, missingKeywords = [], suggestedChanges = [], strengthMatches = [], summary } = results;

  function toggleCheck(i) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function addKeywordToSkills(kw) {
    const existing = resumeData?.skills?.find(s =>
      ['other', 'tools', 'skills', 'additional'].includes(s.category?.toLowerCase())
    );
    if (existing) {
      if (!existing.items?.includes(kw)) {
        updateSkillCategory(existing.id, 'items', [...(existing.items || []), kw]);
      }
    } else {
      // Dispatch event so JobOptimizer can create a new category and handle the toast
      window.dispatchEvent(new CustomEvent('job-optimizer-add-skill', { detail: { kw } }));
    }
    setAppliedKws(prev => new Set(prev).add(kw));
  }

  async function handleApply(all = false) {
    const selected = all
      ? suggestedChanges
      : suggestedChanges.filter((_, i) => checked.has(i));
    if (!selected.length) return;
    setApplying(true);
    setApplyError('');
    try {
      const updated = await applyJobOptimizations(resumeData, selected);
      setFullResumeData(updated);
      onApplied?.(updated);
    } catch (err) {
      setApplyError(err.message || 'Failed to apply changes. Please try again.');
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Score + summary ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="relative flex-shrink-0">
          <ScoreRing score={matchScore} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
            ATS Match Score
          </h3>
          {summary && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{summary}</p>
          )}
          <button
            onClick={onReset}
            className="mt-2 text-[11px] text-blue-500 hover:text-blue-600 transition-colors"
          >
            ← Analyze a different job
          </button>
        </div>
      </div>

      {/* ── Strength matches ────────────────────────────────────────────────── */}
      {strengthMatches.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={13} /> What's Already Working
          </p>
          <ul className="space-y-1.5">
            {strengthMatches.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Missing keywords ────────────────────────────────────────────────── */}
      {missingKeywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <AlertCircle size={13} /> Missing Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              >
                {kw}
                {!appliedKws.has(kw) && (
                  <button
                    onClick={() => addKeywordToSkills(kw)}
                    title={`Add "${kw}" to skills`}
                    className="ml-0.5 hover:text-emerald-600 transition-colors"
                  >
                    <Plus size={11} />
                  </button>
                )}
                {appliedKws.has(kw) && (
                  <CheckCircle2 size={11} className="text-emerald-500" />
                )}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
            Click + to add a keyword directly to your Skills section
          </p>
        </div>
      )}

      {/* ── Suggested changes ───────────────────────────────────────────────── */}
      {suggestedChanges.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles size={13} /> Suggested Changes
            </p>
            <button
              onClick={() => {
                if (checked.size === suggestedChanges.length) {
                  setChecked(new Set());
                } else {
                  setChecked(new Set(suggestedChanges.map((_, i) => i)));
                }
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
            >
              {checked.size === suggestedChanges.length ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          <ul className="space-y-2">
            {suggestedChanges.map((change, i) => (
              <li
                key={i}
                className={`rounded-lg border transition-colors ${
                  checked.has(i)
                    ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start gap-3 p-3">
                  <input
                    type="checkbox"
                    checked={checked.has(i)}
                    onChange={() => toggleCheck(i)}
                    className="mt-0.5 flex-shrink-0 accent-blue-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 capitalize">
                        {change.section}
                      </span>
                      <button
                        onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0"
                      >
                        {expandedIdx === i ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{change.reason}</p>
                    {expandedIdx === i && (
                      <div className="mt-2 p-2 rounded-md bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                        <DiffView current={change.current} suggested={change.suggested} />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {applyError && (
            <p className="text-xs text-red-500 mt-2">{applyError}</p>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleApply(false)}
              disabled={applying || checked.size === 0}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
            >
              {applying
                ? <><Loader2 size={13} className="animate-spin" /> Applying…</>
                : `Apply Selected (${checked.size})`
              }
            </button>
            <button
              onClick={() => handleApply(true)}
              disabled={applying}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              Apply All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
