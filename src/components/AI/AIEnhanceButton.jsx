import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { enhanceSection, hasApiKey } from '../../utils/aiEnhance';

/**
 * Per-section "Enhance with AI" button.
 * Props:
 *   sectionName  – e.g. "experience"
 *   sectionData  – the raw section data to send to the AI
 *   onEnhanced   – callback(enhancedData) called on success
 */
export default function AIEnhanceButton({ sectionName, sectionData, onEnhanced }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const noKey = !hasApiKey();

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const result = await enhanceSection(sectionName, sectionData);
      onEnhanced(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (noKey) {
    return (
      <div className="relative group inline-block">
        <button
          disabled
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed select-none"
        >
          <Sparkles size={13} />
          Enhance with AI
        </button>
        {/* Tooltip */}
        <div className="absolute bottom-full left-0 mb-2 w-72 p-2.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 hidden group-hover:block pointer-events-none leading-relaxed">
          Add your free Groq API key in <code className="bg-slate-700 px-1 rounded">.env</code> to
          enable AI features. Get one free at{' '}
          <span className="underline">console.groq.com</span>
          <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="inline-block">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white transition-colors"
      >
        {loading
          ? <><Loader2 size={13} className="animate-spin" /> Enhancing…</>
          : <><Sparkles size={13} /> Enhance with AI</>
        }
      </button>
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
