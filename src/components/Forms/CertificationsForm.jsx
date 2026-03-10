import { Plus, Trash2, Award, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import SectionAIPanel from '../AI/SectionAIPanel';
import { useDragReorder } from '../../hooks/useDragReorder';

function CertificationCard({
  entry, index, total,
  dragging, dragOver, flash,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onMoveUp, onMoveDown,
}) {
  const { updateCertification, removeCertification } = useResume();
  const update = (field, value) => updateCertification(entry.id, field, value);

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
          <Award size={14} className="text-blue-500 flex-shrink-0" />
          <span className="truncate">
            {entry.name ? entry.name : <span className="text-slate-400 font-normal">New Certification</span>}
          </span>
        </h4>
        <button
          onClick={() => removeCertification(entry.id)}
          className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
          title="Remove certification"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Name + Issuer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Certification Name</label>
          <input
            type="text"
            value={entry.name}
            onChange={e => update('name', e.target.value)}
            placeholder="AWS Certified Cloud Practitioner"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Issuing Organisation</label>
          <input
            type="text"
            value={entry.issuer}
            onChange={e => update('issuer', e.target.value)}
            placeholder="Amazon Web Services"
            className="input-field"
          />
        </div>
      </div>

      {/* Date + Link */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Date Issued</label>
          <input
            type="month"
            value={entry.date}
            onChange={e => update('date', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Credential URL (optional)</label>
          <input
            type="text"
            value={entry.link}
            onChange={e => update('link', e.target.value)}
            placeholder="credly.com/badges/..."
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
}

export default function CertificationsForm() {
  const { resumeData, addCertification, updateSection, reorderCertifications } = useResume();
  const { certifications } = resumeData;

  const {
    draggingIndex, overIndex, flashIndex,
    handleDragStart, handleDragOver, handleDrop, handleDragEnd,
  } = useDragReorder(reorderCertifications);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Certifications</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Add professional certifications, licences, or online course completions.</p>

      <div className="space-y-4">
        {certifications.length === 0 && (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-sm">No certifications added yet.</p>
            <p className="text-xs mt-1">Add a certification to validate your expertise.</p>
          </div>
        )}
        {certifications.map((entry, index) => (
          <CertificationCard
            key={entry.id}
            entry={entry}
            index={index}
            total={certifications.length}
            dragging={draggingIndex === index}
            dragOver={overIndex === index}
            flash={flashIndex === index}
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onMoveUp={() => reorderCertifications(index, index - 1)}
            onMoveDown={() => reorderCertifications(index, index + 1)}
          />
        ))}
      </div>

      <button
        onClick={addCertification}
        className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm rounded-lg transition-colors w-full justify-center border border-blue-200 dark:border-blue-800"
      >
        <Plus size={16} />
        Add Certification
      </button>

      {certifications.length > 0 && (
        <SectionAIPanel
          sectionName="certifications"
          sectionData={certifications}
          onAccept={data => updateSection('certifications', data)}
        />
      )}
    </div>
  );
}
