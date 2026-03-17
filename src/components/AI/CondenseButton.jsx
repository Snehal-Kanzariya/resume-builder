import { useState } from 'react';
import { Scissors, Loader2, Check, X } from 'lucide-react';

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL    = 'llama-3.3-70b-versatile';

async function callGroqCondense(text, sectionName) {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) throw new Error('No GROQ API key');

  // 4-second rate-limit buffer
  await new Promise(r => setTimeout(r, 4000));

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content:
            `Shorten this resume ${sectionName} to be more concise while keeping all key facts, metrics, and impact. ` +
            `Reduce word count by about 30-40%. Keep action verbs and numbers. ` +
            `Return ONLY the condensed text, no JSON, no explanation.`,
        },
        { role: 'user', content: text },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Groq error ${res.status}`);
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content ?? '').trim();
}

function wordCount(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Subtle "✂ Condense with AI" link shown below a text area or bullet list.
 *
 * Props:
 *   text        — current text (string or string[] for bullets)
 *   onCondensed — callback(condensed: string | string[]) applied when user accepts
 *   sectionName — label used in the Groq prompt, e.g. "summary", "bullet points"
 */
export default function CondenseButton({ text, onCondensed, sectionName = 'text' }) {
  const [state,     setState]     = useState('idle'); // idle | loading | preview | done
  const [condensed, setCondensed] = useState('');
  const [error,     setError]     = useState('');

  const isBullets = Array.isArray(text);
  const flatText  = isBullets ? text.filter(Boolean).join('\n') : (text || '');

  // Don't render if there's nothing to condense
  if (!flatText.trim()) return null;

  async function handleClick() {
    setState('loading');
    setError('');
    try {
      const result = await callGroqCondense(flatText, sectionName);
      setCondensed(result);
      setState('preview');
    } catch (err) {
      setError(err.message);
      setState('idle');
    }
  }

  function handleAccept() {
    if (isBullets) {
      // Split condensed text back into bullets on newline boundaries
      const bullets = condensed.split('\n').map(l => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
      onCondensed(bullets);
    } else {
      onCondensed(condensed);
    }
    setState('done');
    setTimeout(() => setState('idle'), 2000);
  }

  function handleDismiss() {
    setState('idle');
    setCondensed('');
  }

  const originalWords  = wordCount(flatText);
  const condensedWords = wordCount(condensed);
  const savedWords     = originalWords - condensedWords;

  if (state === 'done') {
    return (
      <p className="flex items-center gap-1 text-xs text-emerald-600 mt-1.5">
        <Check size={12} /> Applied
      </p>
    );
  }

  if (state === 'preview') {
    return (
      <div className="mt-2 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
        {/* Original */}
        <div className="bg-slate-50 dark:bg-slate-800/60 px-3 py-2 border-b border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Original</p>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{flatText}</p>
        </div>
        {/* Condensed */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2">
          <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-1">
            Condensed {savedWords > 0 ? `— saves ${savedWords} word${savedWords === 1 ? '' : 's'}` : ''}
          </p>
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{condensed}</p>
        </div>
        {/* Actions */}
        <div className="flex gap-2 px-3 py-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleAccept}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            <Check size={11} /> Use Condensed
          </button>
          <button
            onClick={handleDismiss}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <X size={11} /> Keep Original
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-1.5">
      <button
        onClick={handleClick}
        disabled={state === 'loading'}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors disabled:opacity-60"
      >
        {state === 'loading'
          ? <><Loader2 size={11} className="animate-spin" /> Condensing…</>
          : <><Scissors size={11} /> ✂ Condense with AI</>
        }
      </button>
      {error && <p className="text-[10px] text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
