import { Crown } from 'lucide-react';

/**
 * Small PRO badge shown next to premium features.
 * Displays a "Coming Soon" tooltip on hover.
 * No payment integration — purely cosmetic for now.
 */
export default function ProBadge({ className = '' }) {
  return (
    <span
      className={`group relative inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300 cursor-default select-none ${className}`}
      title="Pro feature — coming soon"
    >
      <Crown size={9} className="flex-shrink-0" />
      PRO
      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-slate-900 text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
        Coming Soon ✨
      </span>
    </span>
  );
}
