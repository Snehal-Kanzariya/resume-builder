import { useResume } from '../../context/ResumeContext';
import { fmtDate, dateRange } from '../../utils/dateFormat';
import CustomSections from './CustomSections';

// ── Helpers ───────────────────────────────────────────────────────────────────

function Divider() {
  return <div style={{ borderBottom: '0.75px solid #e2e8f0', margin: '13px 0' }} />;
}

function SectionHeader({ title, accent }) {
  return (
    <p style={{
      fontSize: 9, fontWeight: 700, letterSpacing: 3,
      textTransform: 'uppercase', color: accent || '#94a3b8',
      marginBottom: 11,
    }}>
      {title}
    </p>
  );
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function MinimalTemplate() {
  const { resumeData } = useResume();
  const {
    personalInfo: p, experience, education,
    skills, projects, certifications, settings,
  } = resumeData;

  const accent = settings.accentColor || '#64748b';

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 10.5, color: '#1e293b',
      padding: '44px 48px', lineHeight: 1.5,
    }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <h1 style={{
            fontSize: 28, fontWeight: 300, letterSpacing: -0.5,
            color: '#0f172a', marginBottom: 3, lineHeight: 1.1,
          }}>
            {p.fullName || 'Your Name'}
          </h1>
          {p.jobTitle && (
            <p style={{ fontSize: 11, color: accent, fontWeight: 500, letterSpacing: 0.3 }}>
              {p.jobTitle}
            </p>
          )}
        </div>

        {/* Contact block — top right */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {p.email    && <span style={{ fontSize: 9.5, color: '#475569' }}>{p.email}</span>}
          {p.phone    && <span style={{ fontSize: 9.5, color: '#475569' }}>{p.phone}</span>}
          {p.location && <span style={{ fontSize: 9.5, color: '#475569' }}>{p.location}</span>}
          {p.linkedin && <span style={{ fontSize: 9.5, color: accent   }}>{p.linkedin}</span>}
          {p.portfolio&& <span style={{ fontSize: 9.5, color: accent   }}>{p.portfolio}</span>}
          {p.github   && <span style={{ fontSize: 9.5, color: accent   }}>{p.github}</span>}
        </div>
      </div>

      <Divider />

      {/* ── SUMMARY ────────────────────────────────────────────────────────── */}
      {p.summary && (
        <>
          <p style={{ fontSize: 10, lineHeight: 1.75, color: '#475569' }}>{p.summary}</p>
          <Divider />
        </>
      )}

      {/* ── EXPERIENCE ─────────────────────────────────────────────────────── */}
      {experience.length > 0 && (
        <>
          <SectionHeader title="Experience" accent={accent} />
          {experience.map((exp, idx) => (
            <div key={exp.id} style={{ marginBottom: idx < experience.length - 1 ? 13 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#0f172a' }}>{exp.position}</span>
                <span style={{ fontSize: 9, color: '#94a3b8' }}>
                  {dateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              <p style={{ fontSize: 9.5, color: accent, fontWeight: 500, marginBottom: 4 }}>
                {exp.company}{exp.location ? `  ·  ${exp.location}` : ''}
              </p>
              {exp.bullets.filter(b => b.trim()).length > 0 && (
                <ul style={{ paddingLeft: 14, margin: 0, listStyle: 'none' }}>
                  {exp.bullets.filter(b => b.trim()).map((b, i) => (
                    <li key={i} style={{ fontSize: 9.5, lineHeight: 1.65, color: '#475569', marginBottom: 2, paddingLeft: 10, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: accent }}>–</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <Divider />
        </>
      )}
      <CustomSections afterSection="experience" />

      {/* ── EDUCATION ──────────────────────────────────────────────────────── */}
      {education.length > 0 && (
        <>
          <SectionHeader title="Education" accent={accent} />
          {education.map((edu, idx) => (
            <div key={edu.id} style={{ marginBottom: idx < education.length - 1 ? 10 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#0f172a' }}>{edu.school}</span>
                <span style={{ fontSize: 9, color: '#94a3b8' }}>
                  {dateRange(edu.startDate, edu.endDate, false)}
                </span>
              </div>
              <p style={{ fontSize: 9.5, color: '#475569' }}>
                {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                {edu.gpa ? `  ·  GPA ${edu.gpa}` : ''}
              </p>
              {edu.achievements && (
                <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>{edu.achievements}</p>
              )}
            </div>
          ))}
          <Divider />
        </>
      )}
      <CustomSections afterSection="education" />

      {/* ── SKILLS ─────────────────────────────────────────────────────────── */}
      {skills.length > 0 && (
        <>
          <SectionHeader title="Skills" accent={accent} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {skills.map(cat => (
              <div key={cat.id} style={{ display: 'flex', gap: 10 }}>
                {cat.category && (
                  <span style={{ fontSize: 9.5, color: '#94a3b8', minWidth: 120, flexShrink: 0 }}>
                    {cat.category}
                  </span>
                )}
                <span style={{ fontSize: 9.5, color: '#334155' }}>
                  {cat.items.join('  ·  ')}
                </span>
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}
      <CustomSections afterSection="skills" />

      {/* ── PROJECTS ───────────────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <>
          <SectionHeader title="Projects" accent={accent} />
          {projects.map((proj, idx) => (
            <div key={proj.id} style={{ marginBottom: idx < projects.length - 1 ? 11 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#0f172a' }}>{proj.name}</span>
                {proj.liveLink && (
                  <span style={{ fontSize: 8.5, color: accent }}>{proj.liveLink}</span>
                )}
              </div>
              {proj.technologies && (
                <p style={{ fontSize: 9, color: '#94a3b8', marginBottom: 2 }}>{proj.technologies}</p>
              )}
              {proj.description && (
                <p style={{ fontSize: 9.5, lineHeight: 1.6, color: '#475569' }}>{proj.description}</p>
              )}
            </div>
          ))}
          <Divider />
        </>
      )}
      <CustomSections afterSection="projects" />

      {/* ── CERTIFICATIONS ─────────────────────────────────────────────────── */}
      {certifications.length > 0 && (
        <>
          <SectionHeader title="Certifications" accent={accent} />
          {certifications.map(cert => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 500 }}>{cert.name}</span>
                {cert.issuer && (
                  <span style={{ fontSize: 9.5, color: '#94a3b8' }}> · {cert.issuer}</span>
                )}
              </div>
              {cert.date && (
                <span style={{ fontSize: 9, color: '#94a3b8' }}>{fmtDate(cert.date)}</span>
              )}
            </div>
          ))}
        </>
      )}
      <CustomSections afterSection="certifications" />
    </div>
  );
}
