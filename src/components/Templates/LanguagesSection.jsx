import { useResume } from '../../context/ResumeContext';

const PROFICIENCY_FILLED = {
  Native:       5,
  Fluent:       4,
  Advanced:     3,
  Intermediate: 2,
  Basic:        1,
};

/**
 * Renders language entries with proficiency dots.
 * Reads directly from context — no props required for data.
 *
 * Style props (all optional):
 *   accentColor  — dot fill & heading color (defaults to settings.accentColor)
 *   fontFamily   — css font-family string
 *   titleStyle   — extra inline styles for the section title wrapper
 *   textStyle    — extra inline styles for language name text
 *   darkMode     — if true, use white/translucent colors for sidebar use
 *   showTitle    — if false, skip the section header (default true)
 */
export default function LanguagesSection({
  accentColor,
  fontFamily,
  titleStyle = {},
  textStyle = {},
  darkMode = false,
  showTitle = true,
}) {
  const { resumeData } = useResume();
  const languages   = resumeData?.languages || [];
  const accent      = accentColor || resumeData?.settings?.accentColor || '#2563eb';
  const font        = fontFamily  || "'DM Sans', sans-serif";

  if (!languages.length) return null;

  const titleColor  = darkMode ? 'rgba(255,255,255,0.6)' : '#64748b';
  const nameColor   = darkMode ? '#fff'                   : '#374151';
  const emptyBorder = darkMode ? 'rgba(255,255,255,0.25)' : '#cbd5e1';

  return (
    <div className="resume-section" style={{ marginBottom: 14 }}>

      {showTitle && (
        <div
          className="resume-section-header"
          style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
            ...titleStyle,
          }}
        >
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: 2.2,
            textTransform: 'uppercase', color: darkMode ? titleColor : accent,
            whiteSpace: 'nowrap', fontFamily: font,
          }}>
            Languages
          </span>
          <div style={{ flex: 1, height: 1.5, background: darkMode ? 'rgba(255,255,255,0.2)' : `${accent}30` }} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {languages.map(lang => {
          const filled = PROFICIENCY_FILLED[lang.proficiency] || 2;
          return (
            <div
              key={lang.id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ fontSize: 9.5, color: nameColor, fontFamily: font, ...textStyle }}>
                {lang.name}
              </span>
              <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 7, height: 7, borderRadius: '50%',
                      backgroundColor: i <= filled ? accent : 'transparent',
                      border: `1.5px solid ${i <= filled ? accent : emptyBorder}`,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
