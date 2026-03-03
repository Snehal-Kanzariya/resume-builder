import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { fmtDate, dateRange } from '../../utils/dateFormat';

// ── Sub-components ────────────────────────────────────────────────────────────

function SidebarSection({ title, children }) {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.22)', paddingTop: 14 }}>
      <p style={{
        fontSize: 8, fontWeight: 700, letterSpacing: 2.5,
        textTransform: 'uppercase', opacity: 0.6, marginBottom: 10,
      }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function MainSection({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <span style={{
          fontSize: 9, fontWeight: 800, letterSpacing: 2.2,
          textTransform: 'uppercase', color: accent, whiteSpace: 'nowrap',
        }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1.5, background: `${accent}30` }} />
      </div>
      {children}
    </div>
  );
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function ModernTemplate() {
  const { resumeData } = useResume();
  const {
    personalInfo: p, experience, education,
    skills, projects, certifications, settings,
  } = resumeData;

  const accent = settings.accentColor || '#2563eb';

  const contactItems = [
    { Icon: Mail,     val: p.email },
    { Icon: Phone,    val: p.phone },
    { Icon: MapPin,   val: p.location },
    { Icon: Linkedin, val: p.linkedin },
    { Icon: Globe,    val: p.portfolio },
  ].filter(c => c.val);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', display: 'flex', lineHeight: 1.45 }}>

      {/* ── LEFT SIDEBAR ──────────────────────────────────────────────────── */}
      <div style={{
        width: '30%', backgroundColor: accent, color: '#fff',
        padding: '30px 16px', display: 'flex', flexDirection: 'column',
        gap: 14, flexShrink: 0, overflowY: 'hidden',
      }}>

        {/* Name + title */}
        <div>
          <h1 style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.15, marginBottom: 5 }}>
            {p.fullName || 'Your Name'}
          </h1>
          {p.jobTitle && (
            <p style={{ fontSize: 10, opacity: 0.78, fontWeight: 500 }}>{p.jobTitle}</p>
          )}
        </div>

        {/* Contact */}
        {contactItems.length > 0 && (
          <SidebarSection title="Contact">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {contactItems.map(({ Icon, val }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 9.5 }}>
                  <Icon size={10} style={{ marginTop: 1.5, flexShrink: 0, opacity: 0.75 }} />
                  <span style={{ opacity: 0.9, wordBreak: 'break-all' }}>{val}</span>
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <SidebarSection title="Skills">
            {skills.map(cat => (
              <div key={cat.id} style={{ marginBottom: 10 }}>
                {cat.category && (
                  <p style={{ fontSize: 8, opacity: 0.6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 5 }}>
                    {cat.category}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {cat.items.map((item, i) => (
                    <span key={i} style={{
                      background: 'rgba(255,255,255,0.18)', borderRadius: 3,
                      padding: '2px 7px', fontSize: 9, fontWeight: 500,
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <SidebarSection title="Certifications">
            {certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: 9 }}>
                <p style={{ fontSize: 9.5, fontWeight: 600 }}>{cert.name}</p>
                {cert.issuer && <p style={{ fontSize: 8.5, opacity: 0.7 }}>{cert.issuer}</p>}
                {cert.date && <p style={{ fontSize: 8, opacity: 0.55 }}>{fmtDate(cert.date)}</p>}
              </div>
            ))}
          </SidebarSection>
        )}
      </div>

      {/* ── RIGHT MAIN ────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1, padding: '30px 22px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        {/* Summary */}
        {p.summary && (
          <MainSection title="Professional Summary" accent={accent}>
            <p style={{ fontSize: 10, lineHeight: 1.65, color: '#374151' }}>{p.summary}</p>
          </MainSection>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <MainSection title="Work Experience" accent={accent}>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#111827' }}>{exp.position}</span>
                  <span style={{ fontSize: 9, color: '#9ca3af', flexShrink: 0, marginLeft: 8 }}>
                    {dateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: accent, fontWeight: 600 }}>{exp.company}</span>
                  {exp.location && <span style={{ fontSize: 9, color: '#9ca3af' }}>{exp.location}</span>}
                </div>
                {exp.bullets.filter(b => b.trim()).length > 0 && (
                  <ul style={{ paddingLeft: 14, margin: '3px 0 0', listStyle: 'disc' }}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => (
                      <li key={i} style={{ fontSize: 9.5, lineHeight: 1.6, color: '#374151', marginBottom: 1.5 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <MainSection title="Education" accent={accent}>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>{edu.school}</span>
                  <span style={{ fontSize: 9, color: '#9ca3af', flexShrink: 0, marginLeft: 8 }}>
                    {dateRange(edu.startDate, edu.endDate, false)}
                  </span>
                </div>
                <p style={{ fontSize: 10, color: '#374151' }}>
                  {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  {edu.gpa ? ` · GPA ${edu.gpa}` : ''}
                </p>
                {edu.achievements && (
                  <p style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>{edu.achievements}</p>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <MainSection title="Projects" accent={accent}>
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>{proj.name}</span>
                  {proj.liveLink && (
                    <span style={{ fontSize: 8.5, color: accent }}>{proj.liveLink}</span>
                  )}
                </div>
                {proj.technologies && (
                  <p style={{ fontSize: 9, color: accent, fontWeight: 600, marginBottom: 2 }}>{proj.technologies}</p>
                )}
                {proj.description && (
                  <p style={{ fontSize: 9.5, lineHeight: 1.55, color: '#374151' }}>{proj.description}</p>
                )}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}
