import { useResume } from '../../context/ResumeContext';
import { fmtDate, dateRange } from '../../utils/dateFormat';
import CustomSections from './CustomSections';
import LanguagesSection from './LanguagesSection';

// ── Elegant: ultra-thin name, soft accent, initials watermark, italic details ─

function Section({ title, accent, children }) {
  return (
    <div className="resume-section" style={{ marginBottom: 10 }}>
      <div className="resume-section-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 7 }}>
        <div style={{ width: 24, height: 1, backgroundColor: accent, opacity: 0.5 }} />
        <p style={{
          fontSize: 8, fontWeight: 600, letterSpacing: 4,
          textTransform: 'uppercase', color: accent,
          fontFamily: "'Merriweather', serif",
        }}>
          {title}
        </p>
        <div style={{ flex: 1, height: 1, backgroundColor: accent, opacity: 0.25 }} />
      </div>
      {children}
    </div>
  );
}

export default function ElegantTemplate() {
  const { resumeData } = useResume();
  const { personalInfo: p, experience, education, skills, projects, certifications, settings } = resumeData;

  const accent  = settings.accentColor || '#be123c';  // rose as default
  const initials = (p.fullName || '')
    .split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: '36px 40px 0', backgroundColor: '#fff', lineHeight: 1.55, position: 'relative' }}>

      {/* ── WATERMARK INITIALS ───────────────────────────────────────────────── */}
      {initials && (
        <div style={{
          position: 'absolute', top: '50%', right: 30,
          transform: 'translateY(-50%)',
          fontSize: 180, fontWeight: 900, fontFamily: "'Merriweather', serif",
          color: accent, opacity: 0.025,
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none', zIndex: 0,
        }}>
          {initials}
        </div>
      )}

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 4, position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontSize: 34, fontWeight: 200, letterSpacing: 8,
          textTransform: 'uppercase', color: '#0f172a',
          fontFamily: "'Merriweather', serif",
          lineHeight: 1.1, marginBottom: 6,
        }}>
          {p.fullName || 'Your Name'}
        </h1>
        {p.jobTitle && (
          <p style={{ fontSize: 10, color: accent, fontWeight: 400, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 10 }}>
            {p.jobTitle}
          </p>
        )}

        {/* Ornamental divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 60, height: 0.75, backgroundColor: accent, opacity: 0.4 }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: accent, opacity: 0.6 }} />
          <div style={{ width: 60, height: 0.75, backgroundColor: accent, opacity: 0.4 }} />
        </div>

        {/* Contact line */}
        <p style={{ fontSize: 9, color: '#64748b', letterSpacing: 1 }}>
          {[p.email, p.phone, p.location, p.linkedin, p.portfolio, p.github].filter(Boolean).join('  ·  ')}
        </p>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {p.summary && (
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <p style={{ fontSize: 10, lineHeight: 1.6, color: '#475569', fontStyle: 'italic', maxWidth: 480, margin: '0 auto' }}>
              &ldquo;{p.summary}&rdquo;
            </p>
          </div>
        )}

        {experience.length > 0 && (
          <Section title="Experience" accent={accent}>
            {experience.map(exp => (
              <div key={exp.id} className="resume-entry" style={{ marginBottom: 10, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', fontFamily: "'Merriweather', serif" }}>{exp.position}</span>
                  <span style={{ fontSize: 8.5, color: '#94a3b8', fontStyle: 'italic', flexShrink: 0, marginLeft: 8 }}>
                    {dateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p style={{ fontSize: 9.5, color: accent, fontStyle: 'italic', marginTop: 0, marginBottom: 5 }}>
                  {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                </p>
                {exp.bullets.filter(b => b.trim()).length > 0 && (
                  <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => (
                      <li key={i} style={{ fontSize: 9.5, lineHeight: 1.4, color: '#374151', marginBottom: 1, paddingLeft: 14, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: accent, opacity: 0.6 }}>◆</span>
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
              <div key={edu.id} className="resume-entry" style={{ marginBottom: 7, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', fontFamily: "'Merriweather', serif" }}>{edu.school}</span>
                  <span style={{ fontSize: 8.5, color: '#94a3b8', fontStyle: 'italic', flexShrink: 0, marginLeft: 8 }}>
                    {dateRange(edu.startDate, edu.endDate, false)}
                  </span>
                </div>
                <p style={{ fontSize: 9.5, color: '#475569', fontStyle: 'italic' }}>
                  {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  {edu.gpa ? ` · GPA ${edu.gpa}` : ''}
                </p>
                {edu.achievements && <p style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>{edu.achievements}</p>}
              </div>
            ))}
          </Section>
        )}
        <CustomSections afterSection="education" />

        {skills.length > 0 && (
          <Section title="Skills &amp; Expertise" accent={accent}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {skills.flatMap(cat => cat.items).map((item, i) => (
                <span key={i} style={{
                  fontSize: 9, padding: '2px 10px',
                  border: `1px solid ${accent}50`,
                  borderRadius: 20, color: accent,
                  backgroundColor: `${accent}08`,
                }}>
                  {item}
                </span>
              ))}
            </div>
          </Section>
        )}
        <LanguagesSection />
        <CustomSections afterSection="skills" />

        {projects.length > 0 && (
          <Section title="Projects" accent={accent}>
            {projects.map(proj => (
              <div key={proj.id} className="resume-entry" style={{ marginBottom: 7, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', fontFamily: "'Merriweather', serif" }}>{proj.name}</span>
                  {proj.liveLink && <span style={{ fontSize: 8.5, color: accent, fontStyle: 'italic' }}>{proj.liveLink}</span>}
                </div>
                {proj.technologies && <p style={{ fontSize: 9, color: accent, fontStyle: 'italic', marginBottom: 2 }}>{proj.technologies}</p>}
                {proj.description  && <p style={{ fontSize: 9.5, lineHeight: 1.6, color: '#374151' }}>{proj.description}</p>}
              </div>
            ))}
          </Section>
        )}
        <CustomSections afterSection="projects" />

        {certifications.length > 0 && (
          <Section title="Certifications" accent={accent}>
            {certifications.map(cert => (
              <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: '#0f172a' }}>{cert.name}</span>
                  {cert.issuer && <span style={{ fontSize: 10, color: '#64748b', fontStyle: 'italic' }}> · {cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: 9, color: '#94a3b8', fontStyle: 'italic' }}>{fmtDate(cert.date)}</span>}
              </div>
            ))}
          </Section>
        )}
        <CustomSections afterSection="certifications" />
      </div>
    </div>
  );
}
