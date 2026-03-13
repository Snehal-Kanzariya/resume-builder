import { useState, useRef } from 'react';
import { Trash2, Plus, AlignLeft, List, GripVertical, X } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';

const POSITION_OPTIONS = [
  { value: 'personalInfo',   label: 'After Personal Info' },
  { value: 'experience',     label: 'After Experience' },
  { value: 'education',      label: 'After Education' },
  { value: 'skills',         label: 'After Skills' },
  { value: 'projects',       label: 'After Projects' },
  { value: 'certifications', label: 'After Certifications (bottom)' },
];

export default function CustomSectionForm({ sectionId, onDeleted }) {
  const {
    resumeData,
    updateCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
    removeCustomSection,
    reorderCustomSectionItems,
  } = useResume();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dragIndex = useRef(null);
  const dragOverIndex = useRef(null);

  const section = (resumeData?.customSections || []).find(s => s.id === sectionId);
  if (!section) return null;

  function handleDelete() {
    removeCustomSection(sectionId);
    toast('Custom section removed.', 'info');
    onDeleted?.();
  }

  // ── Bullet drag-and-drop ──────────────────────────────────────────────────
  function onDragStart(idx) {
    dragIndex.current = idx;
  }

  function onDragOver(e, idx) {
    e.preventDefault();
    dragOverIndex.current = idx;
  }

  function onDrop() {
    const from = dragIndex.current;
    const to   = dragOverIndex.current;
    if (from !== null && to !== null && from !== to) {
      reorderCustomSectionItems(sectionId, from, to);
    }
    dragIndex.current = null;
    dragOverIndex.current = null;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Custom Section
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add any content you want — awards, publications, volunteer work, languages, etc.
          </p>
        </div>

        {/* Delete */}
        {confirmDelete ? (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">Remove section?</span>
            <button
              onClick={handleDelete}
              className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded transition-colors"
            >Yes</button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
            ><X size={12} /></button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-1.5 rounded-lg transition-colors flex-shrink-0"
          >
            <Trash2 size={13} /> Remove Section
          </button>
        )}
      </div>

      {/* Section title */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
          Section Title
        </label>
        <input
          type="text"
          value={section.title}
          onChange={e => updateCustomSection(sectionId, 'title', e.target.value)}
          placeholder="e.g. Volunteer Work, Publications, Languages, Awards…"
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Position in resume */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
          Position in Resume
        </label>
        <select
          value={section.afterSection || 'certifications'}
          onChange={e => updateCustomSection(sectionId, 'afterSection', e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          {POSITION_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
          Controls where this section appears on the resume.
        </p>
      </div>

      {/* Content type toggle */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
          Content Format
        </label>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
          {[
            { key: 'text',    label: 'Paragraph', Icon: AlignLeft },
            { key: 'bullets', label: 'Bullet List', Icon: List },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => updateCustomSection(sectionId, 'type', key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-r last:border-r-0 border-slate-200 dark:border-slate-700 ${
                section.type === key
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {section.type === 'text' ? (
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
            Content
          </label>
          <textarea
            value={section.content}
            onChange={e => updateCustomSection(sectionId, 'content', e.target.value)}
            placeholder="Write the content for this section…"
            rows={5}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y leading-relaxed"
          />
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Line breaks and spacing are preserved in the resume.
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
            Bullet Points
          </label>
          <div className="space-y-2">
            {(section.items || ['']).map((item, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={e => onDragOver(e, idx)}
                onDrop={onDrop}
                className="flex items-start gap-2 group cursor-grab active:cursor-grabbing"
              >
                <GripVertical
                  size={14}
                  className="mt-2.5 text-slate-300 dark:text-slate-600 flex-shrink-0"
                />
                <span className="mt-2.5 text-slate-400 flex-shrink-0 text-xs">•</span>
                <input
                  type="text"
                  value={item}
                  onChange={e => updateCustomSectionItem(sectionId, idx, e.target.value)}
                  placeholder={`Bullet point ${idx + 1}`}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                {(section.items || []).length > 1 && (
                  <button
                    onClick={() => removeCustomSectionItem(sectionId, idx)}
                    className="mt-2 p-1 text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => addCustomSectionItem(sectionId)}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 mt-3 transition-colors"
          >
            <Plus size={13} /> Add bullet point
          </button>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            Drag the grip handle to reorder bullet points.
          </p>
        </div>
      )}
    </div>
  );
}
