import { useResume } from '../../context/ResumeContext';

/**
 * Renders custom sections placed at a specific position in the template.
 * Pass `afterSection` to render only sections the user positioned there.
 * Omit (or pass null) to render ALL sections — used as fallback.
 *
 * Supported afterSection values:
 *   'personalInfo' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications'
 */
export default function CustomSections({
  afterSection = 'certifications',
  wrapperStyle = {},
  titleStyle = {},
  textStyle = {},
}) {
  const { resumeData } = useResume();
  const sections    = resumeData?.customSections || [];
  const accentColor = resumeData?.settings?.accentColor || '#03153a';

  const visible = sections.filter(s => {
    // must have content
    const hasContent = s.type === 'bullets'
      ? s.items?.some(i => i?.trim())
      : s.content?.trim();
    if (!hasContent) return false;
    // filter by position
    return (s.afterSection || 'certifications') === afterSection;
  });

  if (!visible.length) return null;

  return visible.map(section => (
    <div key={section.id} className="resume-section" style={{ marginBottom: 15, ...wrapperStyle }}>

      {/* Section title */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
        ...titleStyle,
      }}>
        <span style={{
          fontSize: 9, fontWeight: 800, letterSpacing: 2.2,
          textTransform: 'uppercase', color: accentColor, whiteSpace: 'nowrap',
        }}>
          {section.title || 'Custom Section'}
        </span>
        <div style={{ flex: 1, height: 1.5, background: `${accentColor}30` }} />
      </div>

      {/* Content — paragraph preserves whitespace; bullets shown as list */}
      {section.type === 'bullets' ? (
        <ul style={{ margin: 0, paddingLeft: 16, ...textStyle }}>
          {(section.items || []).filter(i => i?.trim()).map((item, i) => (
            <li key={i} style={{ fontSize: 10, lineHeight: 1.6, color: '#374151', marginBottom: 2 }}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{
          fontSize: 10, lineHeight: 1.65, color: '#374151', margin: 0,
          whiteSpace: 'pre-wrap',
          ...textStyle,
        }}>
          {section.content}
        </p>
      )}
    </div>
  ));
}
