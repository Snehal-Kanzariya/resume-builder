import { Suspense, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Printer, Download, Loader2, FileText,
  LayoutTemplate, Palette,
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { downloadResumePDF, buildFilename, PRINT_PAGE_STYLE } from '../utils/pdfExport';
import A4Container from '../components/Preview/A4Container';
import { TEMPLATES, FONT_SCALES, ORIGINAL_TEMPLATE } from '../components/Preview/ResumePreview';

const PRINT_TARGET_ID = 'resume-print-area-preview';

const ACCENT_PRESETS = [
  '#03153a', '#7c3aed', '#059669', '#dc2626',
  '#d97706', '#0891b2', '#db2777', '#1e293b',
];

export default function PreviewPage() {
  const { resumeData, updateSettings, uploadedResumeStyle } = useResume();
  const { selectedTemplate, accentColor, fontSize } = resumeData?.settings ?? {};
  const personalInfo = resumeData?.personalInfo ?? {};

  const [isDownloading, setDownloading] = useState(false);
  const [pageCount,     setPageCount]   = useState(1);
  const printContentRef = useRef(null);

  const allTemplates = uploadedResumeStyle?.isUploaded
    ? [ORIGINAL_TEMPLATE, ...TEMPLATES]
    : TEMPLATES;

  const { Component } = allTemplates.find(t => t.id === selectedTemplate) ?? allTemplates[0];
  const contentScale  = FONT_SCALES[fontSize] ?? 1.0;
  const filename      = buildFilename(personalInfo.fullName ?? '');

  const handlePrint = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: filename.replace('.pdf', ''),
    pageStyle: PRINT_PAGE_STYLE,
  });

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadResumePDF(PRINT_TARGET_ID, filename);
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-200 dark:bg-slate-950 overflow-hidden transition-colors">

      {/* ── ROW 1: Navigation + name + print/download ────────────────────────── */}
      <header className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm transition-colors">
        <Link
          to="/builder"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors mr-1 flex-shrink-0"
        >
          <ArrowLeft size={16} />
          Back to Editor
        </Link>

        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

        <div className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 min-w-0">
          <FileText size={15} className="flex-shrink-0" />
          <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[200px]">
            {personalInfo.fullName || 'Untitled Resume'}
          </span>
        </div>

        <span className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
          pageCount >= 3
            ? 'bg-amber-100 text-amber-700'
            : pageCount === 2
              ? 'bg-blue-100 text-blue-700'
              : 'bg-slate-100 text-slate-500'
        }`}>
          {pageCount} {pageCount === 1 ? 'page' : 'pages'}
        </span>

        <div className="flex-1" />

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
          title="Open browser print dialog"
        >
          <Printer size={15} />
          <span className="hidden sm:inline">Print</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors flex-shrink-0"
        >
          {isDownloading
            ? <><Loader2 size={15} className="animate-spin" /><span className="hidden sm:inline">Generating…</span></>
            : <><Download size={15} /><span className="hidden sm:inline">Download PDF</span></>
          }
        </button>
      </header>

      {/* ── ROW 2: Theme controls ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-5 py-1.5 flex items-center gap-3 flex-wrap transition-colors">

        {/* Template selector */}
        <div className="flex items-center gap-1.5">
          <LayoutTemplate size={13} className="text-slate-400 flex-shrink-0" />
          <select
            value={selectedTemplate}
            onChange={e => updateSettings('selectedTemplate', e.target.value)}
            className="text-xs font-medium text-slate-700 dark:text-slate-200 bg-transparent border-none outline-none cursor-pointer dark:bg-slate-900"
          >
            {allTemplates.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

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

        <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block capitalize">
          {selectedTemplate} template
        </span>
      </div>

      {/* ── FULL-SCREEN A4 PREVIEW ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-[860px] mx-auto">
          <A4Container contentScale={contentScale} onPageCountChange={setPageCount}>
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          </A4Container>
        </div>
      </main>

      {/* Hidden full-res print target — no CSS transforms, exact A4 px */}
      <div
        style={{ position: 'fixed', left: '-9999px', top: 0, width: '794px', zIndex: -1 }}
        aria-hidden="true"
      >
        <div
          id={PRINT_TARGET_ID}
          ref={printContentRef}
          style={{ width: '794px', backgroundColor: '#ffffff' }}
        >
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
