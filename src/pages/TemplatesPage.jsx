import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, LayoutTemplate } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import Navbar from '../components/Layout/Navbar';

// ── Template metadata ─────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    tagline: 'Stand out with a bold sidebar',
    description: 'Two-column layout with a vibrant accent-colored sidebar for name, contact, and skills. The right column keeps experience and education clean.',
    traits: ['2-Column Layout', 'Colored Sidebar', 'Tech & Creative'],
    accent: '#2563eb', bg: '#eff6ff',
  },
  {
    id: 'classic',
    name: 'Classic',
    tagline: 'Timeless and universally respected',
    description: 'Traditional single-column with Merriweather serif headings, centered name, and double-rule section dividers. Safe for any industry.',
    traits: ['Single Column', 'Serif Typography', 'Any Industry'],
    accent: '#1e293b', bg: '#f8fafc',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Let your content do the talking',
    description: 'Ultra-clean layout with maximum whitespace and thin typography. Name top-left, contact top-right. Subtle dash bullets.',
    traits: ['Max Whitespace', 'Thin Typography', 'Design & UX'],
    accent: '#64748b', bg: '#f1f5f9',
  },
  {
    id: 'creative',
    name: 'Creative',
    tagline: 'Make a memorable first impression',
    description: 'Gradient header banner, dark sidebar with visual skill bars, and icon-marked section headers. High visual impact.',
    traits: ['Gradient Header', 'Skill Bars', 'Creative Roles'],
    accent: '#7c3aed', bg: '#f5f3ff',
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Optimized to pass ATS screening',
    description: 'Pure text, no graphics, no color blocks. Maximum machine readability for corporate, finance, and legal roles.',
    traits: ['ATS-Friendly', 'No Graphics', 'Corporate & Finance'],
    accent: '#059669', bg: '#ecfdf5',
  },
  {
    id: 'executive',
    name: 'Executive',
    tagline: 'Premium look for senior professionals',
    description: 'Dark charcoal header with gold-accent dividers, elegant typography, and chevron bullets. Authoritative and refined.',
    traits: ['Dark Header', 'Gold Accents', 'Senior / C-Suite'],
    accent: '#b45309', bg: '#fffbeb',
  },
  {
    id: 'tech',
    name: 'Tech',
    tagline: 'Built for developers and engineers',
    description: 'Terminal-style dark header, monospace section labels, code-badge skill tags. A resume that speaks developer.',
    traits: ['Terminal Header', 'Code Badges', 'Engineering & Dev'],
    accent: '#0ea5e9', bg: '#f0f9ff',
  },
  {
    id: 'compact',
    name: 'Compact',
    tagline: 'Pack everything onto one page',
    description: 'Two-column layout with skills and education on the left sidebar. Tight spacing, smaller fonts — maximum content density.',
    traits: ['2-Column Sidebar', 'Dense Layout', 'Experienced Pros'],
    accent: '#8b5cf6', bg: '#faf5ff',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    tagline: 'Refined typography and soft beauty',
    description: 'Ultra-thin large name, ornamental dividers, italic quotes, and a subtle initials watermark. Sophisticated and artistic.',
    traits: ['Thin Typography', 'Watermark', 'Creative & Academia'],
    accent: '#be123c', bg: '#fff1f2',
  },
  {
    id: 'bold',
    name: 'Bold',
    tagline: 'High contrast and eye-catching',
    description: 'Massive 900-weight name, filled accent-color section headers with white text, two-column body. Impossible to ignore.',
    traits: ['Giant Name', 'Filled Headers', 'Marketing & Sales'],
    accent: '#dc2626', bg: '#fef2f2',
  },
];

// ── Template card ─────────────────────────────────────────────────────────────

function TemplateCard({ template, onSelect, isActive }) {
  const { name, tagline, description, traits, accent, bg } = template;

  return (
    <div
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
      style={isActive ? { borderColor: accent, boxShadow: `0 0 0 2px ${accent}30` } : {}}
    >
      {/* Top accent strip */}
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6">
        {/* Icon + name */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: bg }}
          >
            <LayoutTemplate size={18} style={{ color: accent }} />
          </div>
          {isActive && (
            <span
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: bg, color: accent }}
            >
              <Check size={11} /> Active
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-0.5">{name}</h3>
        <p className="text-xs font-medium mb-3" style={{ color: accent }}>{tagline}</p>
        <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-4">{description}</p>

        {/* Trait tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {traits.map(t => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: bg, color: accent }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={() => onSelect(template.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group-hover:gap-3"
          style={{
            backgroundColor: accent,
            color: '#fff',
          }}
        >
          Use This Template
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { updateSettings, resumeData } = useResume();
  const activeTemplate = resumeData.settings.selectedTemplate;

  function handleSelect(templateId) {
    updateSettings('selectedTemplate', templateId);
    navigate('/builder');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div
        className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
      >
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
          <LayoutTemplate size={13} className="text-blue-300" />
          <span className="text-white/70 text-xs font-medium">5 Professional Designs</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Choose Your Template
        </h1>
        <p className="text-white/50 text-base max-w-md mx-auto">
          Click any template to open it in the builder. Switch anytime — your data is always preserved.
        </p>
      </div>

      {/* ── GRID ──────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map(t => (
            <TemplateCard
              key={t.id}
              template={t}
              onSelect={handleSelect}
              isActive={activeTemplate === t.id}
            />
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-slate-400 text-sm mt-10">
          All templates render every section of your resume and support custom accent colors.
        </p>
      </div>
    </div>
  );
}
