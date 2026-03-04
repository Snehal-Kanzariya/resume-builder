import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import SectionAIPanel from '../AI/SectionAIPanel';

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

function SkillCategoryCard({ category }) {
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
    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-3">
          <label className="block text-xs font-medium text-slate-600 mb-1">Category Name</label>
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
  const { resumeData, addSkillCategory, updateSection } = useResume();
  const { skills } = resumeData;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Skills</h2>
      <p className="text-sm text-slate-500 mb-6">
        Group skills by category. Type a skill and press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs">,</kbd> to add.
      </p>

      <div className="space-y-4">
        {skills.length === 0 && (
          <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-sm">No skill categories yet.</p>
            <p className="text-xs mt-1">Add a category like "Languages" or "Tools" to get started.</p>
          </div>
        )}
        {skills.map(category => (
          <SkillCategoryCard key={category.id} category={category} />
        ))}
      </div>

      <button
        onClick={addSkillCategory}
        className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm rounded-lg transition-colors w-full justify-center border border-blue-200"
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
