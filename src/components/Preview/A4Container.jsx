import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

// A4 at 96 dpi
export const A4_W = 794;
export const A4_H = 1123;

// If content overflows page 1 by less than this fraction, try compact mode
const COMPACT_THRESHOLD = A4_H * 1.11; // ~1247px

/**
 * Scales an A4-sized page to fill its parent container width.
 * Supports multi-page resumes: the inner box grows past 1123px when content
 * overflows. A thin dashed line is overlaid at each A4 boundary — it is
 * zero-height so it never covers content.
 *
 * Smart auto-compress: when content barely overflows 1 page (< ~11%), a
 * "compact-mode" CSS class is added that subtly shrinks fonts, line-heights,
 * and margins to push the content back onto 1 page.
 *
 * Props:
 *   contentScale      – multiply all template content (font-size effect). Default 1.0.
 *   onPageCountChange – optional callback(n) fired whenever page count changes.
 *   className         – extra classes on the outer wrapper.
 *   ref (forwarded)   – points at the 794px-wide inner div (for react-to-print).
 */
const A4Container = forwardRef(function A4Container(
  { children, contentScale = 1.0, onPageCountChange, className = '' },
  printRef,
) {
  const wrapRef  = useRef(null);
  const innerRef = useRef(null);

  const [scale,         setScale]         = useState(1);
  const [contentHeight, setContentHeight] = useState(0);
  const [pageCount,     setPageCount]     = useState(1);
  const [compactMode,   setCompactMode]   = useState(false);

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

  // Track content height, detect near-overflow, compute page count.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => {
      const h = el.scrollHeight;
      setContentHeight(prev => (prev === h ? prev : h));

      // Smart compact detection: content barely overflows 1 page
      const needsCompact = h > A4_H && h <= COMPACT_THRESHOLD;
      setCompactMode(prev => (prev === needsCompact ? prev : needsCompact));

      const pages = Math.max(1, Math.ceil(h / A4_H));
      setPageCount(prev => {
        if (prev === pages) return prev;
        onPageCountChange?.(pages);
        return pages;
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onPageCountChange]);

  // Re-measure after compact mode toggles (may push content back to 1 page)
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    // Allow a frame for CSS to apply
    const id = requestAnimationFrame(() => {
      const h = el.scrollHeight;
      setContentHeight(prev => (prev === h ? prev : h));
      const pages = Math.max(1, Math.ceil(h / A4_H));
      setPageCount(prev => {
        if (prev === pages) return prev;
        onPageCountChange?.(pages);
        return pages;
      });
    });
    return () => cancelAnimationFrame(id);
  }, [compactMode, onPageCountChange]);

  // Outer height = visual content height only.
  // Dashed-line indicators are zero-height and do not add space.
  const outerHeight = contentHeight * scale;

  return (
    /* Outer: reserves exactly the right vertical space for the scaled content */
    <div
      ref={wrapRef}
      className={`w-full relative ${className}`}
      style={{ height: `${outerHeight}px` }}
    >
      {/* Compact-mode CSS — injected once, scoped via .compact-mode class */}
      <style>{`
        .compact-mode .resume-section { margin-bottom: 10px !important; }
        .compact-mode .resume-section-header { margin-bottom: 5px !important; }
        .compact-mode .resume-entry { margin-bottom: 8px !important; }
        .compact-mode ul { margin-top: 1px !important; }
        .compact-mode li { line-height: 1.35 !important; margin-bottom: 1px !important; }
        .compact-mode p { line-height: 1.4 !important; }
      `}</style>

      {/* A4 box — 794px wide, all pages as one continuous div, no transforms on height */}
      <div
        ref={setInnerRefs}
        className={`print-area absolute top-0 left-0 bg-white ${compactMode ? 'compact-mode' : ''}`}
        style={{
          width: `${A4_W}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          overflowX: 'hidden',
          boxShadow: '0 2px 24px rgba(0,0,0,0.13)',
        }}
      >
        {/* Content scaler — applies font-size multiplier.
            Width is widened by 1/contentScale then visually scaled back. */}
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

      {/* ── Page-break indicators ───────────────────────────────────────────────
          Thin dashed blue line at each A4 boundary. Zero height — does NOT
          cover or obscure any content. Hidden in PDF/print via .no-print.   ── */}
      {pageCount > 1 && Array.from({ length: pageCount - 1 }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="no-print absolute left-0 pointer-events-none"
          style={{
            top:    `${(i + 1) * A4_H * scale}px`,
            width:  `${A4_W * scale}px`,
            height: 0,
            borderTop: '2px dashed #3b82f6',
            zIndex: 10,
          }}
        >
          {/* "Page N" badge — floats above the line on the right */}
          <span style={{
            position:   'absolute',
            right:      0,
            top:        '-16px',
            fontSize:   9,
            fontWeight: 600,
            color:      '#3b82f6',
            background: '#1e293b',
            padding:    '2px 10px',
            borderRadius: 4,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: 0.5,
            whiteSpace: 'nowrap',
          }}>
            Page {i + 2}
          </span>
        </div>
      ))}
    </div>
  );
});

export default A4Container;
