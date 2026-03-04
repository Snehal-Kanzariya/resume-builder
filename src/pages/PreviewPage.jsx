import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { ArrowLeft, Printer, Download, Loader2, FileText } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { downloadPDF, buildFilename, PRINT_PAGE_STYLE } from '../utils/pdfExport';
import A4Container from '../components/Preview/A4Container';
import { TEMPLATES, FONT_SCALES } from '../components/Preview/ResumePreview';

export default function PreviewPage() {
  const printContentRef = useRef(null);
  const { resumeData } = useResume();
  const { selectedTemplate, fontSize } = resumeData.settings;
  const { personalInfo } = resumeData;

  const [isDownloading, setDownloading] = useState(false);

  const { Component } = TEMPLATES.find(t => t.id === selectedTemplate) ?? TEMPLATES[0];
  const contentScale  = FONT_SCALES[fontSize] ?? 1.0;
  const filename      = buildFilename(personalInfo.fullName);

  const handlePrint = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: filename.replace('.pdf', ''),
    pageStyle: PRINT_PAGE_STYLE,
  });

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadPDF(printContentRef.current, filename);
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-200 dark:bg-slate-950 overflow-hidden transition-colors">

      {/* ── TOP TOOLBAR ──────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm transition-colors">

        <Link
          to="/builder"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors mr-2"
        >
          <ArrowLeft size={16} />
          Back to Editor
        </Link>

        <div className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500">
          <FileText size={15} />
          <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[240px]">
            {personalInfo.fullName || 'Untitled Resume'}
          </span>
        </div>

        <div className="flex-1" />

        <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 capitalize">
          {selectedTemplate} template
        </span>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Open browser print dialog"
        >
          <Printer size={15} />
          <span className="hidden sm:inline">Print</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors"
        >
          {isDownloading
            ? <><Loader2 size={15} className="animate-spin" /><span className="hidden sm:inline">Generating…</span></>
            : <><Download size={15} /><span className="hidden sm:inline">Download PDF</span></>
          }
        </button>
      </header>

      {/* ── FULL-SCREEN A4 PREVIEW ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-[860px] mx-auto">
          <A4Container contentScale={contentScale}>
            <Component />
          </A4Container>
        </div>
      </main>

      {/* Hidden full-res print target */}
      <div
        style={{ position: 'fixed', left: '-9999px', top: 0, width: '794px', zIndex: -1 }}
        aria-hidden="true"
      >
        <div
          ref={printContentRef}
          style={{ width: '794px', height: '1123px', backgroundColor: '#ffffff', overflow: 'hidden' }}
        >
          <Component />
        </div>
      </div>
    </div>
  );
}
