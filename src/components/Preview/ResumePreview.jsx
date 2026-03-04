import { forwardRef, lazy, Suspense, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  LayoutTemplate, Palette, ZoomIn,
  Type, FlaskConical, Check,
  Printer, Download, Loader2, Sparkles, GitCompare,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { sampleData } from '../../data/sampleData';
import { downloadPDF, buildFilename, PRINT_PAGE_STYLE } from '../../utils/pdfExport';
import AICompareView from '../AI/AICompareView';
import A4Container from './A4Container';

// Lazy-load all 10 templates to split the main bundle
const ModernTemplate       = lazy(() => import('../Templates/ModernTemplate'));
const ClassicTemplate      = lazy(() => import('../Templates/ClassicTemplate'));
const MinimalTemplate      = lazy(() => import('../Templates/MinimalTemplate'));
const CreativeTemplate     = lazy(() => import('../Templates/CreativeTemplate'));
const ProfessionalTemplate = lazy(() => import('../Templates/ProfessionalTemplate'));
const ExecutiveTemplate    = lazy(() => import('../Templates/ExecutiveTemplate'));
const TechTemplate         = lazy(() => import('../Templates/TechTemplate'));
const CompactTemplate      = lazy(() => import('../Templates/CompactTemplate'));
const ElegantTemplate      = lazy(() => import('../Templates/ElegantTemplate'));
const BoldTemplate         = lazy(() => import('../Templates/BoldTemplate'));

function TemplateFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px] text-slate-300">
      <Loader2 size={24} className="animate-spin" />
    </div>
  );
}

// ── Config ────────────────────────────────────────────────────────────────────

export const TEMPLATES = [
  { id: 'modern',       label: 'Modern',       Component: ModernTemplate },
  { id: 'classic',      label: 'Classic',      Component: ClassicTemplate },
  { id: 'minimal',      label: 'Minimal',      Component: MinimalTemplate },
  { id: 'creative',     label: 'Creative',     Component: CreativeTemplate },
  { id: 'professional', label: 'Professional', Component: ProfessionalTemplate },
  { id: 'executive',    label: 'Executive',    Component: ExecutiveTemplate },
  { id: 'tech',         label: 'Tech',         Component: TechTemplate },
  { id: 'compact',      label: 'Compact',      Component: CompactTemplate },
  { id: 'elegant',      label: 'Elegant',      Component: ElegantTemplate },
  { id: 'bold',         label: 'Bold',         Component: BoldTemplate },
];

export const FONT_SCALES = { small: 0.88, medium: 1.0, large: 1.11 };

const ACCENT_PRESETS = [
  '#2563eb', '#7c3aed', '#059669', '#dc2626',
  '#d97706', '#0891b2', '#db2777', '#1e293b',
];

const ZOOM_WIDTHS = { fit: '100%', '75': '75%', '100': '794px' };

// ── Small helpers ─────────────────────────────────────────────────────────────

function Sep() {
  return <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />;
}

