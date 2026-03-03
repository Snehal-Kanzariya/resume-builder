import { useState } from 'react';
import { PanelRight, PanelLeft, FileText } from 'lucide-react';

import Navbar from '../components/Layout/Navbar';
import Sidebar, { SECTIONS } from '../components/Layout/Sidebar';

import PersonalInfoForm    from '../components/Forms/PersonalInfoForm';
import ExperienceForm      from '../components/Forms/ExperienceForm';
import EducationForm       from '../components/Forms/EducationForm';
import SkillsForm          from '../components/Forms/SkillsForm';
import ProjectsForm        from '../components/Forms/ProjectsForm';
import CertificationsForm  from '../components/Forms/CertificationsForm';

const FORM_MAP = {
  personal:       <PersonalInfoForm />,
  experience:     <ExperienceForm />,
  education:      <EducationForm />,
  skills:         <SkillsForm />,
  projects:       <ProjectsForm />,
  certifications: <CertificationsForm />,
};

// ── Preview placeholder (replaced in Day 2) ─────────────────────────────────
function PreviewPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-100 text-slate-400 gap-3 p-6">
      <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center">
        <FileText size={28} className="text-slate-400" />
      </div>
      <p className="text-base font-semibold text-slate-500">Preview Coming Soon</p>
      <p className="text-xs text-center leading-relaxed max-w-[180px]">
        Live resume preview will appear here in Day 2 once templates are built.
      </p>
      {/* A4 ghost outline */}
      <div className="mt-4 border-2 border-dashed border-slate-300 rounded-lg"
           style={{ width: '148px', height: '209px' }}>
        <div className="w-full h-full flex flex-col gap-2 p-3">
          <div className="h-3 bg-slate-200 rounded w-3/4" />
          <div className="h-2 bg-slate-200 rounded w-1/2" />
          <div className="h-px bg-slate-300 my-1" />
          <div className="h-2 bg-slate-200 rounded w-full" />
          <div className="h-2 bg-slate-200 rounded w-5/6" />
          <div className="h-2 bg-slate-200 rounded w-4/6" />
          <div className="h-px bg-slate-300 my-1" />
          <div className="h-2 bg-slate-200 rounded w-full" />
          <div className="h-2 bg-slate-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

// ── Mobile section tab bar ───────────────────────────────────────────────────
function MobileTabBar({ activeSection, onSectionChange }) {
  return (
    <div className="md:hidden flex overflow-x-auto bg-white border-b border-slate-200 px-2 gap-1 flex-shrink-0 scrollbar-none">
      {SECTIONS.map(({ id, label, icon: Icon }) => {
        const active = activeSection === id;
        return (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 flex-shrink-0 text-[10px] font-medium border-b-2 transition-colors ${
              active
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={16} />
            <span className="whitespace-nowrap">{label.split(' ')[0]}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Builder page ─────────────────────────────────────────────────────────────
export default function Builder() {
  const [activeSection, setActiveSection] = useState('personal');
  const [mobileView, setMobileView]       = useState('form'); // 'form' | 'preview'

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Top navbar */}
      <Navbar />

      {/* Mobile section tab bar */}
      <MobileTabBar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* 3-column body */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Sidebar (desktop only) ────────────────────────────── */}
        <div className="hidden md:flex flex-col" style={{ width: '20%', minWidth: '180px', maxWidth: '240px' }}>
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </div>

        {/* ── CENTER: Active form ──────────────────────────────────────── */}
        <main
          className={`flex-1 overflow-y-auto p-5 md:p-7 ${
            mobileView === 'preview' ? 'hidden md:block' : 'block'
          }`}
          style={{ maxWidth: '100%' }}
        >
          {/* Section nav breadcrumb (desktop) */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 mb-5">
            <span>Builder</span>
            <span>›</span>
            <span className="text-slate-600 font-medium">
              {SECTIONS.find(s => s.id === activeSection)?.label}
            </span>
          </div>

          {/* Active form */}
          <div className="max-w-2xl mx-auto">
            {FORM_MAP[activeSection]}
          </div>

          {/* Prev / Next navigation */}
          <div className="max-w-2xl mx-auto mt-8 flex justify-between">
            {(() => {
              const idx = SECTIONS.findIndex(s => s.id === activeSection);
              const prev = SECTIONS[idx - 1];
              const next = SECTIONS[idx + 1];
              return (
                <>
                  {prev ? (
                    <button
                      onClick={() => setActiveSection(prev.id)}
                      className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <PanelLeft size={15} />
                      {prev.label}
                    </button>
                  ) : <span />}

                  {next && (
                    <button
                      onClick={() => setActiveSection(next.id)}
                      className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {next.label}
                      <PanelRight size={15} />
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </main>

        {/* ── RIGHT: Preview panel (desktop always visible, mobile toggle) ── */}
        <div
          className={`md:flex flex-col border-l border-slate-200 overflow-hidden ${
            mobileView === 'preview' ? 'flex flex-1' : 'hidden'
          }`}
          style={{ width: '35%', minWidth: '280px' }}
        >
          <PreviewPlaceholder />
        </div>
      </div>

      {/* ── Mobile: floating toggle button ──────────────────────────────── */}
      <div className="md:hidden fixed bottom-5 right-5 z-30">
        <button
          onClick={() => setMobileView(v => v === 'form' ? 'preview' : 'form')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-lg transition-colors"
        >
          {mobileView === 'form' ? (
            <><FileText size={16} /> Preview</>
          ) : (
            <><PanelLeft size={16} /> Edit Form</>
          )}
        </button>
      </div>
    </div>
  );
}
