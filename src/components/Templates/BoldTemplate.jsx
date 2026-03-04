import { useResume } from '../../context/ResumeContext';
import { fmtDate, dateRange } from '../../utils/dateFormat';

// ── Bold: massive name, filled color blocks for section headers, high contrast ─

function SectionBlock({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        backgroundColor: accent, color: '#fff',
        padding: '4px 14px', marginBottom: 10,
        display: 'inline-block',
        fontSize: 8.5, fontWeight: 800,
        letterSpacing: 3, textTransform: 'uppercase',
      }}>
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function BoldTemplate() {
  const { resumeData } = useResume();
  const { personalInfo: p, experience, education, skills, projects, certifications, settings } = resumeData;

  const accent = settings.accentColor || '#2563eb';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', overflowY: 'hidden', backgroundColor: '#fff', lineHeight: 1.5 }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: '28px 32px 20px', borderBottom: `5px solid ${accent}` }}>
        <h1 style={{
          fontSize: 38, fontWeight: 900, lineHeight: 1.0,
          color: '#0f172a', letterSpacing: -1.5,
          textTransform: 'uppercase', marginBottom: 4,
        }}>
          {p.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          {p.jobTitle && (
            <p style={{
              fontSize: 13, fontWeight: 700, color: accent,
              letterSpacing: 0.5, textTransform: 'uppercase',
            }}>
              {p.jobTitle}
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'right' }}>
            <p style={{ fontSize: 9, color: '#374151' }}>
              {[p.email, p.phone, p.location].filter(Boolean).join('  |  ')}
            </p>
            {(p.linkedin || p.portfolio) && (
              <p style={{ fontSize: 9, color: accent }}>
                {[p.linkedin, p.portfolio].filter(Boolean).join('  |  ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 32px', display: 'flex', gap: 24, overflow: 'hidden' }}>

        {/* LEFT — main content (62%) */}
        <div style={{ flex: '0 0 62%', overflowY: 'hidden' }}>

          {p.summary && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                backgroundColor: accent, color: '#fff',
                padding: '4px 14px', marginBottom: 10,
                display: 'inline-block',
                fontSize: 8.5, fontWeight: 800,
                letterSpacing: 3, textTransform: 'uppercase',
              }}>
                Profile
              </div>
              <p style={{ fontSize: 10, lineHeight: 1.75, color: '#374151' }}>{p.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <SectionBlock title="Experience" accent={accent}>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{exp.position}</span>
                    <span style={{ fontSize: 9, color: '#9ca3af', flexShrink: 0, marginLeft: 8 }}>
                      {dateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p style={{ fontSize: 10, color: accent, fontWeight: 700, marginBottom: 5 }}>
                    {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                  </p>
                  {exp.bullets.filter(b => b.trim()).length > 0 && (
                    <ul style={{ paddingLeft: 16, margin: 0, listStyle: 'disc' }}>
                      {exp.bullets.filter(b => b.trim()).map((b, i) => (
                        <li key={i} style={{ fontSize: 9.5, lineHeight: 1.65, color: '#1e293b', marginBottom: 2 }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </SectionBlock>
          )}

          {projects.length > 0 && (
            <SectionBlock title="Projects" accent={accent}>
              {projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: 9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>{proj.name}</span>
                    {proj.liveLink && <span style={{ fontSize: 8.5, color: accent }}>{proj.liveLink}</span>}
                  </div>
                  {proj.technologies && <p style={{ fontSize: 9, color: accent, fontWeight: 700, marginBottom: 2 }}>{proj.technologies}</p>}
                  {proj.description  && <p style={{ fontSize: 9.5, lineHeight: 1.6, color: '#1e293b' }}>{proj.description}</p>}
                </div>
              ))}
            </SectionBlock>
          )}
        </div>

        {/* RIGHT — sidebar (38%) */}
        <div style={{ flex: '0 0 35%', overflowY: 'hidden' }}>

          {skills.length > 0 && (
            <SectionBlock title="Skills" accent={accent}>
              {skills.map(cat => (
                <div key={cat.id} style={{ marginBottom: 8 }}>
                  {cat.category && (
                    <p style={{ fontSize: 8, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
                      {cat.category}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {cat.items.map((item, i) => (
                      <span key={i} style={{
                        fontSize: 9, padding: '2px 8px',
                        backgroundColor: `${accent}15`,
                        border: `1.5px solid ${accent}35`,
                        borderRadius: 3, color: '#1e293b', fontWeight: 500,
                      }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </SectionBlock>
          )}

          {education.length > 0 && (
            <SectionBlock title="Education" accent={accent}>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 9 }}>
                  <p style={{ fontSize: 10.5, fontWeight: 800, color: '#0f172a' }}>{edu.school}</p>
                  <p style={{ fontSize: 9.5, color: '#374151' }}>
                    {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  </p>
                  <p style={{ fontSize: 8.5, color: '#64748b' }}>
                    {dateRange(edu.startDate, edu.endDate, false)}
                    {edu.gpa ? ` · GPA ${edu.gpa}` : ''}
                  </p>
                  {edu.achievements && <p style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>{edu.achievements}</p>}
                </div>
              ))}
            </SectionBlock>
          )}

          {certifications.length > 0 && (
            <SectionBlock title="Certifications" accent={accent}>
              {certifications.map(cert => (
                <div key={cert.id} style={{ marginBottom: 7 }}>
                  <p style={{ fontSize: 9.5, fontWeight: 700, color: '#0f172a' }}>{cert.name}</p>
                  {cert.issuer && <p style={{ fontSize: 9, color: '#64748b' }}>{cert.issuer}</p>}
                  {cert.date   && <p style={{ fontSize: 8.5, color: '#94a3b8' }}>{fmtDate(cert.date)}</p>}
                </div>
              ))}
            </SectionBlock>
          )}
        </div>
      </div>
    </div>
  );
}
