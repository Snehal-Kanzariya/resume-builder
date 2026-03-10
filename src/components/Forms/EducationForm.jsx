import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import SectionAIPanel from '../AI/SectionAIPanel';
import { useDragReorder } from '../../hooks/useDragReorder';

function EducationCard({
  entry, index, total,
  dragging, dragOver, flash,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onMoveUp, onMoveDown,
}) {
  const { updateEducation, removeEducation } = useResume();
  const update = (field, value) => updateEducation(entry.id, field, value);

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
        {/* Mobile up/down arrows */}
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

        {/* Drag handle (md+) */}
        <div
          draggable
          onDragStart={onDragStart}
          className="hidden md:flex items-center cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 dark:hover:text-slate-400 transition-colors flex-shrink-0 select-none"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </div>

        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1 min-w-0 truncate">
          {entry.school || entry.degree ? (
            <span>{entry.degree || 'Degree'}{entry.school ? ` · ${entry.school}` : ''}</span>
          ) : (
            <span className="text-slate-400 font-normal">New Education Entry</span>
          )}
        </h4>
        <button
          onClick={() => removeEducation(entry.id)}
          className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
          title="Remove entry"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* School + Degree */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">School / University</label>
          <input
            type="text"
            value={entry.school}
            onChange={e => update('school', e.target.value)}
            placeholder="UC Berkeley"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Degree</label>
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
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Field of Study</label>
          <input
            type="text"
            value={entry.field}
            onChange={e => update('field', e.target.value)}
            placeholder="Computer Science"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">GPA (optional)</label>
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
            onChange={e => update('endDate', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Achievements */}
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Achievements / Honours (optional)</label>
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
  const { resumeData, addEducation, updateSection, reorderEducation } = useResume();
  const { education } = resumeData;

  const {
    draggingIndex, overIndex, flashIndex,
    handleDragStart, handleDragOver, handleDrop, handleDragEnd,
  } = useDragReorder(reorderEducation);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Education</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Add your academic background, starting with the most recent.</p>

      <div className="space-y-4">
        {education.length === 0 && (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-sm">No education added yet.</p>
            <p className="text-xs mt-1">Click the button below to add your first entry.</p>
          </div>
        )}
        {education.map((entry, index) => (
          <EducationCard
            key={entry.id}
            entry={entry}
            index={index}
            total={education.length}
            dragging={draggingIndex === index}
            dragOver={overIndex === index}
            flash={flashIndex === index}
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onMoveUp={() => reorderEducation(index, index - 1)}
            onMoveDown={() => reorderEducation(index, index + 1)}
          />
        ))}
      </div>

      <button
        onClick={addEducation}
        className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm rounded-lg transition-colors w-full justify-center border border-blue-200 dark:border-blue-800"
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
