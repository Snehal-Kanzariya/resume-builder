import { Plus, Trash2, GripVertical, PlusCircle, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import SectionAIPanel from '../AI/SectionAIPanel';
import CondenseButton from '../AI/CondenseButton';
import { useDragReorder } from '../../hooks/useDragReorder';

function BulletList({ entry, id }) {
  const { addExperienceBullet, updateExperienceBullet, removeExperienceBullet, updateExperience } = useResume();

  return (
    <div className="mt-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Key Responsibilities / Achievements</label>
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
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => addExperienceBullet(id)}
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <PlusCircle size={15} />
          Add bullet point
        </button>
        <CondenseButton
          text={entry.bullets}
          sectionName="bullet points"
          onCondensed={bullets => updateExperience(id, 'bullets', bullets)}
        />
      </div>
    </div>
  );
}

function ExperienceCard({
  entry, index, total,
  dragging, dragOver, flash,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onMoveUp, onMoveDown,
}) {
  const { updateExperience, removeExperience } = useResume();
  const update = (field, value) => updateExperience(entry.id, field, value);

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={[
        'relative border border-slate-200 dark:border-slate-700 rounded-xl p-4',
        'bg-white dark:bg-slate-800 shadow-sm space-y-3 transition-all duration-200',
        dragging ? 'opacity-50 scale-[1.02] shadow-lg z-10' : '',
        flash    ? 'ring-2 ring-blue-300 dark:ring-blue-700 bg-blue-50 dark:bg-blue-950/50' : '',
      ].join(' ')}
    >
      {/* Blue drop-position indicator */}
      {dragOver && !dragging && (
        <div className="absolute -top-[3px] left-3 right-3 h-[2px] bg-blue-400 rounded-full z-20 pointer-events-none" />
      )}

      {/* Card header */}
      <div className="flex items-center gap-2">
        {/* Mobile up/down arrows (visible below md) */}
        <div className="flex md:hidden flex-col flex-shrink-0">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-0.5"
            title="Move up"
          >
            <ArrowUp size={13} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-0.5"
            title="Move down"
          >
            <ArrowDown size={13} />
          </button>
        </div>

        {/* Drag handle (visible md+) */}
        <div
          draggable
          onDragStart={onDragStart}
          className="hidden md:flex items-center cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 dark:hover:text-slate-400 transition-colors flex-shrink-0 select-none"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </div>

        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1 min-w-0 truncate">
          {entry.company || entry.position ? (
            <span>{entry.position || 'New Position'}{entry.company ? ` · ${entry.company}` : ''}</span>
          ) : (
            <span className="text-slate-400 font-normal">New Experience Entry</span>
          )}
        </h4>
        <button
          onClick={() => removeExperience(entry.id)}
          className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
          title="Remove entry"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Row 1: Company + Position */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Company</label>
          <input
            type="text"
            value={entry.company}
            onChange={e => update('company', e.target.value)}
            placeholder="TechCorp Inc."
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Job Title</label>
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
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Location</label>
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
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
          <input
            type="month"
            value={entry.startDate}
            onChange={e => update('startDate', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">End Date</label>
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
        <span className="text-sm text-slate-600 dark:text-slate-400">I currently work here</span>
      </label>

      {/* Bullets */}
      <BulletList entry={entry} id={entry.id} />
    </div>
  );
}

export default function ExperienceForm() {
  const { resumeData, addExperience, updateSection, reorderExperience } = useResume();
  const { experience } = resumeData;

  const {
    draggingIndex, overIndex, flashIndex,
    handleDragStart, handleDragOver, handleDrop, handleDragEnd,
  } = useDragReorder(reorderExperience);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Work Experience</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Add your work history starting with the most recent role.</p>

      <div className="space-y-4">
        {experience.length === 0 && (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-sm">No experience added yet.</p>
            <p className="text-xs mt-1">Click the button below to add your first role.</p>
          </div>
        )}
        {experience.map((entry, index) => (
          <ExperienceCard
            key={entry.id}
            entry={entry}
            index={index}
            total={experience.length}
            dragging={draggingIndex === index}
            dragOver={overIndex === index}
            flash={flashIndex === index}
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onMoveUp={() => reorderExperience(index, index - 1)}
            onMoveDown={() => reorderExperience(index, index + 1)}
          />
        ))}
      </div>

      <button
        onClick={addExperience}
        className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm rounded-lg transition-colors w-full justify-center border border-blue-200 dark:border-blue-800"
      >
        <Plus size={16} />
        Add Experience
      </button>

      {experience.length > 0 && (
        <SectionAIPanel
          sectionName="experience"
          sectionData={experience}
          onAccept={data => updateSection('experience', data)}
        />
      )}
    </div>
  );
}
