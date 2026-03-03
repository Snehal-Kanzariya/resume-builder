import { useResume } from '../../context/ResumeContext';
import { fmtDate, dateRange } from '../../utils/dateFormat';

// ── Helpers ───────────────────────────────────────────────────────────────────

function HR({ accent }) {
  return <div style={{ borderBottom: `2px solid ${accent}`, marginBottom: 8 }} />;
}

function SectionHeader({ title, accent }) {
  return (
    <div style={{ marginBottom: 7 }}>
      <h2 style={{
        fontSize: 11.5, fontWeight: 700,
        fontFamily: "'Merriweather', serif",
        textTransform: 'uppercase', letterSpacing: 2,
        color: accent || '#1e293b',
        marginBottom: 4,
      }}>
        {title}
      </h2>
      <HR accent={accent} />
    </div>
  );
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function ClassicTemplate() {
  const { resumeData } = useResume();
  const {
    personalInfo: p, experience, education,
    skills, projects, certifications, settings,
  } = resumeData;

  const accent = settings.accentColor || '#1e293b';

  const contactLine = [p.email, p.phone, p.location, p.linkedin, p.portfolio]
    .filter(Boolean)
    .join('  ·  ');

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 10.5, color: '#1e293b',
      padding: '40px 44px', lineHeight: 1.5,
      height: '100%', overflowY: 'hidden',
    }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <h1 style={{
          fontFamily: "'Merriweather', serif",
          fontSize: 26, fontWeight: 700,
          letterSpacing: 1.5, color: '#0f172a',
          marginBottom: 4,
        }}>
          {p.fullName || 'Your Name'}
        </h1>
        {p.jobTitle && (
          <p style={{ fontSize: 12, color: accent, fontWeight: 600, marginBottom: 6 }}>
            {p.jobTitle}
          </p>
        )}
        {contactLine && (
          <p style={{ fontSize: 9, color: '#64748b', letterSpacing: 0.5 }}>
            {contactLine}
          </p>
        )}
        <div style={{ borderBottom: `3px double ${accent}`, marginTop: 14 }} />
      </div>

      {/* ── SUMMARY ────────────────────────────────────────────────────────── */}
      {p.summary && (
        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="Professional Summary" accent={accent} />
          <p style={{ fontSize: 10, lineHeight: 1.7, color: '#374151', textAlign: 'justify' }}>
            {p.summary}
          </p>
        </div>
      )}

      {/* ── EXPERIENCE ─────────────────────────────────────────────────────── */}
      {experience.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="Work Experience" accent={accent} />
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, fontFamily: "'Merriweather', serif" }}>
                  {exp.position}
                </span>
                <span style={{ fontSize: 9.5, color: '#64748b' }}>
                  {dateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10.5, fontStyle: 'italic', color: '#475569' }}>
                  {exp.company}{exp.location ? `, ${exp.location}` : ''}
                </span>
              </div>
              {exp.bullets.filter(b => b.trim()).length > 0 && (
                <ul style={{ paddingLeft: 16, margin: '3px 0 0', listStyle: 'disc' }}>
                  {exp.bullets.filter(b => b.trim()).map((b, i) => (
                    <li key={i} style={{ fontSize: 10, lineHeight: 1.65, color: '#374151', marginBottom: 2 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── EDUCATION ──────────────────────────────────────────────────────── */}
      {education.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="Education" accent={accent} />
          {education.map(edu => (
            <div key={edu.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, fontFamily: "'Merriweather', serif" }}>
                  {edu.school}
                </span>
                <span style={{ fontSize: 9.5, color: '#64748b' }}>
                  {dateRange(edu.startDate, edu.endDate, false)}
                </span>
              </div>
              <p style={{ fontSize: 10.5, fontStyle: 'italic', color: '#475569' }}>
                {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                {edu.gpa ? `  ·  GPA: ${edu.gpa}` : ''}
              </p>
              {edu.achievements && (
                <p style={{ fontSize: 9.5, color: '#64748b', marginTop: 2 }}>{edu.achievements}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── SKILLS ─────────────────────────────────────────────────────────── */}
      {skills.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="Skills" accent={accent} />
          {skills.map(cat => (
            <div key={cat.id} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
              {cat.category && (
                <span style={{ fontSize: 10, fontWeight: 700, minWidth: 130, color: '#374151' }}>
                  {cat.category}:
                </span>
              )}
              <span style={{ fontSize: 10, color: '#475569' }}>
                {cat.items.join(' · ')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── PROJECTS ───────────────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="Projects" accent={accent} />
          {projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Merriweather', serif" }}>
                  {proj.name}
                </span>
                {proj.liveLink && (
                  <span style={{ fontSize: 9, fontStyle: 'italic', color: '#64748b' }}>{proj.liveLink}</span>
                )}
              </div>
              {proj.technologies && (
                <p style={{ fontSize: 9.5, fontStyle: 'italic', color: '#64748b', marginBottom: 3 }}>
                  {proj.technologies}
                </p>
              )}
              {proj.description && (
                <p style={{ fontSize: 10, lineHeight: 1.6, color: '#374151' }}>{proj.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── CERTIFICATIONS ─────────────────────────────────────────────────── */}
      {certifications.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="Certifications" accent={accent} />
          {certifications.map(cert => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700 }}>{cert.name}</span>
                {cert.issuer && (
                  <span style={{ fontSize: 10, fontStyle: 'italic', color: '#475569' }}> · {cert.issuer}</span>
                )}
              </div>
              {cert.date && (
                <span style={{ fontSize: 9.5, color: '#64748b' }}>{fmtDate(cert.date)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
