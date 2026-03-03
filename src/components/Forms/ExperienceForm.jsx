import { Plus, Trash2, GripVertical, PlusCircle, X } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

function BulletList({ entry, id }) {
  const { addExperienceBullet, updateExperienceBullet, removeExperienceBullet } = useResume();

  return (
    <div className="mt-3">
      <label className="block text-sm font-medium text-slate-700 mb-2">Key Responsibilities / Achievements</label>
      <div className="space-y-2">
        {entry.bullets.map((bullet, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="mt-2.5 text-slate-300">
              <GripVertical size={14} />
            </span>
            <input
              type="text"
              value={bullet}
              onChange={e => updateExperienceBullet(id, idx, e.target.value)}
              placeholder="e.g. Led redesign of core dashboard, reducing load time by 40%"
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              onClick={() => removeExperienceBullet(id, idx)}
              className="mt-2 text-slate-300 hover:text-red-400 transition-colors"
              title="Remove bullet"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => addExperienceBullet(id)}
        className="mt-2 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        <PlusCircle size={15} />
        Add bullet point
      </button>
    </div>
  );
}

function ExperienceCard({ entry }) {
  const { updateExperience, removeExperience } = useResume();
  const update = (field, value) => updateExperience(entry.id, field, value);

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
      {/* Card header */}
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-semibold text-slate-700">
          {entry.company || entry.position ? (
            <span>{entry.position || 'New Position'}{entry.company ? ` · ${entry.company}` : ''}</span>
          ) : (
            <span className="text-slate-400 font-normal">New Experience Entry</span>
          )}
        </h4>
        <button
          onClick={() => removeExperience(entry.id)}
          className="text-slate-300 hover:text-red-400 transition-colors"
          title="Remove entry"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Row 1: Company + Position */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Company</label>
          <input
            type="text"
            value={entry.company}
            onChange={e => update('company', e.target.value)}
            placeholder="TechCorp Inc."
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Job Title</label>
          <input
            type="text"
            value={entry.position}
            onChange={e => update('position', e.target.value)}
            placeholder="Senior Frontend Engineer"
            className="input-field"
          />
        </div>
      </div>

      {/* Row 2: Location */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
        <input
          type="text"
          value={entry.location}
          onChange={e => update('location', e.target.value)}
          placeholder="San Francisco, CA · Remote"
          className="input-field"
        />
      </div>

      {/* Row 3: Dates */}
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
            disabled={entry.current}
            onChange={e => update('endDate', e.target.value)}
            className="input-field disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
      </div>

      {/* Current checkbox */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={entry.current}
          onChange={e => {
            update('current', e.target.checked);
            if (e.target.checked) update('endDate', '');
          }}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-slate-600">I currently work here</span>
      </label>

      {/* Bullets */}
      <BulletList entry={entry} id={entry.id} />
    </div>
  );
}

export default function ExperienceForm() {
  const { resumeData, addExperience } = useResume();
  const { experience } = resumeData;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Work Experience</h2>
      <p className="text-sm text-slate-500 mb-6">Add your work history starting with the most recent role.</p>

      <div className="space-y-4">
        {experience.length === 0 && (
          <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-sm">No experience added yet.</p>
            <p className="text-xs mt-1">Click the button below to add your first role.</p>
          </div>
        )}
        {experience.map(entry => (
          <ExperienceCard key={entry.id} entry={entry} />
        ))}
      </div>

      <button
        onClick={addExperience}
        className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm rounded-lg transition-colors w-full justify-center border border-blue-200"
      >
        <Plus size={16} />
        Add Experience
      </button>
    </div>
  );
}
