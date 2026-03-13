import { useResume } from '../../context/ResumeContext';
import { fmtDate, dateRange } from '../../utils/dateFormat';
import CustomSections from './CustomSections';

// ── Executive: dark charcoal header, gold accents, single column ──────────────

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <h2 style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 3.5,
          textTransform: 'uppercase', color: accent,
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: 'nowrap',
        }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: 0.75, backgroundColor: accent, opacity: 0.35 }} />
      </div>
      {children}
    </div>
  );
}

export default function ExecutiveTemplate() {
  const { resumeData } = useResume();
  const { personalInfo: p, experience, education, skills, projects, certifications, settings } = resumeData;

  const accent  = settings.accentColor || '#b45309';
  const dark    = '#1c2333';

  const contactParts = [p.email, p.phone, p.location].filter(Boolean).join('   ·   ');
  const urlParts     = [p.linkedin, p.portfolio, p.github].filter(Boolean).join('   ·   ');

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', lineHeight: 1.5 }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: dark, color: '#fff',
        padding: '32px 40px 24px',
        borderBottom: `4px solid ${accent}`,
      }}>
        <h1 style={{
          fontSize: 30, fontWeight: 700, letterSpacing: 3,
          textTransform: 'uppercase', color: '#fff',
          marginBottom: 4, lineHeight: 1.1,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {p.fullName || 'Your Name'}
        </h1>
        {p.jobTitle && (
          <p style={{ fontSize: 19, color: '#fff', fontWeight: 500, letterSpacing: 1, marginBottom: 10 }}>
            {p.jobTitle}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {contactParts && <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.82)', letterSpacing: 0.5 }}>{contactParts}</p>}
          {urlParts     && <p style={{ fontSize: 9, color: accent, opacity: 0.85 }}>{urlParts}</p>}
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────────── */}
      <div style={{ padding: '24px 40px', backgroundColor: '#fff' }}>

        {p.summary && (
          <div style={{ marginBottom: 18, borderLeft: `3px solid ${accent}`, paddingLeft: 14 }}>
            <p style={{ fontSize: 10, lineHeight: 1.8, color: '#374151', fontStyle: 'italic' }}>{p.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <Section title="Professional Experience" accent={accent}>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: dark }}>{exp.position}</span>
                  <span style={{ fontSize: 9, color: '#9ca3af', flexShrink: 0, marginLeft: 8 }}>
                    {dateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p style={{ fontSize: 10, color: accent, fontWeight: 600, marginBottom: 5 }}>
                  {exp.company}{exp.location ? `  ·  ${exp.location}` : ''}
                </p>
                {exp.bullets.filter(b => b.trim()).length > 0 && (
                  <ul style={{ paddingLeft: 16, margin: 0, listStyle: 'none' }}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => (
                      <li key={i} style={{ fontSize: 9.5, lineHeight: 1.65, color: '#374151', marginBottom: 2, paddingLeft: 10, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: accent, fontWeight: 700 }}>›</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}
        <CustomSections afterSection="experience" />

        {education.length > 0 && (
          <Section title="Education" accent={accent}>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: dark }}>{edu.school}</span>
                  <span style={{ fontSize: 9, color: '#9ca3af', flexShrink: 0, marginLeft: 8 }}>
                    {dateRange(edu.startDate, edu.endDate, false)}
                  </span>
                </div>
                <p style={{ fontSize: 10, color: '#475569' }}>
                  {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  {edu.gpa ? `  ·  GPA ${edu.gpa}` : ''}
                </p>
                {edu.achievements && <p style={{ fontSize: 9.5, color: '#64748b', marginTop: 2 }}>{edu.achievements}</p>}
              </div>
            ))}
          </Section>
        )}
        <CustomSections afterSection="education" />

        {skills.length > 0 && (
          <Section title="Core Competencies" accent={accent}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {skills.flatMap(cat => cat.items).map((item, i) => (
                <span key={i} style={{
                  fontSize: 9.5, padding: '3px 10px',
                  border: `1px solid ${accent}40`,
                  borderRadius: 3, color: '#374151',
                  backgroundColor: `${accent}08`,
                }}>
                  {item}
                </span>
              ))}
            </div>
          </Section>
        )}
        <CustomSections afterSection="skills" />

        {projects.length > 0 && (
          <Section title="Key Projects" accent={accent}>
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: dark }}>{proj.name}</span>
                  {proj.liveLink && <span style={{ fontSize: 8.5, color: accent }}>{proj.liveLink}</span>}
                </div>
                {proj.technologies && <p style={{ fontSize: 9, color: accent, fontWeight: 600, marginBottom: 2 }}>{proj.technologies}</p>}
                {proj.description  && <p style={{ fontSize: 9.5, lineHeight: 1.6, color: '#374151' }}>{proj.description}</p>}
              </div>
            ))}
          </Section>
        )}
        <CustomSections afterSection="projects" />

        {certifications.length > 0 && (
          <Section title="Certifications" accent={accent}>
            {certifications.map(cert => (
              <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: dark }}>{cert.name}</span>
                  {cert.issuer && <span style={{ fontSize: 10, color: '#64748b' }}> · {cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: 9, color: '#9ca3af' }}>{fmtDate(cert.date)}</span>}
              </div>
            ))}
          </Section>
        )}
        <CustomSections afterSection="certifications" />
      </div>
    </div>
  );
}
