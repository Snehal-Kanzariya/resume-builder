import { Plus, Trash2, ExternalLink, Github, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import SectionAIPanel from '../AI/SectionAIPanel';
import CondenseButton from '../AI/CondenseButton';
import { useDragReorder } from '../../hooks/useDragReorder';

function ProjectCard({
  entry, index, total,
  dragging, dragOver, flash,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onMoveUp, onMoveDown,
}) {
  const { updateProject, removeProject } = useResume();
  const update = (field, value) => updateProject(entry.id, field, value);

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

        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1 min-w-0 truncate">
          {entry.name ? entry.name : <span className="text-slate-400 font-normal">New Project</span>}
        </h4>
        <button
          onClick={() => removeProject(entry.id)}
          className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
          title="Remove project"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Project Name</label>
        <input
          type="text"
          value={entry.name}
          onChange={e => update('name', e.target.value)}
          placeholder="OpenResume"
          className="input-field"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description</label>
        <textarea
          rows={3}
          value={entry.description}
          onChange={e => update('description', e.target.value)}
          placeholder="Briefly describe what the project does, the problem it solves, and your role..."
          className="input-field resize-none"
        />
        <CondenseButton
          text={entry.description}
          sectionName="project description"
          onCondensed={v => update('description', v)}
        />
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Technologies Used</label>
        <input
          type="text"
          value={entry.technologies}
          onChange={e => update('technologies', e.target.value)}
          placeholder="React, TypeScript, Tailwind CSS, Node.js"
          className="input-field"
        />
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
            <ExternalLink size={11} /> Live URL (optional)
          </label>
          <input
            type="text"
            value={entry.liveLink}
            onChange={e => update('liveLink', e.target.value)}
            placeholder="yourproject.com"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
            <Github size={11} /> GitHub URL (optional)
          </label>
          <input
            type="text"
            value={entry.githubLink}
            onChange={e => update('githubLink', e.target.value)}
            placeholder="github.com/user/project"
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
}

export default function ProjectsForm() {
  const { resumeData, addProject, updateSection, reorderProjects } = useResume();
  const { projects } = resumeData;

  const {
    draggingIndex, overIndex, flashIndex,
    handleDragStart, handleDragOver, handleDrop, handleDragEnd,
  } = useDragReorder(reorderProjects);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Projects</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Showcase personal, academic, or open-source projects that highlight your skills.</p>

      <div className="space-y-4">
        {projects.length === 0 && (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-sm">No projects added yet.</p>
            <p className="text-xs mt-1">Add a project to show off your work.</p>
          </div>
        )}
        {projects.map((entry, index) => (
          <ProjectCard
            key={entry.id}
            entry={entry}
            index={index}
            total={projects.length}
            dragging={draggingIndex === index}
            dragOver={overIndex === index}
            flash={flashIndex === index}
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onMoveUp={() => reorderProjects(index, index - 1)}
            onMoveDown={() => reorderProjects(index, index + 1)}
          />
        ))}
      </div>

      <button
        onClick={addProject}
        className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm rounded-lg transition-colors w-full justify-center border border-blue-200 dark:border-blue-800"
      >
        <Plus size={16} />
        Add Project
      </button>

      {projects.length > 0 && (
        <SectionAIPanel
          sectionName="projects"
          sectionData={projects}
          onAccept={data => updateSection('projects', data)}
        />
      )}
    </div>
  );
}
