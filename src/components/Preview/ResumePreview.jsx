import { useRef } from 'react';
import { Palette, LayoutTemplate } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import A4Container from './A4Container';

import ModernTemplate       from '../Templates/ModernTemplate';
import ClassicTemplate      from '../Templates/ClassicTemplate';
import MinimalTemplate      from '../Templates/MinimalTemplate';
import CreativeTemplate     from '../Templates/CreativeTemplate';
import ProfessionalTemplate from '../Templates/ProfessionalTemplate';

const TEMPLATES = [
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

export default function ResumePreview() {
  const printRef = useRef(null);
  const { resumeData, updateSettings } = useResume();
  const { selectedTemplate, accentColor } = resumeData.settings;

  const active = TEMPLATES.find(t => t.id === selectedTemplate) ?? TEMPLATES[0];
  const { Component } = active;

  return (
    <div className="flex flex-col h-full bg-slate-100">

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-3 py-2 bg-white border-b border-slate-200 flex-shrink-0 flex-wrap">

        {/* Template selector */}
        <div className="flex items-center gap-1.5">
          <LayoutTemplate size={13} className="text-slate-400" />
          <select
            value={selectedTemplate}
            onChange={e => updateSettings('selectedTemplate', e.target.value)}
            className="text-xs font-medium text-slate-700 bg-transparent border-none outline-none cursor-pointer"
          >
            {TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="w-px h-4 bg-slate-200" />

        {/* Color picker */}
        <div className="flex items-center gap-1.5">
          <Palette size={13} className="text-slate-400" />
          <div className="flex gap-1">
            {ACCENT_PRESETS.map(color => (
              <button
                key={color}
                onClick={() => updateSettings('accentColor', color)}
                title={color}
                style={{ backgroundColor: color }}
                className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${
                  accentColor === color ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : ''
                }`}
              />
            ))}
            {/* Custom color */}
            <label className="relative w-4 h-4 rounded-full overflow-hidden cursor-pointer border border-slate-300" title="Custom color">
              <input
                type="color"
                value={accentColor}
                onChange={e => updateSettings('accentColor', e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <span
                style={{ background: `conic-gradient(red,yellow,lime,cyan,blue,magenta,red)` }}
                className="absolute inset-0"
              />
            </label>
          </div>
        </div>
      </div>

      {/* ── A4 preview ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4">
        <A4Container ref={printRef}>
          <Component />
        </A4Container>
      </div>
    </div>
  );
}

// Export the ref getter for pdf/print use
export { ResumePreview };
