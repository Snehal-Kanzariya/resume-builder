import { Users, Plus, Trash2, GripVertical, ArrowUp, ArrowDown, ToggleLeft, ToggleRight } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useDragReorder } from '../../hooks/useDragReorder';

const RELATIONSHIP_OPTIONS = ['Direct Manager', 'Colleague', 'Senior Leader', 'Client', 'Professor', 'Other'];

function ReferenceCard({
  entry, index, total,
  dragging, dragOver, flash,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onMoveUp, onMoveDown,
}) {
  const { updateReference, removeReference } = useResume();
  const update = (field, value) => updateReference(entry.id, field, value);

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
      {dragOver && !dragging && (
        <div className="absolute -top-[3px] left-3 right-3 h-[2px] bg-blue-400 rounded-full z-20 pointer-events-none" />
      )}

      {/* Header */}
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

        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 flex-1 min-w-0">
          <Users size={14} className="text-blue-500 flex-shrink-0" />
          <span className="truncate">
            {entry.name ? entry.name : <span className="text-slate-400 font-normal">New Reference</span>}
          </span>
        </h4>
        <button
          onClick={() => removeReference(entry.id)}
          className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
          title="Remove reference"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Name + Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
          <input
            type="text"
            value={entry.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Jane Smith"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Job Title</label>
          <input
            type="text"
            value={entry.title}
            onChange={e => update('title', e.target.value)}
            placeholder="Senior Engineering Manager"
            className="input-field"
          />
        </div>
      </div>

      {/* Company + Relationship */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Company</label>
          <input
            type="text"
            value={entry.company}
            onChange={e => update('company', e.target.value)}
            placeholder="Acme Corp"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Relationship</label>
          <select
            value={entry.relationship}
            onChange={e => update('relationship', e.target.value)}
            className="input-field"
          >
            <option value="">Select relationship…</option>
            {RELATIONSHIP_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Phone</label>
          <input
            type="text"
            value={entry.phone}
            onChange={e => update('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
          <input
            type="email"
            value={entry.email}
            onChange={e => update('email', e.target.value)}
            placeholder="jane.smith@company.com"
            className="input-field"
          />
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          Note <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={entry.note}
          onChange={e => update('note', e.target.value)}
          placeholder="What can this person speak to about your work?"
          rows={2}
          className="input-field resize-none"
        />
      </div>
    </div>
  );
}

export default function ReferencesForm() {
  const { resumeData, addReference, reorderReferences, updateSettings } = useResume();
  const references   = resumeData?.references ?? [];
  const showReferences = resumeData?.settings?.showReferences ?? false;

  const {
    draggingIndex, overIndex, flashIndex,
    handleDragStart, handleDragOver, handleDrop, handleDragEnd,
  } = useDragReorder(reorderReferences);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">References</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Add professional references who can speak to your qualifications.
      </p>

      {/* Toggle */}
      <div className="flex items-start gap-3 p-4 mb-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
        <button
          onClick={() => updateSettings('showReferences', !showReferences)}
          className="flex-shrink-0 mt-0.5"
          title={showReferences ? 'Disable references page' : 'Enable references page'}
        >
          {showReferences
            ? <ToggleRight size={26} className="text-blue-600" />
            : <ToggleLeft  size={26} className="text-slate-400" />
          }
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Include References Page in PDF
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Career experts recommend providing references as a separate page, not on your resume.
            Enable this to generate a matching references page appended to your PDF.
          </p>
        </div>
      </div>

      {showReferences && (
        <>
          <div className="space-y-4">
            {references.length === 0 && (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="text-sm">No references added yet.</p>
                <p className="text-xs mt-1">Add a reference to include on your references page.</p>
              </div>
            )}
            {references.map((entry, index) => (
              <ReferenceCard
                key={entry.id}
                entry={entry}
                index={index}
                total={references.length}
                dragging={draggingIndex === index}
                dragOver={overIndex === index}
                flash={flashIndex === index}
                onDragStart={() => handleDragStart(index)}
                onDragOver={e => handleDragOver(e, index)}
                onDrop={e => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onMoveUp={() => reorderReferences(index, index - 1)}
                onMoveDown={() => reorderReferences(index, index + 1)}
              />
            ))}
          </div>

          <button
            onClick={addReference}
            className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm rounded-lg transition-colors w-full justify-center border border-blue-200 dark:border-blue-800"
          >
            <Plus size={16} />
            Add Reference
          </button>
        </>
      )}
    </div>
  );
}
