import { useState } from 'react';
import { Plus, Trash2, X, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import SectionAIPanel from '../AI/SectionAIPanel';
import { useDragReorder } from '../../hooks/useDragReorder';

function SkillTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
      {label}
      <button
        onClick={onRemove}
        className="text-blue-400 hover:text-blue-700 transition-colors"
        title="Remove skill"
      >
        <X size={11} />
      </button>
    </span>
  );
}

function SkillCategoryCard({
  category, index, total,
  dragging, dragOver, flash,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onMoveUp, onMoveDown,
}) {
  const { updateSkillCategory, removeSkillCategory } = useResume();
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (category.items.includes(trimmed)) return;
    updateSkillCategory(category.id, 'items', [...category.items, trimmed]);
    setInputValue('');
  };

  const removeItem = (item) => {
    updateSkillCategory(category.id, 'items', category.items.filter(i => i !== item));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addItem();
    }
  };

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

      {/* Header row: mobile arrows + drag handle + category input + delete */}
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
          className="hidden md:flex items-center cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 dark:hover:text-slate-400 transition-colors flex-shrink-0 select-none self-center"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </div>

        {/* Category name input */}
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Category Name</label>
          <input
            type="text"
            value={category.category}
            onChange={e => updateSkillCategory(category.id, 'category', e.target.value)}
            placeholder="e.g. Programming Languages, Tools, Frameworks"
            className="input-field"
          />
        </div>

        <button
          onClick={() => removeSkillCategory(category.id)}
          className="mt-5 text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
          title="Remove category"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Tags */}
      {category.items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {category.items.map(item => (
            <SkillTag key={item} label={item} onRemove={() => removeItem(item)} />
          ))}
        </div>
      )}

      {/* Input to add skill */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter or comma"
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <button
          onClick={addItem}
          disabled={!inputValue.trim()}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
        >
          <Plus size={15} />
          Add
        </button>
      </div>
    </div>
  );
}

export default function SkillsForm() {
  const { resumeData, addSkillCategory, updateSection, reorderSkillCategory } = useResume();
  const { skills } = resumeData;

  const {
    draggingIndex, overIndex, flashIndex,
    handleDragStart, handleDragOver, handleDrop, handleDragEnd,
  } = useDragReorder(reorderSkillCategory);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Skills</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Group skills by category. Type a skill and press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs dark:text-slate-300">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs dark:text-slate-300">,</kbd> to add.
      </p>

      <div className="space-y-4">
        {skills.length === 0 && (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-sm">No skill categories yet.</p>
            <p className="text-xs mt-1">Add a category like "Languages" or "Tools" to get started.</p>
          </div>
        )}
        {skills.map((category, index) => (
          <SkillCategoryCard
            key={category.id}
            category={category}
            index={index}
            total={skills.length}
            dragging={draggingIndex === index}
            dragOver={overIndex === index}
            flash={flashIndex === index}
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onMoveUp={() => reorderSkillCategory(index, index - 1)}
            onMoveDown={() => reorderSkillCategory(index, index + 1)}
          />
        ))}
      </div>

      <button
        onClick={addSkillCategory}
        className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm rounded-lg transition-colors w-full justify-center border border-blue-200 dark:border-blue-800"
      >
        <Plus size={16} />
        Add Skill Category
      </button>

      {skills.length > 0 && (
        <SectionAIPanel
          sectionName="skills"
          sectionData={skills}
          onAccept={data => updateSection('skills', data)}
        />
      )}
    </div>
  );
}
