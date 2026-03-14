import { useResume } from '../../context/ResumeContext';

export default function ReferencesPageTemplate() {
  const { resumeData } = useResume();
  const { personalInfo, references = [], settings } = resumeData ?? {};
  const { accentColor = '#03153a' } = settings ?? {};
  const { fullName = '', email = '', phone = '', location = '', jobTitle = '' } = personalInfo ?? {};

  const validRefs = references.filter(r => r.name?.trim());

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
      width: '794px',
      minHeight: '1123px',
      backgroundColor: '#ffffff',
      padding: '52px',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', paddingBottom: '18px', borderBottom: `3px solid ${accentColor}` }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: accentColor, margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
          {fullName || 'Your Name'}
        </h1>
        {jobTitle && (
          <p style={{ fontSize: '12px', fontWeight: '500', color: '#475569', margin: '0 0 8px 0' }}>
            {jobTitle}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '10px', color: '#64748b' }}>
          {email    && <span>{email}</span>}
          {phone    && <span>{phone}</span>}
          {location && <span>{location}</span>}
        </div>
      </div>

      {/* Section title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <div style={{ width: '28px', height: '2px', backgroundColor: accentColor, flexShrink: 0 }} />
        <h2 style={{
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: accentColor,
          margin: 0,
        }}>
          Professional References
        </h2>
      </div>

      {/* Reference cards grid */}
      {validRefs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {validRefs.map(ref => (
            <div key={ref.id} style={{
              padding: '16px 18px',
              border: '1px solid #e2e8f0',
              borderLeft: `3px solid ${accentColor}`,
              borderRadius: '6px',
              backgroundColor: '#f8fafc',
            }}>
              {/* Name */}
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' }}>
                {ref.name}
              </div>

              {/* Title + Company */}
              {(ref.title || ref.company) && (
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '10px' }}>
                  {ref.title}
                  {ref.title && ref.company ? ' at ' : ''}
                  {ref.company}
                </div>
              )}

              {/* Contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: ref.relationship ? '8px' : '0' }}>
                {ref.phone && (
                  <div style={{ fontSize: '10px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '9px' }}>&#9990;</span>
                    {ref.phone}
                  </div>
                )}
                {ref.email && (
                  <div style={{ fontSize: '10px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '9px' }}>&#9993;</span>
                    {ref.email}
                  </div>
                )}
              </div>

              {/* Relationship */}
              {ref.relationship && (
                <div style={{ fontSize: '10px', color: accentColor, fontStyle: 'italic', marginTop: '6px' }}>
                  Relationship: {ref.relationship}
                </div>
              )}

              {/* Note */}
              {ref.note && (
                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '5px', lineHeight: '1.5' }}>
                  {ref.note}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginTop: '80px' }}>
          No references added yet.
        </p>
      )}
    </div>
  );
}
