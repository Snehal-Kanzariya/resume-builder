import { Link } from 'react-router-dom';
import {
  Eye, Sparkles, LayoutTemplate, Download,
  ArrowRight, CheckCircle, Zap, FileText, Star,
} from 'lucide-react';
import Navbar from '../components/Layout/Navbar';

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Eye,
    title: 'Live Preview',
    desc: 'See every change reflected instantly. No guessing — what you see is exactly what gets exported.',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: Sparkles,
    title: 'AI Enhancement',
    desc: 'AI rewrites your resume with stronger action verbs, metrics, and ATS-friendly language — powered by Groq.',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    icon: LayoutTemplate,
    title: '5 Templates',
    desc: 'Switch between Modern, Classic, Minimal, Creative, and Professional designs in real time.',
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    icon: Download,
    title: 'PDF Export',
    desc: 'Download print-ready, text-selectable PDFs in one click. Your resume, your format.',
    color: '#d97706',
    bg: '#fffbeb',
  },
];

const TEMPLATES = [
  { id: 'modern',       name: 'Modern',       desc: '2-column with colored sidebar',        color: '#2563eb' },
  { id: 'classic',      name: 'Classic',      desc: 'Serif headings, single column',        color: '#1e293b' },
  { id: 'minimal',      name: 'Minimal',      desc: 'Ultra-clean, maximum whitespace',      color: '#64748b' },
  { id: 'creative',     name: 'Creative',     desc: 'Bold colors, skill bars, gradient',    color: '#7c3aed' },
  { id: 'professional', name: 'Professional', desc: 'ATS-optimized, machine-readable',      color: '#059669' },
];

const STATS = [
  { value: '5',     label: 'Templates'    },
  { value: 'AI',    label: 'Powered'      },
  { value: 'PDF',   label: 'Export'       },
  { value: '100%',  label: 'Free'         },
];

const CHECKLIST = [
  'Live preview updates on every keystroke',
  'AI rewrites your resume content',
  'ATS-friendly templates included',
  'Download as PDF in one click',
  'Auto-saves to browser storage',
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FeatureCard({ icon: Icon, title, desc, color, bg }) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: bg }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <h3 className="font-semibold text-slate-800 text-base mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TemplateCard({ id, name, desc, color }) {
  return (
    <Link
      to={`/builder`}
      state={{ template: id }}
      className="group flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200"
    >
      {/* Color dot */}
      <div
        className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
        style={{ backgroundColor: `${color}18` }}
      >
        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm">{name}</p>
        <p className="text-slate-400 text-xs truncate">{desc}</p>
      </div>
      <ArrowRight
        size={16}
        className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all flex-shrink-0"
      />
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#2563eb' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#7c3aed' }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles size={13} className="text-purple-300" />
            <span className="text-white/80 text-xs font-medium">Now with AI Enhancement</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Build Your Professional
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #a78bfa)' }}
            >
              Resume in Minutes
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Fill a form, watch the live preview update instantly, let AI rewrite your content
            to be more impactful, then export a print-ready PDF.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/builder"
              className="flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/40 transition-all duration-200 hover:scale-105 text-sm"
            >
              <FileText size={16} />
              Start Building — It&apos;s Free
            </Link>
            <Link
              to="/templates"
              className="flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200 text-sm"
            >
              View Templates
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Social proof checklist */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-12">
            {CHECKLIST.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5 text-white/50 text-xs">
                <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ──────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-white mb-1">{value}</p>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
              <Zap size={13} className="text-blue-500" />
              <span className="text-blue-600 text-xs font-semibold">Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to land your next job
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Built for job seekers who want a polished resume without spending hours on formatting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── TEMPLATE SHOWCASE ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 mb-4">
                <LayoutTemplate size={13} className="text-purple-500" />
                <span className="text-purple-600 text-xs font-semibold">5 Designs</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Pick a style,<br />make it yours
              </h2>
              <p className="text-slate-500 text-base mb-8 leading-relaxed">
                Switch between templates in real time — no re-entering data. Customize accent color, font size, and section order. Preview exactly how it&apos;ll look printed.
              </p>
              <Link
                to="/templates"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Browse all templates <ArrowRight size={15} />
              </Link>
            </div>

            {/* Right: template list */}
            <div className="flex flex-col gap-3">
              {TEMPLATES.map(t => <TemplateCard key={t.id} {...t} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── AI SECTION ──────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-4 py-1.5 mb-4">
            <Sparkles size={13} className="text-purple-600" />
            <span className="text-purple-700 text-xs font-semibold">AI Powered</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Let AI write a better version
          </h2>
          <p className="text-slate-500 text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Click &ldquo;Enhance with AI&rdquo; and AI rewrites your resume section by section —
            stronger verbs, quantified results, ATS keywords. Compare side-by-side and choose
            the best version, or merge section by section.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className="flex items-center gap-2 bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 shadow-sm">
              <Star size={14} className="text-amber-400" />
              Powered by Groq — free tier
            </div>
            <div className="flex items-center gap-2 bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 shadow-sm">
              <CheckCircle size={14} className="text-emerald-500" />
              Works without API key (tips still show)
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to build your perfect resume?
        </h2>
        <p className="text-white/50 text-base mb-8 max-w-md mx-auto">
          No account needed. Start now and download your PDF in minutes.
        </p>
        <Link
          to="/builder"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all duration-200 hover:scale-105 text-base"
        >
          <FileText size={18} />
          Build My Resume Now
        </Link>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <FileText size={20} className="text-blue-400" />
            ResumeBuilder
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/builder"   className="hover:text-white transition-colors">Builder</Link>
            <Link to="/templates" className="hover:text-white transition-colors">Templates</Link>
            <Link to="/preview"   className="hover:text-white transition-colors">Preview</Link>
          </div>
          <p className="text-slate-600 text-xs">Built with React + Vite + Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
