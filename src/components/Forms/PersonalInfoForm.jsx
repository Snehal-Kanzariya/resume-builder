import { useResume } from '../../context/ResumeContext';
import SectionAIPanel from '../AI/SectionAIPanel';

const fields = [
  { key: 'fullName',   label: 'Full Name',           placeholder: 'Alex Johnson',              type: 'text' },
  { key: 'jobTitle',   label: 'Job Title',            placeholder: 'Senior Frontend Engineer',  type: 'text' },
  { key: 'email',      label: 'Email',                placeholder: 'alex@email.com',            type: 'email' },
  { key: 'phone',      label: 'Phone',                placeholder: '+1 (555) 234-5678',         type: 'tel' },
  { key: 'location',   label: 'Location',             placeholder: 'San Francisco, CA',         type: 'text' },
  { key: 'linkedin',   label: 'LinkedIn URL',         placeholder: 'linkedin.com/in/username',  type: 'text' },
  { key: 'portfolio',  label: 'Portfolio / Website',  placeholder: 'yoursite.dev',              type: 'text' },
];

export default function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo, updateSection } = useResume();
  const info = resumeData?.personalInfo ?? {};

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Personal Information</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Your basic contact details shown at the top of the resume.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} className={key === 'portfolio' ? 'sm:col-span-2' : ''}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
            <input
              type={type}
              value={info[key]}
              onChange={e => updatePersonalInfo(key, e.target.value)}
              placeholder={placeholder}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Professional Summary</label>
        <textarea
          rows={4}
          value={info.summary}
          onChange={e => updatePersonalInfo('summary', e.target.value)}
          placeholder="A brief 2–3 sentence overview of your experience and key strengths..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">{info.summary.length} / 500</p>
      </div>

      <SectionAIPanel
        sectionName="personalInfo"
        sectionData={resumeData.personalInfo}
        onAccept={data => updateSection('personalInfo', data)}
      />
    </div>
  );
}
