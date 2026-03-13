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
 *   contentScale  – multiply all template content (font-size effect). Default 1.0.
 *   className     – extra classes on the outer wrapper.
 *   ref (forwarded) – points at the 794px-wide inner div (for react-to-print).
 */
const A4Container = forwardRef(function A4Container(
  { children, contentScale = 1.0, className = '' },
  printRef,
) {
  const wrapRef  = useRef(null);
  const innerRef = useRef(null);

  const [scale,         setScale]         = useState(1);
  const [contentHeight, setContentHeight] = useState(A4_H);

  // Merge forwarded print ref with internal measurement ref.
  // printRef is a stable useRef object so the empty dep array is safe.
  const setInnerRefs = useCallback((el) => {
    innerRef.current = el;
    if (!printRef) return;
    if (typeof printRef === 'function') printRef(el);
    else printRef.current = el;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scale = container width / A4_W (unchanged)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const calc = () => setScale(el.offsetWidth / A4_W);
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Track the inner box's actual rendered height so the outer wrapper always
  // reserves the correct amount of space for the scaled content.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => {
      const h = Math.max(el.scrollHeight, A4_H);
      setContentHeight(prev => (prev === h ? prev : h));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    /* Outer: reserves exactly (contentHeight × scale) px of layout space */
    <div
      ref={wrapRef}
      className={`w-full relative ${className}`}
      style={{ height: `${contentHeight * scale}px` }}
    >
      {/* A4 box — 794px wide, min-height 1 page, grows with content.
          overflow-x:hidden prevents the font-scale trick from bleeding
          horizontally; vertical overflow is intentionally unrestricted. */}
      <div
        ref={setInnerRefs}
        className="print-area absolute top-0 left-0 bg-white"
        style={{
          width: `${A4_W}px`,
          minHeight: `${A4_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          overflowX: 'hidden',
          boxShadow: '0 2px 24px rgba(0,0,0,0.13)',
        }}
      >
        {/* Content scaler — applies font-size multiplier.
            Width is widened by 1/contentScale then visually scaled back,
            making everything appear at contentScale × normal size.
            Horizontal clip prevents the wider layout box from bleeding out. */}
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
      </div>
    </div>
  );
});

export default A4Container;
