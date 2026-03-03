import { forwardRef, useRef, useState } from 'react';
import {
  LayoutTemplate, Palette, ZoomIn, ZoomOut,
  Type, FlaskConical, Check,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { sampleData } from '../../data/sampleData';
import A4Container from './A4Container';

import ModernTemplate       from '../Templates/ModernTemplate';
import ClassicTemplate      from '../Templates/ClassicTemplate';
import MinimalTemplate      from '../Templates/MinimalTemplate';
import CreativeTemplate     from '../Templates/CreativeTemplate';
import ProfessionalTemplate from '../Templates/ProfessionalTemplate';

// ── Config ────────────────────────────────────────────────────────────────────

export const TEMPLATES = [
  { id: 'modern',       label: 'Modern',       Component: ModernTemplate },
  { id: 'classic',      label: 'Classic',      Component: ClassicTemplate },
  { id: 'minimal',      label: 'Minimal',      Component: MinimalTemplate },
  { id: 'creative',     label: 'Creative',     Component: CreativeTemplate },
  { id: 'professional', label: 'Professional', Component: ProfessionalTemplate },
];

const ACCENT_PRESETS = [
  '#2563eb', '#7c3aed', '#059669', '#dc2626',
  '#d97706', '#0891b2', '#db2777', '#1e293b',
];

const FONT_SCALES = { small: 0.88, medium: 1.0, large: 1.11 };

// zoom key → width of the A4Container wrapper inside the scroll area
const ZOOM_WIDTHS = { fit: '100%', '75': '75%', '100': `794px` };

// ── Divider ───────────────────────────────────────────────────────────────────
function Sep() {
  return <div className="w-px h-4 bg-slate-200 flex-shrink-0" />;
}

// ── ResumePreview ─────────────────────────────────────────────────────────────

const ResumePreview = forwardRef(function ResumePreview(_props, externalRef) {
  const internalRef = useRef(null);
  const printRef    = externalRef ?? internalRef;

  const { resumeData, updateSettings, loadSampleData } = useResume();
  const { selectedTemplate, accentColor, fontSize } = resumeData.settings;

  // Local UI state — not persisted
  const [zoom, setZoom]           = useState('fit');
  const [sampleLoaded, setSample] = useState(false);

  const { Component } = TEMPLATES.find(t => t.id === selectedTemplate) ?? TEMPLATES[0];
  const contentScale  = FONT_SCALES[fontSize] ?? 1.0;

  function handleLoadSample() {
    loadSampleData(sampleData);
    setSample(true);
    setTimeout(() => setSample(false), 2000);
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden">

      {/* ── TOOLBAR ─────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200">

        {/* Row 1 — template + color + sample */}
        <div className="flex items-center gap-2 px-3 py-2 flex-wrap">

          {/* Template selector */}
          <div className="flex items-center gap-1.5 min-w-0">
            <LayoutTemplate size={13} className="text-slate-400 flex-shrink-0" />
            <select
              value={selectedTemplate}
              onChange={e => updateSettings('selectedTemplate', e.target.value)}
              className="text-xs font-medium text-slate-700 bg-transparent border-none outline-none cursor-pointer max-w-[100px]"
            >
              {TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <Sep />

          {/* Accent color presets */}
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
                    accentColor === color
                      ? 'ring-2 ring-offset-1 ring-slate-500 scale-125'
                      : ''
                  }`}
                />
              ))}
              {/* Custom color input */}
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

          {/* Load Sample Data */}
          <button
            onClick={handleLoadSample}
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-all flex-shrink-0 ${
              sampleLoaded
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800'
            }`}
          >
            {sampleLoaded
              ? <><Check size={12} /> Loaded!</>
              : <><FlaskConical size={12} /> Sample Data</>
            }
          </button>
        </div>

        {/* Row 2 — font size + zoom */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-t border-slate-100 flex-wrap">

          {/* Font size */}
          <div className="flex items-center gap-1.5">
            <Type size={12} className="text-slate-400 flex-shrink-0" />
            <div className="flex rounded-md border border-slate-200 overflow-hidden">
              {(['small', 'medium', 'large']).map((size, i) => (
                <button
                  key={size}
                  onClick={() => updateSettings('fontSize', size)}
                  className={`px-2 py-0.5 text-[10px] font-medium transition-colors border-r last:border-r-0 border-slate-200 ${
                    fontSize === size
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
                </button>
              ))}
            </div>
          </div>

          <Sep />

          {/* Zoom controls */}
          <div className="flex items-center gap-1.5">
            <ZoomIn size={12} className="text-slate-400 flex-shrink-0" />
            <div className="flex rounded-md border border-slate-200 overflow-hidden">
              {[
                { key: 'fit', label: 'Fit'  },
                { key: '75',  label: '75%'  },
                { key: '100', label: '100%' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setZoom(key)}
                  className={`px-2 py-0.5 text-[10px] font-medium transition-colors border-r last:border-r-0 border-slate-200 ${
                    zoom === key
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── A4 PREVIEW SCROLL AREA ──────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto overflow-x-auto p-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        {/* Zoom width wrapper — changing width triggers ResizeObserver in A4Container */}
        <div
          style={{
            width: ZOOM_WIDTHS[zoom],
            minWidth: zoom === '100' ? '794px' : undefined,
            margin: zoom === '75' ? '0 auto' : undefined,
            transition: 'width 0.2s ease',
          }}
        >
          <A4Container ref={printRef} contentScale={contentScale}>
            <Component />
          </A4Container>
        </div>
      </div>
    </div>
  );
});

export default ResumePreview;
