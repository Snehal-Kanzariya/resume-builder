import { useRef } from 'react';
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

const PROFICIENCY_OPTIONS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];

const PROFICIENCY_DOTS = {
  Native:       5,
  Fluent:       4,
  Advanced:     3,
  Intermediate: 2,
  Basic:        1,
};

function ProficiencyDots({ level }) {
  const filled = PROFICIENCY_DOTS[level] || 2;
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full border-2 transition-colors ${
            i <= filled
              ? 'bg-blue-500 border-blue-500'
              : 'bg-transparent border-slate-300 dark:border-slate-600'
          }`}
        />
      ))}
    </div>
  );
}

export default function LanguagesForm() {
  const {
    resumeData,
    addLanguage,
    removeLanguage,
    updateLanguage,
    reorderLanguages,
  } = useResume();

  const languages = resumeData?.languages || [];
  const dragIndex = useRef(null);
  const dragOverIndex = useRef(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Languages</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add languages you speak and your proficiency level.
          </p>
        </div>
        <button
          onClick={addLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          <Plus size={13} /> Add Language
        </button>
      </div>

      {languages.length === 0 && (
        <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
          No languages added yet. Click &ldquo;Add Language&rdquo; to get started.
        </div>
      )}

      {languages.map((lang, idx) => (
        <div
          key={lang.id}
          draggable
          onDragStart={() => { dragIndex.current = idx; }}
          onDragOver={e => { e.preventDefault(); dragOverIndex.current = idx; }}
          onDrop={() => {
            if (dragIndex.current !== null && dragOverIndex.current !== null && dragIndex.current !== dragOverIndex.current) {
              reorderLanguages(dragIndex.current, dragOverIndex.current);
            }
            dragIndex.current = null;
            dragOverIndex.current = null;
          }}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm"
        >
          {/* Entry header */}
          <div className="flex items-center gap-2 mb-3">
            {/* Drag handle — desktop */}
            <span
              className="hidden md:flex text-slate-300 dark:text-slate-600 hover:text-slate-500 cursor-grab active:cursor-grabbing flex-shrink-0"
              title="Drag to reorder"
            >
              <GripVertical size={16} />
            </span>

            {/* Mobile up/down */}
            <div className="flex md:hidden gap-1 flex-shrink-0">
              {idx > 0 && (
                <button onClick={() => reorderLanguages(idx, idx - 1)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <ArrowUp size={14} />
                </button>
              )}
              {idx < languages.length - 1 && (
                <button onClick={() => reorderLanguages(idx, idx + 1)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <ArrowDown size={14} />
                </button>
              )}
            </div>

            <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              {lang.name || 'New Language'}
            </span>

            <button
              onClick={() => removeLanguage(lang.id)}
              className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
            >
              <Trash2 size={15} />
            </button>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Language
              </label>
              <input
                type="text"
                value={lang.name}
                onChange={e => updateLanguage(lang.id, 'name', e.target.value)}
                placeholder="e.g. Spanish"
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Proficiency
              </label>
              <select
                value={lang.proficiency}
                onChange={e => updateLanguage(lang.id, 'proficiency', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {PROFICIENCY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Proficiency preview dots */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">Proficiency:</span>
            <ProficiencyDots level={lang.proficiency} />
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{lang.proficiency}</span>
          </div>
        </div>
      ))}

      {languages.length > 0 && (
        <button
          onClick={addLanguage}
          className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:border-blue-300 hover:text-blue-500 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Add Another Language
        </button>
      )}
    </div>
  );
}
