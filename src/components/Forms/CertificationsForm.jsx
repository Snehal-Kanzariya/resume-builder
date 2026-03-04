import { Plus, Trash2, Award } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import SectionAIPanel from '../AI/SectionAIPanel';

function CertificationCard({ entry }) {
  const { updateCertification, removeCertification } = useResume();
  const update = (field, value) => updateCertification(entry.id, field, value);

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <Award size={14} className="text-blue-500" />
          {entry.name ? entry.name : <span className="text-slate-400 font-normal">New Certification</span>}
        </h4>
        <button
          onClick={() => removeCertification(entry.id)}
          className="text-slate-300 hover:text-red-400 transition-colors"
          title="Remove certification"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Name + Issuer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Certification Name</label>
          <input
            type="text"
            value={entry.name}
            onChange={e => update('name', e.target.value)}
            placeholder="AWS Certified Cloud Practitioner"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Issuing Organisation</label>
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
          <label className="block text-xs font-medium text-slate-600 mb-1">Date Issued</label>
          <input
            type="month"
            value={entry.date}
            onChange={e => update('date', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Credential URL (optional)</label>
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
  const { resumeData, addCertification, updateSection } = useResume();
  const { certifications } = resumeData;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Certifications</h2>
      <p className="text-sm text-slate-500 mb-6">Add professional certifications, licences, or online course completions.</p>

      <div className="space-y-4">
        {certifications.length === 0 && (
          <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-sm">No certifications added yet.</p>
            <p className="text-xs mt-1">Add a certification to validate your expertise.</p>
          </div>
        )}
        {certifications.map(entry => (
          <CertificationCard key={entry.id} entry={entry} />
        ))}
      </div>

      <button
        onClick={addCertification}
        className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm rounded-lg transition-colors w-full justify-center border border-blue-200"
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
