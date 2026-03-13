import { useResume } from '../../context/ResumeContext';
import { dateRange } from '../../utils/dateFormat';
import CustomSections from './CustomSections';

// ── Tech: terminal-dark header, monospace section labels, code-badge skills ───

const MONO = "'Courier New', 'Lucida Console', monospace";

function TermHeader({ title, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{ fontFamily: MONO, fontSize: 10, color: accent, fontWeight: 700 }}>{'>'}</span>
      <span style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent }}>
        {title}
      </span>
      <div style={{ flex: 1, borderBottom: `1px dashed ${accent}40` }} />
    </div>
  );
}

function CodeBadge({ label, accent }) {
  return (
    <span style={{
      fontFamily: MONO, fontSize: 9,
      backgroundColor: `${accent}14`,
      color: accent,
      border: `1px solid ${accent}40`,
      borderRadius: 4, padding: '2px 8px',
      display: 'inline-block',
    }}>
      {label}
    </span>
  );
}

export default function TechTemplate() {
  const { resumeData } = useResume();
  const { personalInfo: p, experience, education, skills, projects, certifications, settings } = resumeData;

  const accent = settings.accentColor || '#2563eb';
  const termBg = '#0d1117';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', display: 'flex', flexDirection: 'column', lineHeight: 1.5 }}>

      {/* ── TERMINAL HEADER ──────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: termBg, color: '#c9d1d9', padding: '24px 28px 20px' }}>
        {/* Fake window chrome */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {['#ff5f57','#ffbd2e','#28c840'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontFamily: MONO, fontSize: 9, color: '#58a6ff', marginBottom: 4, display: 'block' }}>
              const candidate = &#123;
            </span>
            <h1 style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: '#e6edf3', letterSpacing: 0, lineHeight: 1.2, marginBottom: 3 }}>
              &quot;{p.fullName || 'Your Name'}&quot;
            </h1>
            {p.jobTitle && (
              <p style={{ fontFamily: MONO, fontSize: 10, color: accent, marginBottom: 6 }}>
                role: &quot;{p.jobTitle}&quot;
              </p>
            )}
            <span style={{ fontFamily: MONO, fontSize: 9, color: '#58a6ff' }}>&#125;</span>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {p.email    && <span style={{ fontFamily: MONO, fontSize: 8.5, color: '#8b949e' }}>{p.email}</span>}
            {p.phone    && <span style={{ fontFamily: MONO, fontSize: 8.5, color: '#8b949e' }}>{p.phone}</span>}
            {p.location && <span style={{ fontFamily: MONO, fontSize: 8.5, color: '#8b949e' }}>{p.location}</span>}
            {p.linkedin && <span style={{ fontFamily: MONO, fontSize: 8.5, color: accent    }}>{p.linkedin}</span>}
            {p.portfolio&& <span style={{ fontFamily: MONO, fontSize: 8.5, color: accent    }}>{p.portfolio}</span>}
            {p.github   && <span style={{ fontFamily: MONO, fontSize: 8.5, color: accent    }}>{p.github}</span>}
          </div>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '20px 28px', overflowY: 'hidden', backgroundColor: '#fff' }}>

        {p.summary && (
          <div style={{ marginBottom: 18 }}>
            <TermHeader title="// about" accent={accent} />
            <p style={{ fontSize: 10, lineHeight: 1.75, color: '#374151', paddingLeft: 16 }}>{p.summary}</p>
          </div>
        )}

        {skills.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <TermHeader title="// tech_stack" accent={accent} />
            <div style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {skills.map(cat => (
                <div key={cat.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  {cat.category && (
                    <span style={{ fontFamily: MONO, fontSize: 8.5, color: '#94a3b8', minWidth: 110, flexShrink: 0, paddingTop: 3 }}>
                      {cat.category.toLowerCase().replace(/\s+/g, '_')}:
                    </span>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {cat.items.map((item, i) => <CodeBadge key={i} label={item} accent={accent} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <CustomSections afterSection="skills" />

        {experience.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <TermHeader title="// experience" accent={accent} />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 12, paddingLeft: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{exp.position}</span>
                  <span style={{ fontFamily: MONO, fontSize: 8.5, color: '#94a3b8', flexShrink: 0, marginLeft: 8 }}>
                    {dateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p style={{ fontFamily: MONO, fontSize: 9, color: accent, marginBottom: 5 }}>
                  @ {exp.company}{exp.location ? ` // ${exp.location}` : ''}
                </p>
                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontFamily: MONO, color: accent, fontSize: 10, flexShrink: 0 }}>-</span>
                    <span style={{ fontSize: 9.5, lineHeight: 1.6, color: '#374151' }}>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        <CustomSections afterSection="experience" />

        {projects.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <TermHeader title="// projects" accent={accent} />
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: 9, paddingLeft: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: '#0f172a' }}>{proj.name}</span>
                  {proj.liveLink && <span style={{ fontFamily: MONO, fontSize: 8.5, color: accent }}>{proj.liveLink}</span>}
                </div>
                {proj.technologies && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, margin: '4px 0' }}>
                    {proj.technologies.split(',').map((t, i) => <CodeBadge key={i} label={t.trim()} accent={accent} />)}
                  </div>
                )}
                {proj.description && <p style={{ fontSize: 9.5, lineHeight: 1.6, color: '#374151' }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
        <CustomSections afterSection="projects" />

        {education.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <TermHeader title="// education" accent={accent} />
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 8, paddingLeft: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{edu.school}</span>
                  <span style={{ fontFamily: MONO, fontSize: 8.5, color: '#94a3b8' }}>
                    {dateRange(edu.startDate, edu.endDate, false)}
                  </span>
                </div>
                <p style={{ fontSize: 9.5, color: '#475569' }}>
                  {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  {edu.gpa ? `  ·  GPA ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </div>
        )}
        <CustomSections afterSection="education" />

        {certifications.length > 0 && (
          <div>
            <TermHeader title="// certifications" accent={accent} />
            {certifications.map(cert => (
              <div key={cert.id} style={{ paddingLeft: 16, marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#0f172a' }}>{cert.name}
                  {cert.issuer && <span style={{ fontWeight: 400, color: '#64748b' }}> · {cert.issuer}</span>}
                </span>
              </div>
            ))}
          </div>
        )}
        <CustomSections afterSection="certifications" />
      </div>
    </div>
  );
}
