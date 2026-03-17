import { useResume } from '../../context/ResumeContext';
import { fmtDate, dateRange } from '../../utils/dateFormat';
import CustomSections from './CustomSections';

// ── Original: adapts to uploaded resume's detected style ─────────────────────

export default function OriginalTemplate() {
  const { resumeData, uploadedResumeStyle } = useResume();
  const { personalInfo: p, experience, education, skills, projects, certifications, settings } = resumeData;

  const {
    fontFamily   = 'sans-serif',
    layout       = 'single-column',
    headerStyle  = 'simple',
    colorScheme  = 'minimal',
  } = uploadedResumeStyle || {};

  // ── Typography ────────────────────────────────────────────────────────────
  const font = fontFamily === 'serif'
    ? "'Merriweather', Georgia, serif"
    : fontFamily === 'monospace'
      ? "'Courier New', 'Lucida Console', monospace"
      : "'DM Sans', sans-serif";

  // ── Colors ────────────────────────────────────────────────────────────────
  const rawAccent = settings?.accentColor || '#2563eb';
  const accent = colorScheme === 'minimal' ? '#1e293b' : rawAccent;

  const sidebarBg   = colorScheme === 'dark' || colorScheme === 'colorful' ? accent : '#f1f5f9';
  const sidebarText = colorScheme === 'dark' || colorScheme === 'colorful' ? '#fff'  : '#1e293b';
  const sidebarMuted= colorScheme === 'dark' || colorScheme === 'colorful' ? 'rgba(255,255,255,0.65)' : '#64748b';
  const headingColor= accent;

  // ── Section title component ───────────────────────────────────────────────
  function SectionTitle({ title }) {
    if (colorScheme === 'minimal') {
      return (
        <div className="resume-section-header" style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: '#64748b', marginBottom: 4, fontFamily: font }}>
            {title}
          </p>
          <div style={{ borderBottom: '1px solid #e2e8f0' }} />
        </div>
      );
    }
    return (
      <div className="resume-section-header" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: headingColor, whiteSpace: 'nowrap', fontFamily: font }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1.5, background: `${headingColor}30` }} />
      </div>
    );
  }

  // ── Sidebar section title ─────────────────────────────────────────────────
  function SideTitle({ title }) {
    return (
      <p style={{
        fontSize: 8, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase',
        color: sidebarMuted, marginBottom: 8, fontFamily: font,
        borderBottom: `1px solid ${colorScheme === 'dark' || colorScheme === 'colorful' ? 'rgba(255,255,255,0.2)' : '#cbd5e1'}`,
        paddingBottom: 4,
      }}>
        {title}
      </p>
    );
  }

  // ── Header ────────────────────────────────────────────────────────────────
  const contactLine = [p.email, p.phone, p.location].filter(Boolean).join('  ·  ');
  const urlLine     = [p.linkedin, p.portfolio, p.github].filter(Boolean).join('  ·  ');

  function Header() {
    if (headerStyle === 'dark-header') {
      return (
        <div style={{ backgroundColor: accent, color: '#fff', padding: '28px 36px 22px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: 1, lineHeight: 1.1, marginBottom: 4, fontFamily: font }}>
            {p.fullName || 'Your Name'}
          </h1>
          {p.jobTitle && (
            <p style={{ fontSize: 12, fontWeight: 400, opacity: 0.85, marginBottom: 10, fontFamily: font }}>{p.jobTitle}</p>
          )}
          <p style={{ fontSize: 9, opacity: 0.75, fontFamily: font }}>{contactLine}</p>
          {urlLine && <p style={{ fontSize: 9, opacity: 0.65, marginTop: 2, fontFamily: font }}>{urlLine}</p>}
        </div>
      );
    }

    if (headerStyle === 'centered') {
      return (
        <div style={{ textAlign: 'center', padding: '32px 36px 20px', borderBottom: `2px solid ${accent}` }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2, color: '#0f172a', marginBottom: 4, fontFamily: font }}>
            {p.fullName || 'Your Name'}
          </h1>
          {p.jobTitle && (
            <p style={{ fontSize: 11, color: accent, fontWeight: 500, marginBottom: 8, fontFamily: font }}>{p.jobTitle}</p>
          )}
          {contactLine && <p style={{ fontSize: 9, color: '#64748b', fontFamily: font }}>{contactLine}</p>}
          {urlLine     && <p style={{ fontSize: 9, color: accent, marginTop: 2, fontFamily: font }}>{urlLine}</p>}
        </div>
      );
    }

    if (headerStyle === 'bold-header') {
      return (
        <div style={{ padding: '28px 36px 20px', borderBottom: `5px solid ${accent}` }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', letterSpacing: -1, textTransform: 'uppercase', lineHeight: 1, marginBottom: 6, fontFamily: font }}>
            {p.fullName || 'Your Name'}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            {p.jobTitle && (
              <p style={{ fontSize: 12, fontWeight: 700, color: accent, letterSpacing: 0.5, fontFamily: font }}>{p.jobTitle}</p>
            )}
            <div style={{ textAlign: 'right' }}>
              {contactLine && <p style={{ fontSize: 9, color: '#374151', fontFamily: font }}>{contactLine}</p>}
              {urlLine     && <p style={{ fontSize: 9, color: accent, marginTop: 2, fontFamily: font }}>{urlLine}</p>}
            </div>
          </div>
        </div>
      );
    }

    // simple (default): left-aligned, thin underline
    return (
      <div style={{ padding: '28px 36px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', letterSpacing: 0, lineHeight: 1.15, marginBottom: 3, fontFamily: font }}>
              {p.fullName || 'Your Name'}
            </h1>
            {p.jobTitle && (
              <p style={{ fontSize: 11, color: accent, fontWeight: 500, fontFamily: font }}>{p.jobTitle}</p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            {contactLine && <p style={{ fontSize: 9, color: '#64748b', fontFamily: font }}>{contactLine}</p>}
            {urlLine     && <p style={{ fontSize: 9, color: accent, marginTop: 2, fontFamily: font }}>{urlLine}</p>}
          </div>
        </div>
        <div style={{ borderBottom: `1.5px solid ${accent}`, marginTop: 12 }} />
      </div>
    );
  }

  // ── Shared section renderers ──────────────────────────────────────────────
  function ExperienceSection() {
    if (!experience.length) return null;
    return (
      <div style={{ marginBottom: 16 }}>
        <SectionTitle title="Experience" />
        {experience.map(exp => (
          <div key={exp.id} className="resume-entry" style={{ marginBottom: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: font }}>{exp.position}</span>
              <span style={{ fontSize: 8.5, color: '#94a3b8', flexShrink: 0, marginLeft: 8, fontFamily: font }}>
                {dateRange(exp.startDate, exp.endDate, exp.current)}
              </span>
            </div>
            <p style={{ fontSize: 9.5, color: accent, fontWeight: 600, marginTop: 0, marginBottom: 4, fontFamily: font }}>
              {exp.company}{exp.location ? `  ·  ${exp.location}` : ''}
            </p>
            {exp.bullets.filter(b => b.trim()).length > 0 && (
              <ul style={{ paddingLeft: 14, margin: 0, listStyle: 'disc' }}>
                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                  <li key={i} style={{ fontSize: 9.5, lineHeight: 1.6, color: '#374151', marginBottom: 1.5, fontFamily: font }}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  function EducationSection() {
    if (!education.length) return null;
    return (
      <div style={{ marginBottom: 16 }}>
        <SectionTitle title="Education" />
        {education.map(edu => (
          <div key={edu.id} className="resume-entry" style={{ marginBottom: 9 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: font }}>{edu.school}</span>
              <span style={{ fontSize: 8.5, color: '#94a3b8', flexShrink: 0, marginLeft: 8, fontFamily: font }}>
                {dateRange(edu.startDate, edu.endDate, false)}
              </span>
            </div>
            <p style={{ fontSize: 9.5, color: '#475569', fontFamily: font }}>
              {[edu.degree, edu.field].filter(Boolean).join(' in ')}
              {edu.gpa ? `  ·  GPA ${edu.gpa}` : ''}
            </p>
            {edu.achievements && <p style={{ fontSize: 9, color: '#64748b', marginTop: 2, fontFamily: font }}>{edu.achievements}</p>}
          </div>
        ))}
      </div>
    );
  }

  function ProjectsSection() {
    if (!projects.length) return null;
    return (
      <div style={{ marginBottom: 16 }}>
        <SectionTitle title="Projects" />
        {projects.map(proj => (
          <div key={proj.id} className="resume-entry" style={{ marginBottom: 9 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: font }}>{proj.name}</span>
              {proj.liveLink && <span style={{ fontSize: 8.5, color: accent, fontFamily: font }}>{proj.liveLink}</span>}
            </div>
            {proj.technologies && <p style={{ fontSize: 9, color: accent, fontWeight: 600, marginBottom: 2, fontFamily: font }}>{proj.technologies}</p>}
            {proj.description  && <p style={{ fontSize: 9.5, lineHeight: 1.6, color: '#374151', fontFamily: font }}>{proj.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  function SkillsSection({ inline = false }) {
    if (!skills.length) return null;
    if (inline) {
      // Compact inline variant for single-column
      return (
        <div style={{ marginBottom: 16 }}>
          <SectionTitle title="Skills" />
          {skills.map(cat => (
            <div key={cat.id} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              {cat.category && (
                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#374151', minWidth: 130, flexShrink: 0, fontFamily: font }}>{cat.category}:</span>
              )}
              <span style={{ fontSize: 9.5, color: '#475569', fontFamily: font }}>{cat.items.join('  ·  ')}</span>
            </div>
          ))}
        </div>
      );
    }
    // Sidebar / block variant
    return (
      <div style={{ marginBottom: 14 }}>
        <SideTitle title="Skills" />
        {skills.map(cat => (
          <div key={cat.id} style={{ marginBottom: 9 }}>
            {cat.category && (
              <p style={{ fontSize: 7.5, fontWeight: 700, color: sidebarMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, fontFamily: font }}>
                {cat.category}
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {cat.items.map((item, i) => (
                <span key={i} style={{
                  fontSize: 8.5, padding: '2px 7px',
                  backgroundColor: colorScheme === 'dark' || colorScheme === 'colorful'
                    ? 'rgba(255,255,255,0.15)' : `${rawAccent}18`,
                  color: sidebarText,
                  borderRadius: 3,
                  fontFamily: font,
                }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function CertificationsSection({ inline = false }) {
    if (!certifications.length) return null;
    if (inline) {
      return (
        <div style={{ marginBottom: 16 }}>
          <SectionTitle title="Certifications" />
          {certifications.map(cert => (
            <div key={cert.id} className="resume-entry" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#0f172a', fontFamily: font }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontSize: 9.5, color: '#64748b', fontFamily: font }}> · {cert.issuer}</span>}
              </div>
              {cert.date && <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: font }}>{fmtDate(cert.date)}</span>}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div style={{ marginBottom: 14 }}>
        <SideTitle title="Certifications" />
        {certifications.map(cert => (
          <div key={cert.id} style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 9.5, fontWeight: 600, color: sidebarText, fontFamily: font }}>{cert.name}</p>
            {cert.issuer && <p style={{ fontSize: 8.5, color: sidebarMuted, fontFamily: font }}>{cert.issuer}</p>}
            {cert.date   && <p style={{ fontSize: 8, color: sidebarMuted, fontFamily: font }}>{fmtDate(cert.date)}</p>}
          </div>
        ))}
      </div>
    );
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  function SummarySection() {
    if (!p.summary) return null;
    return (
      <div style={{ marginBottom: 16 }}>
        <SectionTitle title="Summary" />
        <p style={{ fontSize: 10, lineHeight: 1.75, color: '#374151', fontFamily: font }}>{p.summary}</p>
      </div>
    );
  }

  // ── TWO-COLUMN LAYOUT ─────────────────────────────────────────────────────
  if (layout === 'two-column') {
    return (
      <div style={{ fontFamily: font, display: 'flex', flexDirection: 'column', lineHeight: 1.5 }}>
        <Header />
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Sidebar */}
          <div style={{
            width: '30%', backgroundColor: sidebarBg, color: sidebarText,
            padding: '18px 14px', flexShrink: 0,
            borderRight: colorScheme === 'minimal' ? '1px solid #e2e8f0' : 'none',
          }}>
            <SkillsSection inline={false} />
            <CertificationsSection inline={false} />
          </div>
          {/* Main */}
          <div style={{ flex: 1, padding: '18px 22px' }}>
            <SummarySection />
            <ExperienceSection />
            <CustomSections afterSection="experience" />
            <EducationSection />
            <CustomSections afterSection="education" />
            <ProjectsSection />
            <CustomSections afterSection="projects" />
            <CustomSections afterSection="certifications" />
          </div>
        </div>
      </div>
    );
  }

  // ── SINGLE-COLUMN LAYOUT ──────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: font, lineHeight: 1.5 }}>
      <Header />
      <div style={{ padding: '20px 36px 0' }}>
        <SummarySection />
        <ExperienceSection />
        <CustomSections afterSection="experience" />
        <EducationSection />
        <CustomSections afterSection="education" />
        <SkillsSection inline={true} />
        <CustomSections afterSection="skills" />
        <ProjectsSection />
        <CustomSections afterSection="projects" />
        <CertificationsSection inline={true} />
        <CustomSections afterSection="certifications" />
      </div>
    </div>
  );
}
