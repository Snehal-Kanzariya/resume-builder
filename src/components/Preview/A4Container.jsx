import { forwardRef, useEffect, useRef, useState } from 'react';

// A4 at 96 dpi
export const A4_W = 794;
export const A4_H = 1123;

/**
 * Scales an A4-sized inner div to fill its parent container width.
 * The outer div's height adjusts to maintain the A4 aspect ratio.
 * Pass a ref to get a handle on the inner div for react-to-print / html2canvas.
 */
const A4Container = forwardRef(function A4Container({ children, className = '' }, printRef) {
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
    <div
      ref={wrapRef}
      className={`w-full relative ${className}`}
      style={{ height: `${A4_H * scale}px` }}
    >
      <div
        ref={printRef}
        className="print-area absolute top-0 left-0 bg-white"
        style={{
          width: `${A4_W}px`,
          height: `${A4_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          overflow: 'hidden',
          boxShadow: '0 2px 20px rgba(0,0,0,0.14)',
        }}
      >
        {children}
      </div>
    </div>
  );
});

export default A4Container;