function SegmentedBtn({ options, value, onChange }) {
  return (
    <div className="flex rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-2 py-0.5 text-[10px] font-medium transition-colors border-r last:border-r-0 border-slate-200 dark:border-slate-700 ${
            value === key ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── ResumePreview ─────────────────────────────────────────────────────────────

const ResumePreview = forwardRef(function ResumePreview(_props, _externalRef) {
  // Hidden full-res print target (794×1123, no CSS transforms)
  const printContentRef = useRef(null);

  const { resumeData, updateSettings, loadSampleData, aiResumeData } = useResume();
  const toast = useToast();
  const { selectedTemplate, accentColor, fontSize } = resumeData.settings;

  const [zoom,          setZoom]       = useState('fit');
  const [sampleLoaded,  setSample]     = useState(false);
  const [isDownloading, setDownloading] = useState(false);
  const [showCompare,    setShowCompare]  = useState(false);

  const { Component } = TEMPLATES.find(t => t.id === selectedTemplate) ?? TEMPLATES[0];
  const contentScale  = FONT_SCALES[fontSize] ?? 1.0;

  // ── react-to-print (primary — selectable text, exact colours) ────────────
  const handlePrint = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: buildFilename(resumeData.personalInfo.fullName).replace('.pdf', ''),
    pageStyle: PRINT_PAGE_STYLE,
  });

  // ── html2canvas + jsPDF (fallback download) ───────────────────────────────
  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadPDF(
        printContentRef.current,
        buildFilename(resumeData.personalInfo.fullName),
      );
      toast('PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF export failed:', err);
      toast('PDF download failed. Try the Print button instead.', 'error');
    } finally {
      setDownloading(false);
    }
  }

  function handleLoadSample() {
    loadSampleData(sampleData);
    setSample(true);
    setTimeout(() => setSample(false), 2000);
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden">

      {/* ── TOOLBAR ──────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 transition-colors">

        {/* Row 1 — template · colours · sample data */}
        <div className="flex items-center gap-2 px-3 py-2 flex-wrap">

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

          <Sep />

          {/* Accent presets + custom picker */}
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

          <Sep />

          {/* Sample data */}
          <button
            onClick={handleLoadSample}
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-all flex-shrink-0 ${
              sampleLoaded
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {sampleLoaded ? <><Check size={12} /> Loaded!</> : <><FlaskConical size={12} /> Sample Data</>}
          </button>
        </div>

        {/* Row 2 — font size · zoom · print · download */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-t border-slate-100 dark:border-slate-700/50 flex-wrap">

          {/* Font size */}
          <div className="flex items-center gap-1.5">
            <Type size={12} className="text-slate-400 flex-shrink-0" />
            <SegmentedBtn
              value={fontSize}
              onChange={v => updateSettings('fontSize', v)}
              options={[
                { key: 'small',  label: 'S' },
                { key: 'medium', label: 'M' },
                { key: 'large',  label: 'L' },
              ]}
            />
          </div>

          <Sep />

          {/* Zoom */}
          <div className="flex items-center gap-1.5">
            <ZoomIn size={12} className="text-slate-400 flex-shrink-0" />
            <SegmentedBtn
              value={zoom}
              onChange={setZoom}
              options={[
                { key: 'fit', label: 'Fit'  },
                { key: '75',  label: '75%'  },
                { key: '100', label: '100%' },
              ]}
            />
          </div>

          <Sep />

          {/* Print (react-to-print — selectable text) */}
          <button
            onClick={handlePrint}
            data-print-btn
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex-shrink-0"
            title="Open browser print dialog (Ctrl+P)"
          >
            <Printer size={13} />
            Print
          </button>

          {/* Download PDF (html2canvas fallback) */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white transition-colors flex-shrink-0"
            title="Download PDF via html2canvas"
          >
            {isDownloading
              ? <><Loader2 size={13} className="animate-spin" /> Generating…</>
              : <><Download size={13} /> Download PDF</>
            }
          </button>
        </div>

        {/* Row 3 — Compare Versions (shown only when AI data is ready) */}
        {aiResumeData && (
          <div className="flex items-center gap-2 px-3 py-1.5 border-t border-purple-100 bg-purple-50 flex-wrap">
            <button
              onClick={() => setShowCompare(true)}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-white border border-purple-400 text-purple-700 hover:bg-purple-50 transition-colors flex-shrink-0 animate-pulse"
            >
              <GitCompare size={13} /> Compare Versions
            </button>
            <span className="text-[10px] text-purple-400 ml-auto flex-shrink-0">
              Powered by AI
            </span>
          </div>
        )}
      </div>

      {/* ── AI READY BANNER ──────────────────────────────────────────────────── */}
      {aiResumeData && (
        <button
          onClick={() => setShowCompare(true)}
          className="flex-shrink-0 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-2 px-4 flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles size={13} />
          AI enhanced version is ready — click to compare
          <GitCompare size={13} />
        </button>
      )}

      {/* ── A4 PREVIEW (scaled to fit panel) ────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto overflow-x-auto p-4 bg-slate-100 dark:bg-slate-950 transition-colors"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div
          style={{
            width: ZOOM_WIDTHS[zoom],
            minWidth: zoom === '100' ? '794px' : undefined,
            margin: zoom === '75' ? '0 auto' : undefined,
            transition: 'width 0.2s ease',
          }}
        >
          <A4Container contentScale={contentScale}>
            <Suspense fallback={<TemplateFallback />}>
              <Component />
            </Suspense>
          </A4Container>
        </div>
      </div>

      {/* ── HIDDEN FULL-RES PRINT TARGET ─────────────────────────────────────
           794×1123 px at native scale, no CSS transforms.
           react-to-print and html2canvas both target this element.        ── */}
      <div
        style={{ position: 'fixed', left: '-9999px', top: 0, width: '794px', zIndex: -1 }}
        aria-hidden="true"
      >
        <div
          ref={printContentRef}
          style={{ width: '794px', height: '1123px', backgroundColor: '#ffffff', overflow: 'hidden' }}
        >
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        </div>
      </div>

      {/* ── AI COMPARE MODAL ─────────────────────────────────────────────────── */}
      {showCompare && aiResumeData && (
        <AICompareView onClose={() => setShowCompare(false)} />
      )}
    </div>
  );
});

export default ResumePreview;
