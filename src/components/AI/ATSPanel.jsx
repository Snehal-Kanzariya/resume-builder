import { X, BarChart3 } from 'lucide-react';
import ATSScoreCard from './ATSScoreCard';

/**
 * Slide-in modal panel that renders the ATS Score Card.
 * Closes on backdrop click or X button.
 */
export default function ATSPanel({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Side panel */}
      <div className="relative z-10 flex flex-col w-full max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-700 animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <BarChart3 size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">ATS Score</h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Rule-based resume analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <ATSScoreCard />
        </div>
      </div>
    </div>
  );
}
