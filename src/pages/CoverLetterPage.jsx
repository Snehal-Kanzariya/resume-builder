import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText, Wand2, Copy, Printer, Download, RefreshCw,
  CheckCheck, Loader2, ChevronDown, AlignLeft,
} from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../context/ToastContext';
import { generateCoverLetter } from '../utils/coverLetterGenerator';

const STORAGE_KEY = 'resumeai_cover_letter';

const TONES = [
  { value: 'professional',   label: 'Professional' },
  { value: 'enthusiastic',   label: 'Enthusiastic' },
  { value: 'formal',         label: 'Formal' },
  { value: 'conversational', label: 'Conversational' },
];

const LENGTHS = [
  { value: 'short',  label: 'Short',  sub: '~200 words' },
  { value: 'medium', label: 'Medium', sub: '~300 words' },
  { value: 'long',   label: 'Long',   sub: '~450 words' },
];

// ── Persisted state helpers ───────────────────────────────────────────────────
function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota */ }
}

// ── Word count ────────────────────────────────────────────────────────────────
function wordCount(text) {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

// ── PDF generation (html2canvas + jsPDF via CDN-like dynamic import) ──────────
async function downloadAsPDF(letterText, jobTitle, company) {
  const { default: jsPDF } = await import('jspdf');
  const isPremium = JSON.parse(localStorage.getItem('resumeai_premium') || 'false');

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin  = 20;
  const pageW   = doc.internal.pageSize.getWidth();
  const pageH   = doc.internal.pageSize.getHeight();
  const maxW    = pageW - margin * 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);

  const lines = doc.splitTextToSize(letterText, maxW);
  let y = margin;

  for (const line of lines) {
    if (y + 7 > pageH - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 6;
  }

  if (!isPremium) {
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(176, 176, 176);
      doc.text('Built with ResumeAI', pageW - 42, pageH - 5);
    }
  }

  const filename = `Cover Letter — ${company || 'Company'} — ${jobTitle || 'Role'}.pdf`.replace(/[/\\?%*:|"<>]/g, '-');
  doc.save(filename);
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CoverLetterPage() {
  const { resumeData } = useResume();
  const toast = useToast();

  // ── Form state ──────────────────────────────────────────────────────────────
  const saved = loadSaved();
  const [jobTitle,        setJobTitle]        = useState(saved?.jobTitle        || '');
  const [company,         setCompany]         = useState(saved?.company         || '');
  const [jobDescription,  setJobDescription]  = useState(saved?.jobDescription  || '');
  const [tone,            setTone]            = useState(saved?.tone            || 'professional');
  const [length,          setLength]          = useState(saved?.length          || 'medium');
  const [keyPoints,       setKeyPoints]       = useState(saved?.keyPoints       || '');
  const [letterText,      setLetterText]      = useState(saved?.letterText      || '');

  // ── UI state ────────────────────────────────────────────────────────────────
  const [generating,  setGenerating]  = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [error,       setError]       = useState('');
  const previewRef = useRef(null);

  // Persist form + letter on any change
  useEffect(() => {
    saveState({ jobTitle, company, jobDescription, tone, length, keyPoints, letterText });
  }, [jobTitle, company, jobDescription, tone, length, keyPoints, letterText]);

  // ── Generate ────────────────────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!jobTitle.trim() || !company.trim()) {
      setError('Please enter a job title and company name.');
      return;
    }
    setError('');
    setGenerating(true);
    try {
      const result = await generateCoverLetter(
        resumeData, jobTitle, company, jobDescription, tone, length, keyPoints
      );
      setLetterText(result);
      toast('Cover letter generated!', 'success', 2500);
    } catch (err) {
      setError(err.message || 'Generation failed. Check your API key.');
    } finally {
      setGenerating(false);
    }
  }, [resumeData, jobTitle, company, jobDescription, tone, length, keyPoints, toast]);

  // ── Copy ────────────────────────────────────────────────────────────────────
  async function handleCopy() {
    if (!letterText) return;
    await navigator.clipboard.writeText(letterText);
    setCopied(true);
    toast('Copied to clipboard!', 'success', 2000);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Print ───────────────────────────────────────────────────────────────────
  function handlePrint() {
    if (!letterText) return;
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><title>Cover Letter</title>
      <style>
        body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.7;
               max-width: 700px; margin: 60px auto; color: #1e293b; white-space: pre-wrap; }
        @page { size: A4; margin: 20mm; }
      </style></head><body>${letterText.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }

  // ── Download PDF ────────────────────────────────────────────────────────────
  async function handleDownloadPDF() {
    if (!letterText) return;
    try {
      await downloadAsPDF(letterText, jobTitle, company);
      toast('PDF downloaded!', 'success', 2000);
    } catch (err) {
      toast('PDF generation failed: ' + err.message, 'error', 4000);
    }
  }

  const wc = wordCount(letterText);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Form panel ─────────────────────────────────────────────── */}
        <div className="flex flex-col w-full md:w-[420px] flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-6 flex-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800 dark:text-slate-100">Cover Letter Generator</h1>
                <p className="text-xs text-slate-400 dark:text-slate-500">AI-powered, tailored to your resume</p>
              </div>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">

              {/* Job Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="input-field"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Acme Inc."
                  className="input-field"
                />
              </div>

              {/* Tone */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors text-left ${
                        tone === t.value
                          ? 'bg-blue-50 dark:bg-blue-950 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {LENGTHS.map(l => (
                    <button
                      key={l.value}
                      onClick={() => setLength(l.value)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors text-center ${
                        length === l.value
                          ? 'bg-blue-50 dark:bg-blue-950 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div>{l.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{l.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Job Description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for a more tailored letter..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              {/* Key Points */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Key Points to Emphasise <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={keyPoints}
                  onChange={e => setKeyPoints(e.target.value)}
                  placeholder="e.g. 5 years React experience, led team of 8, reduced load time by 40%..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
              >
                {generating ? (
                  <><Loader2 size={16} className="animate-spin" /> Generating…</>
                ) : (
                  <><Wand2 size={16} /> Generate Cover Letter</>
                )}
              </button>

              {generating && (
                <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 -mt-2">
                  This may take a few seconds…
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Preview panel ─────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-2">
              <AlignLeft size={15} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Cover Letter Preview</span>
              {letterText && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1">
                  {wc} words
                </span>
              )}
            </div>

            {letterText && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  title="Regenerate"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={12} />
                  Regenerate
                </button>
                <button
                  onClick={handleCopy}
                  title="Copy to clipboard"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  {copied ? <CheckCheck size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handlePrint}
                  title="Print"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  <Printer size={12} />
                  Print
                </button>
                <button
                  onClick={handleDownloadPDF}
                  title="Download as PDF"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 transition-colors"
                >
                  <Download size={12} />
                  PDF
                </button>
              </div>
            )}
          </div>

          {/* Letter content */}
          <div ref={previewRef} className="flex-1 overflow-y-auto p-6 md:p-10">
            {!letterText && !generating ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <FileText size={28} className="text-slate-300 dark:text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No letter yet</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Fill in the form and click <strong>Generate Cover Letter</strong>
                  </p>
                </div>
              </div>
            ) : generating ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader2 size={28} className="animate-spin text-blue-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Writing your cover letter…</p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                {/* Letter header */}
                <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {jobTitle || 'Role'} — {company || 'Company'}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 capitalize">
                    {tone} tone · {length} length
                  </p>
                </div>

                {/* Editable letter body */}
                <textarea
                  value={letterText}
                  onChange={e => setLetterText(e.target.value)}
                  className="w-full min-h-[500px] bg-transparent text-sm text-slate-700 dark:text-slate-300 leading-relaxed resize-none focus:outline-none font-serif"
                  spellCheck
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
