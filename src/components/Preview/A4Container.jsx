import { forwardRef, useEffect, useRef, useState } from 'react';

// A4 at 96 dpi
export const A4_W = 794;
export const A4_H = 1123;

/**
 * Scales an A4-sized page to fill its parent container width.
 *
 * Props:
 *   contentScale  – multiply all template content (font-size effect). Default 1.0.
 *   className     – extra classes on the outer wrapper.
 *   ref (forwarded) – points at the raw 794×1123 div for react-to-print / html2canvas.
 */
const A4Container = forwardRef(function A4Container(
  { children, contentScale = 1.0, className = '' },
  printRef,
) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const calc = () => setScale(el.offsetWidth / A4_W);
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    /* Outer: receives container width, sets height to maintain A4 ratio */
    <div
      ref={wrapRef}
      className={`w-full relative ${className}`}
      style={{ height: `${A4_H * scale}px` }}
    >
      {/* A4 page box — fixed 794×1123, scaled to fit container */}
      <div
        ref={printRef}
        className="print-area absolute top-0 left-0 bg-white"
        style={{
          width: `${A4_W}px`,
          height: `${A4_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          overflow: 'hidden',
          boxShadow: '0 2px 24px rgba(0,0,0,0.13)',
        }}
      >
        {/* Content scaler — applies font-size multiplier without affecting A4 box */}
        <div
          style={{
            width: `${100 / contentScale}%`,
            height: `${100 / contentScale}%`,
            transform: `scale(${contentScale})`,
            transformOrigin: 'top left',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

export default A4Container;
