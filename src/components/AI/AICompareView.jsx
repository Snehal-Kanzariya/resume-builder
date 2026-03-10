import { useState, useRef } from 'react';
import {
  X, GitMerge, Check, RotateCcw, Download, Loader2,
  ArrowLeft, LayoutTemplate, Palette,
} from 'lucide-react';
import { useResume, ResumeContext } from '../../context/ResumeContext';
import { TEMPLATES, FONT_SCALES } from '../Preview/ResumePreview';
import A4Container from '../Preview/A4Container';
import { downloadPDF, buildFilename } from '../../utils/pdfExport';

const ACCENT_PRESETS = [
  '#2563eb', '#7c3aed', '#059669', '#dc2626',
  '#d97706', '#0891b2', '#db2777', '#1e293b',
];

// ── Sections user can choose to merge ────────────────────────────────────────
const SECTIONS_LIST = [
  { key: 'personalInfo',    label: 'Personal Info' },
  { key: 'experience',      label: 'Experience' },
  { key: 'education',       label: 'Education' },
  { key: 'skills',          label: 'Skills' },
  { key: 'projects',        label: 'Projects' },
  { key: 'certifications',  label: 'Certifications' },
];

// ── Renders a resume using overridden resumeData (for AI side) ────────────────
function StaticResumeProvider({ data, children }) {
  const ctx = useResume();
  return (
    <ResumeContext.Provider value={{ ...ctx, resumeData: data }}>
      {children}
    </ResumeContext.Provider>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AICompareView({ onClose }) {
  const {
    resumeData, aiResumeData,
    acceptAllAi, mergeAiSections, clearAiData,
    updateSettings,
  } = useResume();

  const [showMerge,     setShowMerge]     = useState(false);
  const [mergeSelected, setMergeSelected] = useState(
    Object.fromEntries(SECTIONS_LIST.map(s => [s.key, false])),
  );
  const [downloading, setDownloading] = useState(null); // 'original' | 'ai' | null

  // Off-screen full-res targets for PDF export
  const origPdfRef = useRef(null);
  const aiPdfRef   = useRef(null);

  const { selectedTemplate, accentColor, fontSize } = resumeData.settings;
  const { Component } = TEMPLATES.find(t => t.id === selectedTemplate) ?? TEMPLATES[0];
  const scale = FONT_SCALES[fontSize] ?? 1.0;

  function handleAcceptAll() {
    acceptAllAi();
    onClose();
  }

  function handleKeepOriginal() {
    clearAiData();
    onClose();
  }

  function handleMergeApply() {
    const sections = Object.entries(mergeSelected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (sections.length > 0) mergeAiSections(sections);
    onClose();
  }

  async function handleDownload(type) {
    const ref      = type === 'original' ? origPdfRef : aiPdfRef;
    const data     = type === 'original' ? resumeData : aiResumeData;
    const filename = buildFilename(data.personalInfo?.fullName).replace('.pdf', `_${type}.pdf`);
    setDownloading(type);
    try {
      await downloadPDF(ref.current, filename);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setDownloading(null);
    }
  }

  if (!aiResumeData) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/75">

      {/* ── ROW 1: Navigation + actions ──────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-2.5 flex items-center gap-2 flex-wrap">

        {/* Back to Builder */}
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors mr-1 flex-shrink-0"
          title="Close compare view and return to Builder"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Back to Builder</span>
        </button>

        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex-1 min-w-0">
          ✨ AI Resume Comparison
        </h2>

        {!showMerge ? (
          <>
            <button
              onClick={handleKeepOriginal}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex-shrink-0"
            >
              <RotateCcw size={13} /> Keep Original
            </button>
            <button
              onClick={() => setShowMerge(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-purple-300 hover:bg-purple-50 text-purple-700 transition-colors flex-shrink-0"
            >
              <GitMerge size={13} /> Merge Sections
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex-shrink-0"
            >
              <Check size={13} /> Use AI Version
            </button>
          </>
        ) : (
          <>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">Take from AI:</span>
            {SECTIONS_LIST.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none flex-shrink-0">
                <input
                  type="checkbox"
                  checked={mergeSelected[key]}
                  onChange={e => setMergeSelected(p => ({ ...p, [key]: e.target.checked }))}
                  className="accent-purple-600"
                />
                {label}
              </label>
            ))}
            <button
              onClick={() => setShowMerge(false)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex-shrink-0"
            >
              Cancel
            </button>
            <button
              onClick={handleMergeApply}
              className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex-shrink-0"
            >
              Apply Merge
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ml-1 flex-shrink-0"
          title="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── ROW 2: Theme controls (template + accent color) ───────────────────── */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-1.5 flex items-center gap-3 flex-wrap">

        {/* Template selector */}
        <div className="flex items-center gap-1.5">
          <LayoutTemplate size={13} className="text-slate-400 flex-shrink-0" />
          <select
            value={selectedTemplate}
            onChange={e => updateSettings('selectedTemplate', e.target.value)}
            className="text-xs font-medium text-slate-700 dark:text-slate-200 bg-transparent border-none outline-none cursor-pointer dark:bg-slate-900"
          >
            {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

        {/* Accent color presets + custom picker */}
        <div className="flex items-center gap-1.5">
          <Palette size={13} className="text-slate-400 flex-shrink-0" />
          <div className="flex gap-1 items-center">
            {ACCENT_PRESETS.map(color => (
              <button
                key={color}
                onClick={() => updateSettings('accentColor', color)}
                title={color}
                style={{ backgroundColor: color }}
                className={`w-3.5 h-3.5 rounded-full flex-shrink-0 transition-transform hover:scale-125 ${
                  accentColor === color ? 'ring-2 ring-offset-1 ring-slate-500 scale-125' : ''
                }`}
              />
            ))}
            <label
              className="relative w-3.5 h-3.5 rounded-full overflow-hidden cursor-pointer border border-slate-300 flex-shrink-0"
              title="Custom colour"
            >
              <input
                type="color"
                value={accentColor}
                onChange={e => updateSettings('accentColor', e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <span
                className="absolute inset-0"
                style={{ background: 'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)' }}
              />
            </label>
          </div>
        </div>

        <p className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
          Theme changes apply to both versions
        </p>
      </div>

      {/* ── SIDE-BY-SIDE PREVIEWS ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto flex flex-col md:flex-row gap-4 p-4 bg-slate-200 dark:bg-slate-950">

        {/* Original */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Your Version
            </span>
            <button
              onClick={() => handleDownload('original')}
              disabled={downloading === 'original'}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors disabled:opacity-50"
            >
              {downloading === 'original'
                ? <><Loader2 size={11} className="animate-spin" /> Saving…</>
                : <><Download size={11} /> Download</>}
            </button>
          </div>
          <div className="overflow-auto rounded-lg shadow-md bg-white">
            <A4Container contentScale={scale}>
              <Component />
            </A4Container>
          </div>
        </div>

        {/* AI Version */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
              ✨ AI Enhanced
            </span>
            <button
              onClick={() => handleDownload('ai')}
              disabled={downloading === 'ai'}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white border border-purple-600 transition-colors disabled:opacity-50"
            >
              {downloading === 'ai'
                ? <><Loader2 size={11} className="animate-spin" /> Saving…</>
                : <><Download size={11} /> Download</>}
            </button>
          </div>
          <div className="overflow-auto rounded-lg shadow-md bg-white ring-2 ring-purple-400">
            <StaticResumeProvider data={{ ...aiResumeData, settings: resumeData.settings }}>
              <A4Container contentScale={scale}>
                <Component />
              </A4Container>
            </StaticResumeProvider>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 py-2.5 flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <ArrowLeft size={13} /> Back to Builder
        </button>
        <button
          onClick={() => handleDownload('original')}
          disabled={downloading === 'original'}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50"
        >
          <Download size={13} /> Download Original PDF
        </button>
        <button
          onClick={() => handleDownload('ai')}
          disabled={downloading === 'ai'}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50"
        >
          <Download size={13} /> Download AI PDF
        </button>
      </div>

      {/* ── OFF-SCREEN FULL-RES PDF TARGETS (794×1123, no scaling) ─────────── */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '794px', zIndex: -1 }}>
        <div ref={origPdfRef} style={{ width: '794px', height: '1123px', backgroundColor: '#fff', overflow: 'hidden' }}>
          <Component />
        </div>
      </div>
      <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '794px', zIndex: -1 }}>
        <StaticResumeProvider data={{ ...aiResumeData, settings: resumeData.settings }}>
          <div ref={aiPdfRef} style={{ width: '794px', height: '1123px', backgroundColor: '#fff', overflow: 'hidden' }}>
            <Component />
          </div>
        </StaticResumeProvider>
      </div>
    </div>
  );
}
