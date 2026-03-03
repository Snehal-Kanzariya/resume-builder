import { Briefcase, GraduationCap, FolderOpen, Award, Zap, User } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { fmtDate, dateRange } from '../../utils/dateFormat';

// ── Helpers ───────────────────────────────────────────────────────────────────

function RightSection({ title, icon: Icon, accent, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
        <span style={{
          width: 20, height: 20, borderRadius: '50%',
          backgroundColor: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={11} color="#fff" />
        </span>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: accent }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: `${accent}25` }} />
      </div>
      {children}
    </div>
  );
}

function SkillBar({ label, accent }) {
  // Deterministic "width" from label length so it looks varied but consistent
  const pct = 55 + (label.length * 7) % 40;
  return (
    <div style={{ marginBottom: 7 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 9.5, fontWeight: 500, color: '#fff', opacity: 0.9 }}>{label}</span>
      </div>
      <div style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 2,
        }} />
      </div>
    </div>
  );
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function CreativeTemplate() {
  const { resumeData } = useResume();
  const {
    personalInfo: p, experience, education,
    skills, projects, certifications, settings,
  } = resumeData;

  const accent = settings.accentColor || '#2563eb';

  // Darken accent slightly for header gradient
  const headerBg = `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`;

  const contactParts = [p.email, p.phone, p.location].filter(Boolean);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: '100%', display: 'flex', flexDirection: 'column', lineHeight: 1.45 }}>

      {/* ── HEADER BANNER ──────────────────────────────────────────────────── */}
      <div style={{ background: headerBg, padding: '24px 30px', color: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 4 }}>
              {p.fullName || 'Your Name'}
            </h1>
            {p.jobTitle && (
              <p style={{ fontSize: 11, fontWeight: 500, opacity: 0.85, letterSpacing: 1 }}>{p.jobTitle}</p>
            )}
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {contactParts.map((c, i) => (
              <span key={i} style={{ fontSize: 9, opacity: 0.8 }}>{c}</span>
            ))}
            {p.linkedin  && <span style={{ fontSize: 9, opacity: 0.75 }}>{p.linkedin}</span>}
            {p.portfolio && <span style={{ fontSize: 9, opacity: 0.75 }}>{p.portfolio}</span>}
          </div>
        </div>

        {/* Tagline / summary short */}
        {p.summary && (
          <p style={{ fontSize: 9.5, opacity: 0.8, marginTop: 10, lineHeight: 1.6, maxWidth: 560 }}>
            {p.summary.length > 200 ? p.summary.slice(0, 200) + '…' : p.summary}
          </p>
        )}
      </div>

      {/* ── BODY ───────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT: skills + certifications */}
        <div style={{
          width: '33%', backgroundColor: '#0f172a', color: '#fff',
          padding: '20px 16px', display: 'flex', flexDirection: 'column',
          gap: 16, flexShrink: 0, overflowY: 'hidden',
        }}>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Zap size={12} color={accent} />
                <p style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: accent }}>
                  Skills
                </p>
              </div>
              {skills.map(cat => (
                <div key={cat.id} style={{ marginBottom: 12 }}>
                  {cat.category && (
                    <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
                      {cat.category}
                    </p>
                  )}
                  {cat.items.map((item, i) => (
                    <SkillBar key={i} label={item} accent={accent} />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Award size={12} color={accent} />
                <p style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: accent }}>
                  Certifications
                </p>
              </div>
              {certifications.map(cert => (
                <div key={cert.id} style={{ marginBottom: 9, borderLeft: `2px solid ${accent}40`, paddingLeft: 8 }}>
                  <p style={{ fontSize: 9.5, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{cert.name}</p>
                  {cert.issuer && <p style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.55)' }}>{cert.issuer}</p>}
                  {cert.date  && <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)'  }}>{fmtDate(cert.date)}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: experience + education + projects */}
        <div style={{
          flex: 1, padding: '20px 22px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>

          {/* Experience */}
          {experience.length > 0 && (
            <RightSection title="Experience" icon={Briefcase} accent={accent}>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{exp.position}</span>
                    <span style={{ fontSize: 8.5, color: '#94a3b8', flexShrink: 0, marginLeft: 8 }}>
                      {dateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p style={{ fontSize: 9.5, color: accent, fontWeight: 600, marginBottom: 4 }}>
                    {exp.company}{exp.location ? `  ·  ${exp.location}` : ''}
                  </p>
                  {exp.bullets.filter(b => b.trim()).length > 0 && (
                    <ul style={{ paddingLeft: 13, margin: 0, listStyle: 'disc' }}>
                      {exp.bullets.filter(b => b.trim()).map((b, i) => (
                        <li key={i} style={{ fontSize: 9.5, lineHeight: 1.6, color: '#374151', marginBottom: 1.5 }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </RightSection>
          )}

          {/* Education */}
          {education.length > 0 && (
            <RightSection title="Education" icon={GraduationCap} accent={accent}>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{edu.school}</span>
                    <span style={{ fontSize: 8.5, color: '#94a3b8' }}>
                      {dateRange(edu.startDate, edu.endDate, false)}
                    </span>
                  </div>
                  <p style={{ fontSize: 10, color: '#475569' }}>
                    {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                    {edu.gpa ? `  ·  GPA ${edu.gpa}` : ''}
                  </p>
                  {edu.achievements && (
                    <p style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>{edu.achievements}</p>
                  )}
                </div>
              ))}
            </RightSection>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <RightSection title="Projects" icon={FolderOpen} accent={accent}>
              {projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: 9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#0f172a' }}>{proj.name}</span>
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
            </RightSection>
          )}
        </div>
      </div>
    </div>
  );
}
