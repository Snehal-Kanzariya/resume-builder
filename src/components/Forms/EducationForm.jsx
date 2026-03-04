import { Plus, Trash2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import SectionAIPanel from '../AI/SectionAIPanel';

function EducationCard({ entry }) {
  const { updateEducation, removeEducation } = useResume();
  const update = (field, value) => updateEducation(entry.id, field, value);

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-semibold text-slate-700">
          {entry.school || entry.degree ? (
            <span>{entry.degree || 'Degree'}{entry.school ? ` · ${entry.school}` : ''}</span>
          ) : (
            <span className="text-slate-400 font-normal">New Education Entry</span>
          )}
        </h4>
        <button
          onClick={() => removeEducation(entry.id)}
          className="text-slate-300 hover:text-red-400 transition-colors"
          title="Remove entry"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* School + Degree */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">School / University</label>
          <input
            type="text"
            value={entry.school}
            onChange={e => update('school', e.target.value)}
            placeholder="UC Berkeley"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Degree</label>
          <input
            type="text"
            value={entry.degree}
            onChange={e => update('degree', e.target.value)}
            placeholder="Bachelor of Science"
            className="input-field"
          />
        </div>
      </div>

      {/* Field + GPA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Field of Study</label>
          <input
            type="text"
            value={entry.field}
            onChange={e => update('field', e.target.value)}
            placeholder="Computer Science"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">GPA (optional)</label>
          <input
            type="text"
            value={entry.gpa}
            onChange={e => update('gpa', e.target.value)}
            placeholder="3.8 / 4.0"
            className="input-field"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
          <input
            type="month"
            value={entry.startDate}
            onChange={e => update('startDate', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
          <input
            type="month"
            value={entry.endDate}
            onChange={e => update('endDate', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Achievements */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Achievements / Honours (optional)</label>
        <textarea
          rows={2}
          value={entry.achievements}
          onChange={e => update('achievements', e.target.value)}
          placeholder="Dean's List 2022–2024. Capstone: real-time collaborative editor."
          className="input-field resize-none"
        />
      </div>
    </div>
  );
}

export default function EducationForm() {
  const { resumeData, addEducation, updateSection } = useResume();
  const { education } = resumeData;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Education</h2>
      <p className="text-sm text-slate-500 mb-6">Add your academic background, starting with the most recent.</p>

      <div className="space-y-4">
        {education.length === 0 && (
          <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-sm">No education added yet.</p>
            <p className="text-xs mt-1">Click the button below to add your first entry.</p>
          </div>
        )}
        {education.map(entry => (
          <EducationCard key={entry.id} entry={entry} />
        ))}
      </div>

      <button
        onClick={addEducation}
        className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm rounded-lg transition-colors w-full justify-center border border-blue-200"
      >
        <Plus size={16} />
        Add Education
      </button>

      {education.length > 0 && (
        <SectionAIPanel
          sectionName="education"
          sectionData={education}
          onAccept={data => updateSection('education', data)}
        />
      )}
    </div>
  );
}
