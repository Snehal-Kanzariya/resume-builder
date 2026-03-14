import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// ── Print page style injected by react-to-print ───────────────────────────────
// Overrides the global @media print visibility rules so the element renders
// correctly inside react-to-print's iframe.
export const PRINT_PAGE_STYLE = `
  @page {
    size: 210mm 297mm;
    margin: 0;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 210mm !important;
    height: 297mm !important;
  }
  body * {
    visibility: visible !important;
  }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
`;

// ── html2canvas + jsPDF fallback ──────────────────────────────────────────────
/**
 * Captures `element` (a 794×1123px DOM node) as a high-res canvas, then
 * embeds it into an A4 jsPDF document and triggers browser download.
 *
 * @param {HTMLElement} element  – the hidden full-res 794×1123 template div
 * @param {string}      filename – e.g. "alex-johnson-resume.pdf"
 */
export async function downloadPDF(element, filename = 'resume.pdf') {
  if (!element) throw new Error('downloadPDF: element is null');

  const canvas = await html2canvas(element, {
    scale: 2,                   // 2× resolution → sharper output
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: 794,
    height: 1123,
    scrollX: 0,
    scrollY: 0,
    logging: false,
    // Skip aria-hidden elements, but never skip the target or any of its ancestors
    // (the parent wrapper has aria-hidden="true" — excluding it would hide the target too)
    ignoreElements: el => el.getAttribute('aria-hidden') === 'true' && !el.contains(element),
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',   // 595.28 × 841.89 pt
    compress: true,
  });

  // A4 in points at 72 dpi
  pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89);
  pdf.save(filename);
}

// ── ID-based multi-page download (clone approach) ─────────────────────────────
/**
 * Clones the A4Container element identified by `elementId`, strips the
 * preview-fit scale transform so content renders at native 794 px, then
 * captures with html2canvas and splits into A4 pages.
 *
 * Using a clone means the live DOM is never mutated and the result always
 * matches what the user sees — fonts, colours, spacing — exactly.
 *
 * @param {string} elementId – id on A4Container's outermost wrapper
 * @param {string} fileName  – owner's full name (passed to buildFilename)
 */
export async function downloadResumePDF(elementId, fileName) {
  // Fonts first — prevents fallback fonts in the captured canvas.
  await document.fonts.ready;

  const element = document.getElementById(elementId);
  if (!element) throw new Error('Resume element not found');

  const html2canvasLib = (await import('html2canvas')).default;
  const { jsPDF }      = await import('jspdf');

  // 1. Clone to avoid mutating the live preview.
  const clone = element.cloneNode(true);

  // 2. Remove preview-only elements (page break indicators, etc.).
  clone.querySelectorAll('.no-print').forEach(el => el.remove());

  // 3. Reset the outer wrapper: 794 px wide, no transforms, auto height.
  clone.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 794px;
    height: auto;
    transform: none;
    overflow: visible;
    background: white;
  `;

  // 4. Strip the preview-fit scale from the inner .print-area div.
  //    That transform only exists to shrink/expand the template to fit the
  //    panel width — it must NOT appear in the PDF.
  const printArea = clone.querySelector('.print-area');
  if (printArea) {
    printArea.style.transform      = 'none';
    printArea.style.position       = 'relative';
    printArea.style.top            = 'auto';
    printArea.style.left           = 'auto';
    printArea.style.overflowX      = 'visible';
    printArea.style.boxShadow      = 'none';
  }

  // 5. Lift overflow:hidden on all descendants so multi-page content is captured.
  clone.querySelectorAll('*').forEach(el => {
    if (el.style.overflow === 'hidden' || el.style.overflowY === 'hidden') {
      el.style.overflow  = 'visible';
      el.style.overflowY = 'visible';
    }
  });

  document.body.appendChild(clone);

  // 6. Small delay lets the browser apply styles before capture.
  await new Promise(r => setTimeout(r, 100));

  const canvas = await html2canvasLib(clone, {
    scale:       2,             // 2× for sharp output
    useCORS:     true,
    allowTaint:  true,
    backgroundColor: '#ffffff',
    logging:     false,
    width:       794,
    height:      clone.scrollHeight,
    windowWidth: 794,
    scrollX:     0,
    scrollY:     0,
  });

  document.body.removeChild(clone);

  // 7. Build multi-page PDF.
  const imgData   = canvas.toDataURL('image/png');
  const pdf       = new jsPDF('p', 'mm', 'a4');
  const pdfWidth  = pdf.internal.pageSize.getWidth();   // 210 mm
  const pdfHeight = pdf.internal.pageSize.getHeight();  // 297 mm
  const imgWidth  = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position   = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(buildFilename(fileName));
}

// ── Helper: derive a filename from the resume owner's name ────────────────────
export function buildFilename(fullName) {
  const slug = (fullName || 'resume')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${slug}-resume.pdf`;
}
