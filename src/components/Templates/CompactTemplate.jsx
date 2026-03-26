import { useResume } from '../../context/ResumeContext';
import { fmtDate, dateRange } from '../../utils/dateFormat';
import CustomSections from './CustomSections';
import LanguagesSection from './LanguagesSection';

// ── Compact: 2-col sidebar for skills+edu+certs, main col for exp+projects ────

function SideLabel({ title, accent }) {
  return (
    <p style={{
      fontSize: 7.5, fontWeight: 800, letterSpacing: 2.5,
      textTransform: 'uppercase', color: accent,
      borderBottom: `1.5px solid ${accent}`,
      paddingBottom: 3, marginBottom: 6,
    }}>
      {title}
    </p>
  );
}

function MainLabel({ title, accent }) {
  return (
    <div className="resume-section-header" style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
      <span style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', color: accent, whiteSpace: 'nowrap' }}>
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: `${accent}25` }} />
    </div>
  );
}

export default function CompactTemplate() {
  const { resumeData } = useResume();
  const { personalInfo: p, experience, education, skills, projects, certifications, settings } = resumeData;

  const accent = settings.accentColor || '#2563eb';

  const contactLine = [p.email, p.phone, p.location].filter(Boolean).join(' · ');
  const urlLine     = [p.linkedin, p.portfolio, p.github].filter(Boolean).join(' · ');

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', lineHeight: 1.4 }}>

      {/* ── HEADER (full width, compact) ─────────────────────────────────────── */}
      <div style={{ padding: '14px 18px 10px', borderBottom: `2.5px solid ${accent}`, backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 2 }}>
              {p.fullName || 'Your Name'}
            </h1>
            {p.jobTitle && (
              <p style={{ fontSize: 10, color: accent, fontWeight: 600 }}>{p.jobTitle}</p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            {contactLine && <p style={{ fontSize: 8.5, color: '#64748b' }}>{contactLine}</p>}
            {urlLine     && <p style={{ fontSize: 8.5, color: accent, marginTop: 2 }}>{urlLine}</p>}
          </div>
        </div>
        {p.summary && (
          <p style={{ fontSize: 9, lineHeight: 1.65, color: '#475569', marginTop: 6 }}>{p.summary}</p>
        )}
      </div>

      {/* ── TWO COLUMN BODY ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex' }}>

        {/* LEFT SIDEBAR — 32% */}
        <div style={{
          width: '32%', padding: '10px 12px', flexShrink: 0,
          borderRight: '1px solid #e2e8f0', display: 'flex',
          flexDirection: 'column', gap: 10,
          backgroundColor: '#f8fafc',
        }}>

          {skills.length > 0 && (
            <div className="resume-section">
              <SideLabel title="Skills" accent={accent} />
              {skills.map(cat => (
                <div key={cat.id} style={{ marginBottom: 5 }}>
                  {cat.category && (
                    <p style={{ fontSize: 7.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
                      {cat.category}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                    {cat.items.map((item, i) => (
                      <span key={i} style={{
                        fontSize: 8, padding: '1.5px 6px',
                        backgroundColor: `${accent}14`, color: accent,
                        border: `1px solid ${accent}25`, borderRadius: 3,
                      }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div className="resume-section">
              <SideLabel title="Education" accent={accent} />
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 7 }}>
                  <p style={{ fontSize: 9.5, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{edu.school}</p>
                  <p style={{ fontSize: 8.5, color: '#475569', marginTop: 1 }}>
                    {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  </p>
                  <p style={{ fontSize: 8, color: '#94a3b8', marginTop: 1 }}>
                    {dateRange(edu.startDate, edu.endDate, false)}
                    {edu.gpa ? ` · GPA ${edu.gpa}` : ''}
                  </p>
                  {edu.achievements && (
                    <p style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>{edu.achievements}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <LanguagesSection accentColor={accent} />

          {certifications.length > 0 && (
            <div className="resume-section">
              <SideLabel title="Certifications" accent={accent} />
              {certifications.map(cert => (
                <div key={cert.id} style={{ marginBottom: 5 }}>
                  <p style={{ fontSize: 9, fontWeight: 600, color: '#0f172a' }}>{cert.name}</p>
                  {cert.issuer && <p style={{ fontSize: 8, color: '#64748b' }}>{cert.issuer}</p>}
                  {cert.date   && <p style={{ fontSize: 7.5, color: '#94a3b8' }}>{fmtDate(cert.date)}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT MAIN — 68% */}
        <div style={{ flex: 1, padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>

          {experience.length > 0 && (
            <div className="resume-section">
              <MainLabel title="Experience" accent={accent} />
              {experience.map(exp => (
                <div key={exp.id} className="resume-entry" style={{ marginBottom: 8, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#0f172a' }}>{exp.position}</span>
                    <span style={{ fontSize: 8, color: '#9ca3af', flexShrink: 0, marginLeft: 6 }}>
                      {dateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p style={{ fontSize: 9, color: accent, fontWeight: 600, marginTop: 0, marginBottom: 3 }}>
                    {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                  </p>
                  {exp.bullets.filter(b => b.trim()).length > 0 && (
                    <ul style={{ paddingLeft: 12, margin: 0, listStyle: 'disc' }}>
                      {exp.bullets.filter(b => b.trim()).map((b, i) => (
                        <li key={i} style={{ fontSize: 9, lineHeight: 1.4, color: '#374151', marginBottom: 0.5 }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
          <CustomSections afterSection="experience" />

          {projects.length > 0 && (
            <div className="resume-section">
              <MainLabel title="Projects" accent={accent} />
              {projects.map(proj => (
                <div key={proj.id} className="resume-entry" style={{ marginBottom: 6, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>{proj.name}</span>
                    {proj.liveLink && <span style={{ fontSize: 8, color: accent }}>{proj.liveLink}</span>}
                  </div>
                  {proj.technologies && (
                    <p style={{ fontSize: 8.5, color: accent, fontWeight: 600, marginBottom: 2 }}>{proj.technologies}</p>
                  )}
                  {proj.description && (
                    <p style={{ fontSize: 9, lineHeight: 1.55, color: '#374151' }}>{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          <CustomSections afterSection="projects" />
          <CustomSections afterSection="certifications" />
        </div>
      </div>
    </div>
  );
}
