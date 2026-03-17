import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

// A4 at 96 dpi
export const A4_W = 794;
export const A4_H = 1123;

// Height of each page-break separator bar, in *screen* pixels (constant at any zoom level)
const SEP_H = 40;

/**
 * Scales an A4-sized page to fill its parent container width.
 * Supports multi-page resumes: the inner box grows past 1123px when content
 * overflows, and dark page-break separator bars are overlaid at each A4 boundary.
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

  // Track content height and compute page count.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => {
      const h = el.scrollHeight;
      setContentHeight(prev => (prev === h ? prev : h));
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

  // Outer height = visual content height + room for separator bars so they
  // never overflow the wrapper (separators overlay the content at boundaries).
  const outerHeight = contentHeight * scale + (pageCount - 1) * SEP_H;

  return (
    /* Outer: reserves exactly the right vertical space for the scaled content + separators */
    <div
      ref={wrapRef}
      className={`w-full relative ${className}`}
      style={{ height: `${outerHeight}px` }}
    >
      {/* A4 box — 794px wide, all pages as one continuous div, no transforms on height */}
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

      {/* ── Page-break separator bars ──────────────────────────────────────────
          Screen-preview only — overlaid at each A4 boundary.
          Hidden in PDF output via .no-print class.                          ── */}
      {pageCount > 1 && Array.from({ length: pageCount - 1 }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="no-print absolute left-0 pointer-events-none"
          style={{
            top:    `${(i + 1) * A4_H * scale}px`,
            width:  `${A4_W * scale}px`,
            height: `${SEP_H}px`,
            background: '#0f172a',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 16px',
            boxSizing: 'border-box',
          }}
        >
          {/* Left rule + page-end label */}
          <span style={{
            fontSize: 9,
            color: '#334155',
            whiteSpace: 'nowrap',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: 0.5,
          }}>
            page {i + 1} ends
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(51,65,85,0.7)' }} />
          {/* Center divider dot */}
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: 'rgba(51,65,85,0.7)' }} />
          {/* Right page-begin label */}
          <span style={{
            fontSize: 9,
            color: '#3b82f6',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: 0.5,
          }}>
            page {i + 2} begins
          </span>
        </div>
      ))}
    </div>
  );
});

export default A4Container;
