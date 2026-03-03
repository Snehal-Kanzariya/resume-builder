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

  // ── react-to-print ────────────────────────────────────────────────────────
  const handlePrint = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: filename.replace('.pdf', ''),
    pageStyle: PRINT_PAGE_STYLE,
  });

  // ── html2canvas + jsPDF download ──────────────────────────────────────────
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
    <div className="flex flex-col h-screen bg-slate-200 overflow-hidden">

      {/* ── TOP TOOLBAR ──────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-200 flex-shrink-0 shadow-sm">

        {/* Back to editor */}
        <Link
          to="/builder"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mr-2"
        >
          <ArrowLeft size={16} />
          Back to Editor
        </Link>

        {/* Name badge */}
        <div className="flex items-center gap-1.5 text-sm text-slate-400">
          <FileText size={15} />
          <span className="font-medium text-slate-700 truncate max-w-[240px]">
            {personalInfo.fullName || 'Untitled Resume'}
          </span>
        </div>

        <div className="flex-1" />

        {/* Template label */}
        <span className="hidden sm:inline text-xs text-slate-400 capitalize">
          {selectedTemplate} template
        </span>

        <div className="w-px h-5 bg-slate-200 hidden sm:block" />

        {/* Print (react-to-print — selectable text output) */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Open browser print dialog — output has selectable text"
        >
          <Printer size={15} />
          <span className="hidden sm:inline">Print</span>
        </button>

        {/* Download PDF (html2canvas fallback) */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors"
          title="Download as PDF (image-based)"
        >
          {isDownloading
            ? <><Loader2 size={15} className="animate-spin" /><span className="hidden sm:inline">Generating…</span></>
            : <><Download size={15} /><span className="hidden sm:inline">Download PDF</span></>
          }
        </button>
      </header>

      {/* ── FULL-SCREEN A4 PREVIEW ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto py-8 px-4">
        {/* Max-width constrains A4 to a readable size; auto-scales via A4Container */}
        <div className="max-w-[860px] mx-auto">
          <A4Container contentScale={contentScale}>
            <Component />
          </A4Container>
        </div>
      </main>

      {/* ── HIDDEN FULL-RES PRINT TARGET ─────────────────────────────────────
           794×1123 px, no transforms — targeted by react-to-print and html2canvas  ── */}
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
