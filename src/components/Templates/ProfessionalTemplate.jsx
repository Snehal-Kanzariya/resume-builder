import { useResume } from '../../context/ResumeContext';
import { fmtDate, dateRange } from '../../utils/dateFormat';
import CustomSections from './CustomSections';
import LanguagesSection from './LanguagesSection';

// ── ATS-Friendly: pure text, no graphics, no color blocks ────────────────────

function SectionHeader({ title }) {
  return (
    <div className="resume-section-header" style={{ marginBottom: 4 }}>
      <h2 style={{
        fontSize: 11, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: 1.5,
        color: '#0f172a', marginBottom: 4,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {title}
      </h2>
      <div style={{ borderBottom: '1.5px solid #0f172a' }} />
    </div>
  );
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function ProfessionalTemplate() {
  const { resumeData } = useResume();
  const {
    personalInfo: p, experience, education,
    skills, projects, certifications,
  } = resumeData;

  const contactLine = [p.email, p.phone, p.location, p.linkedin, p.portfolio, p.github]
    .filter(Boolean)
    .join('  |  ');

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 10.5, color: '#0f172a',
      padding: '32px 40px 0', lineHeight: 1.5,
    }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <h1 style={{
          fontSize: 20, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase',
          color: '#0f172a', marginBottom: 3,
        }}>
          {p.fullName || 'Your Name'}
        </h1>
        {p.jobTitle && (
          <p style={{ fontSize: 10.5, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
            {p.jobTitle}
          </p>
        )}
        {contactLine && (
          <p style={{ fontSize: 9.5, color: '#374151' }}>{contactLine}</p>
        )}
      </div>

      {/* ── SUMMARY ────────────────────────────────────────────────────────── */}
      {p.summary && (
        <div className="resume-section" style={{ marginBottom: 10, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <SectionHeader title="Professional Summary" />
          <p style={{ fontSize: 10, lineHeight: 1.5, color: '#1e293b', marginTop: 4 }}>
            {p.summary}
          </p>
        </div>
      )}

      {/* ── EXPERIENCE ─────────────────────────────────────────────────────── */}
      {experience.length > 0 && (
        <div className="resume-section" style={{ marginBottom: 10 }}>
          <SectionHeader title="Professional Experience" />
          {experience.map(exp => (
            <div key={exp.id} className="resume-entry" style={{ marginTop: 7, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>{exp.company}</span>
                <span style={{ fontSize: 10, color: '#374151' }}>
                  {dateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10.5, fontStyle: 'italic', color: '#374151' }}>
                  {exp.position}
                </span>
                {exp.location && (
                  <span style={{ fontSize: 10, color: '#374151' }}>{exp.location}</span>
                )}
              </div>
              {exp.bullets.filter(b => b.trim()).length > 0 && (
                <ul style={{ paddingLeft: 18, marginTop: 4, marginBottom: 0, listStyle: 'disc' }}>
                  {exp.bullets.filter(b => b.trim()).map((b, i) => (
                    <li key={i} style={{ fontSize: 10, lineHeight: 1.4, color: '#1e293b', marginBottom: 1 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      <CustomSections afterSection="experience" />

      {/* ── EDUCATION ──────────────────────────────────────────────────────── */}
      {education.length > 0 && (
        <div className="resume-section" style={{ marginBottom: 10 }}>
          <SectionHeader title="Education" />
          {education.map(edu => (
            <div key={edu.id} className="resume-entry" style={{ marginTop: 6, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>{edu.school}</span>
                <span style={{ fontSize: 10, color: '#374151' }}>
                  {dateRange(edu.startDate, edu.endDate, false)}
                </span>
              </div>
              <p style={{ fontSize: 10.5, color: '#1e293b' }}>
                {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                {edu.gpa ? `  —  GPA: ${edu.gpa}` : ''}
              </p>
              {edu.achievements && (
                <p style={{ fontSize: 9.5, color: '#374151', marginTop: 2 }}>{edu.achievements}</p>
              )}
            </div>
          ))}
        </div>
      )}
      <CustomSections afterSection="education" />

      {/* ── SKILLS ─────────────────────────────────────────────────────────── */}
      {skills.length > 0 && (
        <div className="resume-section" style={{ marginBottom: 10, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <SectionHeader title="Skills" />
          <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {skills.map(cat => (
              <div key={cat.id} style={{ display: 'flex', gap: 8 }}>
                {cat.category && (
                  <span style={{ fontSize: 10.5, fontWeight: 700, minWidth: 140, flexShrink: 0 }}>
                    {cat.category}:
                  </span>
                )}
                <span style={{ fontSize: 10.5, color: '#1e293b' }}>
                  {cat.items.join(' · ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <LanguagesSection />
      <CustomSections afterSection="skills" />

      {/* ── PROJECTS ───────────────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <div className="resume-section" style={{ marginBottom: 10 }}>
          <SectionHeader title="Projects" />
          {projects.map(proj => (
            <div key={proj.id} className="resume-entry" style={{ marginTop: 6, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>{proj.name}</span>
                {proj.liveLink && (
                  <span style={{ fontSize: 9.5, color: '#374151' }}>{proj.liveLink}</span>
                )}
              </div>
              {proj.technologies && (
                <p style={{ fontSize: 10, fontStyle: 'italic', color: '#374151', marginBottom: 2 }}>
                  {proj.technologies}
                </p>
              )}
              {proj.description && (
                <p style={{ fontSize: 10, lineHeight: 1.65, color: '#1e293b' }}>{proj.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
      <CustomSections afterSection="projects" />

      {/* ── CERTIFICATIONS ─────────────────────────────────────────────────── */}
      {certifications.length > 0 && (
        <div className="resume-section" style={{ marginBottom: 10 }}>
          <SectionHeader title="Certifications" />
          {certifications.map(cert => (
            <div key={cert.id} style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700 }}>{cert.name}</span>
                {cert.issuer && (
                  <span style={{ fontSize: 10, color: '#374151' }}> — {cert.issuer}</span>
                )}
              </div>
              {cert.date && (
                <span style={{ fontSize: 10, color: '#374151' }}>{fmtDate(cert.date)}</span>
              )}
            </div>
          ))}
        </div>
      )}
      <CustomSections afterSection="certifications" />
    </div>
  );
}
