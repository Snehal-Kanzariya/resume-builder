import { Plus, Trash2, ExternalLink, Github } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import SectionAIPanel from '../AI/SectionAIPanel';

function ProjectCard({ entry }) {
  const { updateProject, removeProject } = useResume();
  const update = (field, value) => updateProject(entry.id, field, value);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 shadow-sm space-y-3 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-semibold text-slate-700">
          {entry.name ? entry.name : <span className="text-slate-400 font-normal">New Project</span>}
        </h4>
        <button
          onClick={() => removeProject(entry.id)}
          className="text-slate-300 hover:text-red-400 transition-colors"
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
  const { resumeData, addProject, updateSection } = useResume();
  const { projects } = resumeData;

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
        {projects.map(entry => (
          <ProjectCard key={entry.id} entry={entry} />
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
