import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { checkATSScore, scoreToGrade } from '../../utils/atsChecker';
import { useResume } from '../../context/ResumeContext';

// ── Confetti burst (CSS-only, no library) ─────────────────────────────────────
function ConfettiBurst() {
  const colors = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 24 }).map((_, i) => {
        const color  = colors[i % colors.length];
        const left   = `${5 + (i * 17) % 90}%`;
        const delay  = `${(i * 0.07).toFixed(2)}s`;
        const size   = 4 + (i % 4) * 2;
        const rot    = (i * 47) % 360;
        return (
          <div
            key={i}
            className="absolute top-0 animate-confetti"
            style={{
              left,
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: i % 3 === 0 ? '50%' : '2px',
              animationDelay: delay,
              transform: `rotate(${rot}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Animated score ring ────────────────────────────────────────────────────────
function ScoreRing({ score, maxScore }) {
  const radius = 52;
  const circ   = 2 * Math.PI * radius;
  const pct    = score / maxScore;
  const [offset, setOffset] = useState(circ); // starts at 0 fill (full offset)

  useEffect(() => {
    // Trigger animation after mount
    const id = requestAnimationFrame(() => {
      setOffset(circ - pct * circ);
    });
    return () => cancelAnimationFrame(id);
  }, [score, circ, pct]);

  const color  = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const grade  = scoreToGrade(score);

  return (
    <div className="relative flex flex-col items-center">
      <svg width="128" height="128">
        {/* Track */}
        <circle cx="64" cy="64" r={radius}
          fill="none" stroke="#e2e8f0" strokeWidth="10"
          className="dark:[stroke:#334155]"
        />
        {/* Progress */}
        <circle cx="64" cy="64" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      {/* Center labels */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-800 dark:text-slate-100 leading-none">
          {score}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">/ {maxScore}</span>
      </div>
      {/* Grade badge */}
      <span
        className="mt-2 text-sm font-bold px-3 py-0.5 rounded-full"
        style={{ color, backgroundColor: `${color}18` }}
      >
        Grade {grade}
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ATSScoreCard() {
  const { resumeData } = useResume();
  const [result,     setResult]     = useState(null);
  const [showAll,    setShowAll]    = useState(false);
  const confettiShown               = useRef(false);

  function calculate() {
    const res = checkATSScore(resumeData);
    setResult(res);
    confettiShown.current = false;
  }

  // Auto-calculate on first mount
  useEffect(() => { calculate(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showConfetti = result && result.score > 90 && !confettiShown.current;
  if (showConfetti) confettiShown.current = true;

  if (!result) return null;

  const { score, maxScore, breakdown } = result;
  const failed = breakdown.filter(r => !r.passed).sort((a, b) => b.maxPoints - a.maxPoints);
  const passed = breakdown.filter(r =>  r.passed);
  const top3   = failed.slice(0, 3);
  const displayed = showAll ? breakdown : [...top3, ...passed.slice(0, 3)];

  return (
    <div className="relative flex flex-col gap-5">
      {showConfetti && <ConfettiBurst />}

      {/* Score ring */}
      <div className="flex flex-col items-center pt-2">
        <ScoreRing score={score} maxScore={maxScore} />
      </div>

      {/* Top 3 improvements (only if there are failures) */}
      {top3.length > 0 && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
            Top {top3.length} things to improve
          </p>
          <ul className="flex flex-col gap-2">
            {top3.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300 text-[9px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-snug">{r.suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Full breakdown */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Score Breakdown
          </p>
          {breakdown.length > 6 && (
            <button
              onClick={() => setShowAll(v => !v)}
              className="text-[11px] text-blue-500 hover:text-blue-600 transition-colors"
            >
              {showAll ? 'Show less' : `Show all ${breakdown.length}`}
            </button>
          )}
        </div>

        <ul className="flex flex-col gap-1.5">
          {displayed.map((r, i) => (
            <li
              key={i}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs ${
                r.passed
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900'
                  : 'bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900'
              }`}
            >
              {r.passed
                ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                : <XCircle     size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-semibold leading-snug ${
                    r.passed ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-700 dark:text-red-400'
                  }`}>
                    {r.rule}
                  </span>
                  <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    r.passed
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                      : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                  }`}>
                    {r.points}/{r.maxPoints}
                  </span>
                </div>
                {!r.passed && (
                  <p className="text-red-500 dark:text-red-400 mt-0.5 leading-snug">{r.suggestion}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Re-check button */}
      <button
        onClick={calculate}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <RefreshCw size={13} />
        Re-check Score
      </button>
    </div>
  );
}
