import { useState, useEffect, useRef, useCallback } from 'react';
import { PanelRight, PanelLeft, FileText, Columns2 } from 'lucide-react';
import ResumePreview from '../components/Preview/ResumePreview';
import { useToast } from '../context/ToastContext';

import Navbar from '../components/Layout/Navbar';
import Sidebar, { SECTIONS } from '../components/Layout/Sidebar';

import PersonalInfoForm    from '../components/Forms/PersonalInfoForm';
import ExperienceForm      from '../components/Forms/ExperienceForm';
import EducationForm       from '../components/Forms/EducationForm';
import SkillsForm          from '../components/Forms/SkillsForm';
import ProjectsForm        from '../components/Forms/ProjectsForm';
import CertificationsForm  from '../components/Forms/CertificationsForm';
import AISuggestions       from '../components/AI/AISuggestions';

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
    <div className="md:hidden flex overflow-x-auto bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-2 gap-1 flex-shrink-0 scrollbar-none transition-colors">
      {SECTIONS.map(({ id, label, icon: Icon }) => {
        const active = activeSection === id;
        return (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 flex-shrink-0 text-[10px] font-medium border-b-2 transition-colors ${
              active
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
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

// ── Drag handle between form and preview ─────────────────────────────────────
function DragHandle({ onMouseDown, isDragging }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`hidden md:flex flex-col items-center justify-center w-2 flex-shrink-0 cursor-col-resize group select-none transition-colors ${
        isDragging
          ? 'bg-blue-500'
          : 'bg-slate-200 dark:bg-slate-700 hover:bg-blue-400 dark:hover:bg-blue-500'
      }`}
      title="Drag to resize"
    >
      <div className={`w-0.5 h-8 rounded-full transition-colors ${
        isDragging
          ? 'bg-white'
          : 'bg-slate-400 dark:bg-slate-500 group-hover:bg-white'
      }`} />
    </div>
  );
}

// ── Builder page ─────────────────────────────────────────────────────────────
export default function Builder() {
  const [activeSection, setActiveSection] = useState('personal');
  const [mobileView, setMobileView]       = useState('form');
  const [splitView, setSplitView]         = useState(false);
  const [splitPos, setSplitPos]           = useState(45); // left side % of total width (max 50)
  const isDragging   = useRef(false);
  const containerRef = useRef(null);
  const previewRef   = useRef(null);
  const toast = useToast();

  // Keyboard shortcuts: Ctrl+P → print, Ctrl+S → save toast
  useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        document.querySelector('[data-print-btn]')?.click();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        toast('Auto-saved to browser storage.', 'success', 2000);
      }
    }
    function handleQuota() {
      toast('Browser storage full — resume may not be saved. Try clearing old data.', 'warning', 6000);
    }
    window.addEventListener('keydown', handleKey);
    window.addEventListener('storage-quota-exceeded', handleQuota);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('storage-quota-exceeded', handleQuota);
    };
  }, [toast]);

  // Drag-to-resize logic
  const startDrag = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;

    function onMove(e) {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct  = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPos(Math.min(50, Math.max(22, pct)));
    }

    function onUp() {
      isDragging.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <MobileTabBar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div ref={containerRef} className="flex flex-1 overflow-hidden">

        {/* LEFT: Sidebar */}
        <div
          className="hidden md:flex flex-col flex-shrink-0"
          style={{ width: '20%', minWidth: '180px', maxWidth: '240px' }}
        >
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </div>

        {/* CENTER: Active form */}
        <main
          className={`overflow-y-auto p-5 md:p-7 bg-slate-50 dark:bg-slate-950 transition-colors flex-shrink-0 ${
            mobileView === 'preview' ? 'hidden md:block' : 'block'
          } ${splitView ? '' : 'flex-1'}`}
          style={splitView ? {
            // left side total is splitPos%, sidebar takes ~200px, form gets the rest
            width: `calc(${splitPos}% - 200px)`,
            minWidth: '260px',
          } : {}}
        >
          {/* Breadcrumb + Split View toggle */}
          <div className="hidden md:flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <span>Builder</span>
              <span>›</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {SECTIONS.find(s => s.id === activeSection)?.label}
              </span>
            </div>

            <button
              onClick={() => setSplitView(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                splitView
                  ? 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
              title="Toggle split preview (quick view)"
            >
              <Columns2 size={13} />
              {splitView ? 'Exit Split' : 'Split View'}
            </button>
          </div>

          <div className="max-w-2xl mx-auto">
            {FORM_MAP[activeSection]}
            <AISuggestions section={activeSection} />
          </div>

          <div className="max-w-2xl mx-auto mt-8 flex justify-between">
            {(() => {
              const idx  = SECTIONS.findIndex(s => s.id === activeSection);
              const prev = SECTIONS[idx - 1];
              const next = SECTIONS[idx + 1];
              return (
                <>
                  {prev ? (
                    <button
                      onClick={() => setActiveSection(prev.id)}
                      className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
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

        {/* DRAG HANDLE — only in split view */}
        {splitView && (
          <DragHandle
            onMouseDown={startDrag}
            isDragging={isDragging.current}
          />
        )}

        {/* RIGHT: Preview panel */}
        <div
          ref={previewRef}
          className={`md:flex flex-col border-l border-slate-200 dark:border-slate-700 ${
            mobileView === 'preview' ? 'flex flex-1' : 'hidden'
          } ${splitView ? '' : ''}`}
          style={splitView ? {
            flex: 1,
            minWidth: '320px',
            height: 'calc(100vh - 56px)',
            overflowY: 'auto',
          } : {
            width: '35%',
            minWidth: '280px',
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            height: 'calc(100vh - 56px)',
            overflowY: 'auto',
          }}
        >
          <ResumePreview />
        </div>
      </div>

      {/* Mobile: floating toggle */}
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
