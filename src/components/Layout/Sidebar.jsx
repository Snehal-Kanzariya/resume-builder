import { useState, useRef } from 'react';
import { User, Briefcase, GraduationCap, Code2, FolderOpen, Award, Users, ChevronRight, RotateCcw, FlaskConical, Upload, Plus, LayoutTemplate } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { sampleData } from '../../data/sampleData';

export const SECTIONS = [
  { id: 'personal',       label: 'Personal Info',   icon: User,          dataKey: null },
  { id: 'experience',     label: 'Experience',       icon: Briefcase,     dataKey: 'experience' },
  { id: 'education',      label: 'Education',        icon: GraduationCap, dataKey: 'education' },
  { id: 'skills',         label: 'Skills',           icon: Code2,         dataKey: 'skills' },
  { id: 'projects',       label: 'Projects',         icon: FolderOpen,    dataKey: 'projects' },
  { id: 'certifications', label: 'Certifications',   icon: Award,         dataKey: 'certifications' },
  { id: 'references',     label: 'References',       icon: Users,         dataKey: 'references' },
];

function completionDot(resumeData, section) {
  if (section.dataKey === null) {
    const fullName = resumeData?.personalInfo?.fullName ?? '';
    const email = resumeData?.personalInfo?.email ?? '';
    return fullName.trim() && email.trim();
  }
  return (resumeData?.[section.dataKey]?.length ?? 0) > 0;
}

export default function Sidebar({ activeSection, onSectionChange, onImportResume, onAddCustomSection }) {
  const { resumeData, resetResume, loadSampleData, reorderCustomSections } = useResume();
  const customSections = resumeData?.customSections || [];
  const toast = useToast();
  const [confirmReset, setConfirmReset] = useState(false);
  const dragIndex = useRef(null);
  const dragOverIndex = useRef(null);

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 py-4 px-3 gap-1 overflow-y-auto transition-colors">

      {/* Import Resume button */}
      {onImportResume && (
        <button
          onClick={onImportResume}
          className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors w-full"
        >
          <Upload size={13} /> Import Resume (PDF/DOCX)
        </button>
      )}

      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 mb-2">
        Resume Sections
      </p>

      {SECTIONS.map((section) => {
        const Icon = section.icon;
        const active = activeSection === section.id;
        const done = completionDot(resumeData, section);

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
              active
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span
              className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
              }`}
            >
              <Icon size={15} />
            </span>

            <span className="flex-1 text-sm font-medium leading-none">{section.label}</span>

            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                done ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />

            {active && <ChevronRight size={14} className="flex-shrink-0 text-blue-400 dark:text-blue-500" />}
          </button>
        );
      })}

      {/* ── Custom sections ────────────────────────────────────────────── */}
      {customSections.length > 0 && (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 mt-3 mb-1">
            Custom Sections
          </p>
          {customSections.map((cs, idx) => {
            const sectionKey = `custom-${cs.id}`;
            const active = activeSection === sectionKey;
            const hasContent = cs.type === 'bullets'
              ? cs.items?.some(i => i?.trim())
              : cs.content?.trim();
            return (
              <div
                key={cs.id}
                draggable
                onDragStart={() => { dragIndex.current = idx; }}
                onDragOver={e => { e.preventDefault(); dragOverIndex.current = idx; }}
                onDrop={() => {
                  const from = dragIndex.current;
                  const to   = dragOverIndex.current;
                  if (from !== null && to !== null && from !== to) {
                    reorderCustomSections(from, to);
                  }
                  dragIndex.current = null;
                  dragOverIndex.current = null;
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                <button
                  onClick={() => onSectionChange(sectionKey)}
                  className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}>
                    <LayoutTemplate size={13} />
                  </span>
                  <span className="flex-1 text-sm font-medium leading-none truncate">
                    {cs.title || 'Custom Section'}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    hasContent ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                  {active && <ChevronRight size={14} className="flex-shrink-0 text-blue-400 dark:text-blue-500" />}
                </button>
              </div>
            );
          })}
        </>
      )}

      {/* Add custom section */}
      {onAddCustomSection && (
        <button
          onClick={onAddCustomSection}
          className="flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors w-full border border-dashed border-blue-200 dark:border-blue-800"
        >
          <Plus size={13} /> Add Custom Section
        </button>
      )}

      <div className="mt-auto pt-4 px-2 flex flex-col gap-2">
        <div className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed mb-1">
          <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 align-middle" />
          Green dot = section has data
        </div>

        {/* Load Sample Data */}
        <button
          onClick={() => { loadSampleData(sampleData); toast('Sample data loaded!', 'success'); }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors w-full"
        >
          <FlaskConical size={13} /> Load Sample Data
        </button>

        {/* Reset Resume */}
        {confirmReset ? (
          <div className="flex flex-col gap-1.5 p-2 bg-red-50 dark:bg-red-950/40 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">Clear all data?</p>
            <div className="flex gap-1.5">
              <button
                onClick={() => { resetResume(); setConfirmReset(false); toast('Resume cleared.', 'info'); }}
                className="flex-1 py-1 text-[11px] font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-1 text-[11px] font-medium border border-slate-300 dark:border-slate-600 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors w-full"
          >
            <RotateCcw size={13} /> Reset Resume
          </button>
        )}
      </div>
    </aside>
  );
}
