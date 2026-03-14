import { useState, useEffect } from 'react';
import { X, Link2, FileText, Loader2, Target, AlertTriangle } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { analyzeJobDescription, hasApiKey } from '../../utils/jobOptimizer';
import JobMatchResults from './JobMatchResults';

// ── Mode toggle button ─────────────────────────────────────────────────────────
function ModeBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

export default function JobOptimizer({ onClose, onScoreUpdate }) {
  const { resumeData, updateSkillCategory, addSkillCategory } = useResume();
  const toast = useToast();

  const [mode,       setMode]       = useState('text');  // 'url' | 'text'
  const [inputValue, setInputValue] = useState('');
  const [analyzing,  setAnalyzing]  = useState(false);
  const [results,    setResults]    = useState(null);
  const [error,      setError]      = useState('');

  // When user switches to URL mode, immediately nudge them back to text
  useEffect(() => {
    if (mode === 'url') {
      setInputValue('');
    }
  }, [mode]);

  // Listen for keyword-add events from JobMatchResults
  useEffect(() => {
    function handleAddSkill(e) {
      const { kw } = e.detail;
      // Try to add to an existing generic category
      const skills = resumeData?.skills || [];
      const target = skills.find(s =>
        ['other', 'tools', 'skills', 'additional'].includes(s.category?.toLowerCase())
      );
      if (target) {
        if (!target.items?.includes(kw)) {
          updateSkillCategory(target.id, 'items', [...(target.items || []), kw]);
        }
      } else {
        // Create a new "Tools & Skills" category
        addSkillCategory();
        // We can't set the id immediately — toast with instructions instead
        toast(`"${kw}" ready to add — paste it into a skill category!`, 'info', 4000);
        return;
      }
      toast(`"${kw}" added to skills!`, 'success', 2500);
    }
    window.addEventListener('job-optimizer-add-skill', handleAddSkill);
    return () => window.removeEventListener('job-optimizer-add-skill', handleAddSkill);
  }, [resumeData, updateSkillCategory, addSkillCategory, toast]);

  async function handleAnalyze() {
    if (!inputValue.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    if (!hasApiKey()) {
      setError('Groq API key not found. Add VITE_GROQ_API_KEY to your .env file.');
      return;
    }
    setError('');
    setAnalyzing(true);
    try {
      const data = await analyzeJobDescription(inputValue.trim(), resumeData);
      setResults(data);
      onScoreUpdate?.(data.matchScore);
    } catch (err) {
      if (err.message === 'GROQ_API_KEY_MISSING') {
        setError('Groq API key not found. Add VITE_GROQ_API_KEY to your .env file.');
      } else {
        setError(err.message || 'Analysis failed. Please try again.');
      }
    } finally {
      setAnalyzing(false);
    }
  }

  function handleApplied() {
    toast('Resume updated with job-optimized content!', 'success', 3500);
    onClose?.();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Target size={16} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Optimize for Job</h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">AI-powered ATS match analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {results ? (
            <JobMatchResults
              results={results}
              onApplied={handleApplied}
              onReset={() => setResults(null)}
            />
          ) : (
            <div className="flex flex-col gap-4">

              {/* Mode selector */}
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Input method</p>
                <div className="flex gap-2">
                  <ModeBtn
                    active={mode === 'text'}
                    onClick={() => setMode('text')}
                    icon={FileText}
                    label="Paste Job Description"
                  />
                  <ModeBtn
                    active={mode === 'url'}
                    onClick={() => setMode('url')}
                    icon={Link2}
                    label="Job URL"
                  />
                </div>
              </div>

              {/* URL notice */}
              {mode === 'url' && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-0.5">
                      URL mode not available
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                      Browser security (CORS) prevents direct URL fetching. Please open the job posting, copy the full description, and paste it in Text mode for the best results.
                    </p>
                    <button
                      onClick={() => setMode('text')}
                      className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Switch to Paste Mode →
                    </button>
                  </div>
                </div>
              )}

              {/* Textarea */}
              {mode === 'text' && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    Job description text
                  </label>
                  <textarea
                    value={inputValue}
                    onChange={e => { setInputValue(e.target.value); setError(''); }}
                    placeholder="Paste the full job description here — responsibilities, requirements, nice-to-haves, tech stack…"
                    rows={10}
                    className="w-full text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 resize-none outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-colors leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    {inputValue.length} characters · longer descriptions give better results
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
                  <AlertTriangle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Analyze button */}
              {mode === 'text' && (
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !inputValue.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                >
                  {analyzing ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Analyzing (this takes ~5 seconds)…
                    </>
                  ) : (
                    <>
                      <Target size={15} />
                      Analyze & Optimize
                    </>
                  )}
                </button>
              )}

              {!hasApiKey() && (
                <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
                  Requires <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">VITE_GROQ_API_KEY</code> in your .env file.
                  Get a free key at <span className="text-blue-500">console.groq.com</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
