import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

// A4 at 96 dpi
export const A4_W = 794;
export const A4_H = 1123;

/**
 * Scales an A4-sized page to fill its parent container width.
 * Supports multi-page resumes: the inner box grows past 1123px when content
 * overflows, and the outer wrapper height is updated to match.
 *
 * Props:
 *   contentScale     – multiply all template content (font-size effect). Default 1.0.
 *   className        – extra classes on the outer wrapper.
 *   onContentHeight  – callback(pixels) fired whenever the inner content height changes.
 *   ref (forwarded)  – points at the 794px-wide inner div (for react-to-print).
 */
const A4Container = forwardRef(function A4Container(
  { children, contentScale = 1.0, className = '', onContentHeight },
  printRef,
) {
  const wrapRef  = useRef(null);
  const innerRef = useRef(null);

  const [scale,         setScale]         = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  // Merge forwarded print ref with internal measurement ref.
  const setInnerRefs = useCallback((el) => {
    innerRef.current = el;
    if (!printRef) return;
    if (typeof printRef === 'function') printRef(el);
    else printRef.current = el;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scale = container width / A4_W
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const calc = () => setScale(el.offsetWidth / A4_W);
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Track inner box height so the outer wrapper reserves correct space.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => {
      const h = el.scrollHeight;
      setContentHeight(prev => (prev === h ? prev : h));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Notify parent of content height changes.
  // onContentHeight intentionally omitted from deps — callers pass stable setters.
  useEffect(() => {
    if (onContentHeight) onContentHeight(contentHeight);
  }, [contentHeight]); // eslint-disable-line react-hooks/exhaustive-deps

  // Page break indicator positions (only for pages that actually have content).
  const pageBreakPositions = [];
  for (let n = 1; n <= 5; n++) {
    if (contentHeight > n * A4_H) pageBreakPositions.push(n * A4_H);
    else break;
  }

  return (
    /* Outer: reserves exactly (contentHeight × scale) px of layout space */
    <div
      ref={wrapRef}
      className={`w-full relative ${className}`}
      style={{ height: `${contentHeight * scale}px` }}
    >
      {/* A4 box — 794px wide, grows with content. */}
      <div
        ref={setInnerRefs}
        className="print-area absolute top-0 left-0 bg-white"
        style={{
          width: `${A4_W}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          overflowX: 'hidden',
          boxShadow: '0 2px 24px rgba(0,0,0,0.13)',
        }}
      >
        {/* Content scaler — applies font-size multiplier. */}
        <div
          style={{
            width: `${100 / contentScale}%`,
            transform: `scale(${contentScale})`,
            transformOrigin: 'top left',
            overflowX: 'hidden',
          }}
        >
          {children}
        </div>

        {/* ── Page break indicators (preview-only, hidden in PDF via no-print) ── */}
        {pageBreakPositions.map(pos => (
          <div
            key={pos}
            className="no-print"
            style={{
              position: 'absolute',
              top: `${pos}px`,
              left: 0,
              width: '100%',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {/* Dashed rule */}
            <div style={{ position: 'relative', height: 0 }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                borderTop: '2px dashed #cbd5e1',
              }} />
              {/* Page label pill */}
              <div style={{
                position: 'absolute',
                top: '-9px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#94a3b8',
                fontSize: '9px',
                fontWeight: '700',
                letterSpacing: '0.8px',
                padding: '1px 10px',
                borderRadius: '20px',
                whiteSpace: 'nowrap',
              }}>
                — Page {pos / A4_H + 1} —
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default A4Container;
