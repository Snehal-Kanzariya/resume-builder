import { User, Briefcase, GraduationCap, Code2, FolderOpen, Award, ChevronRight } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const SECTIONS = [
  {
    id: 'personal',
    label: 'Personal Info',
    icon: User,
    dataKey: null, // always has data (flat object)
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: Briefcase,
    dataKey: 'experience',
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    dataKey: 'education',
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Code2,
    dataKey: 'skills',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderOpen,
    dataKey: 'projects',
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: Award,
    dataKey: 'certifications',
  },
];

function completionDot(resumeData, section) {
  if (section.dataKey === null) {
    // personal: check if at least fullName + email filled
    const { fullName, email } = resumeData.personalInfo;
    return fullName.trim() && email.trim();
  }
  return resumeData[section.dataKey]?.length > 0;
}

export default function Sidebar({ activeSection, onSectionChange }) {
  const { resumeData } = useResume();

  return (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200 py-4 px-3 gap-1 overflow-y-auto">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-2 mb-2">
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
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {/* Icon */}
            <span
              className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
              }`}
            >
              <Icon size={15} />
            </span>

            {/* Label */}
            <span className="flex-1 text-sm font-medium leading-none">{section.label}</span>

            {/* Completion dot */}
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                done ? 'bg-emerald-400' : 'bg-slate-200'
              }`}
            />

            {/* Active chevron */}
            {active && <ChevronRight size={14} className="flex-shrink-0 text-blue-400" />}
          </button>
        );
      })}

      {/* Footer hint */}
      <div className="mt-auto pt-4 px-2">
        <div className="text-[11px] text-slate-400 leading-relaxed">
          <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 align-middle" />
          Green dot = section has data
        </div>
      </div>
    </aside>
  );
}
