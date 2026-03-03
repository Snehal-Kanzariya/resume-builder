import { useState } from 'react';
import { PanelRight, PanelLeft, FileText } from 'lucide-react'; // FileText used in mobile toggle
import ResumePreview from '../components/Preview/ResumePreview';

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

        {/* ── RIGHT: Preview panel — sticky by flex layout (only center scrolls) ── */}
        <div
          className={`md:flex flex-col border-l border-slate-200 ${
            mobileView === 'preview' ? 'flex flex-1' : 'hidden'
          }`}
          style={{
            width: '35%',
            minWidth: '280px',
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            height: 'calc(100vh - 56px)',   /* viewport minus navbar */
            overflowY: 'auto',
          }}
        >
          <ResumePreview />
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
