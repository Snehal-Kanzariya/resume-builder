import { Check, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 'upload',  label: 'File Uploaded'    },
  { id: 'extract', label: 'Extracting Text'  },
  { id: 'parse',   label: 'AI Parsing'       },
  { id: 'fill',    label: 'Forms Filled'     },
];

/**
 * @param {'upload'|'extract'|'parse'|'fill'} currentStep - the active step
 * @param {object|null} summary - { jobs, degrees, skills, projects }
 */
export default function ResumeParsingStatus({ currentStep, summary = null }) {
  const currentIdx = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full">
      {/* Step track */}
      <div className="flex items-center gap-0 mb-6">
        {STEPS.map((step, i) => {
          const done    = i < currentIdx;
          const active  = i === currentIdx;
          const pending = i > currentIdx;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : active
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  {done ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : active ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <span className="text-[11px] font-bold">{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium text-center leading-tight max-w-[56px] ${
                    done
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : active
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-5 transition-colors duration-300 ${
                    i < currentIdx
                      ? 'bg-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Summary (shown when fill step is done/active) */}
      {summary && currentStep === 'fill' && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
            Successfully extracted:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Work experiences', val: summary.jobs },
              { label: 'Education entries', val: summary.degrees },
              { label: 'Skill categories', val: summary.skills },
              { label: 'Projects', val: summary.projects },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900 flex items-center justify-center text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                  {val}
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
