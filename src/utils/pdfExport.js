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

// ── Shared: capture a full-height element as canvas ───────────────────────────
async function captureElement(element, html2canvasLib) {
  const originalStyle = element.style.cssText;
  element.style.maxHeight = 'none';
  element.style.overflow  = 'visible';
  element.style.height    = 'auto';

  const overflowFixes = [];
  element.querySelectorAll('*').forEach(el => {
    const s = el.style;
    if (s.overflow === 'hidden' || s.overflowY === 'hidden' || s.overflowX === 'hidden') {
      overflowFixes.push({ el, overflow: s.overflow, overflowX: s.overflowX, overflowY: s.overflowY });
      s.overflow  = 'visible';
      s.overflowX = 'visible';
      s.overflowY = 'visible';
    }
  });

  const canvas = await html2canvasLib(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowHeight: element.scrollHeight,
    height: element.scrollHeight,
    scrollY: 0,
    scrollX: 0,
  });

  element.style.cssText = originalStyle;
  overflowFixes.forEach(({ el, overflow, overflowX, overflowY }) => {
    el.style.overflow  = overflow;
    el.style.overflowX = overflowX;
    el.style.overflowY = overflowY;
  });

  return canvas;
}

// ── Shared: add a canvas as multi-page content in an existing jsPDF ───────────
function addCanvasToPDF(pdf, canvas, pdfWidth, pdfHeight, isFirstPage = true) {
  const imgData   = canvas.toDataURL('image/png');
  const imgWidth  = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position   = 0;

  if (!isFirstPage) pdf.addPage();
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }
}

// ── ID-based multi-page download ──────────────────────────────────────────────
/**
 * Captures the full resume element (no height clipping), splits it into A4
 * pages, and saves a multi-page PDF.
 *
 * @param {string} elementId – id of the hidden print div
 * @param {string} fileName  – output filename (with or without .pdf)
 */
export async function downloadResumePDF(elementId, fileName) {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Resume element not found');

  const html2canvasLib = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  await document.fonts.ready;

  const canvas = await captureElement(element, html2canvasLib);

  const pdf       = new jsPDF('p', 'mm', 'a4');
  const pdfWidth  = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  addCanvasToPDF(pdf, canvas, pdfWidth, pdfHeight, true);

  pdf.save(fileName ? fileName.replace(/\.pdf$/i, '') + '.pdf' : 'resume.pdf');
}

// ── ID-based download with separate references page ───────────────────────────
/**
 * Captures resume + references elements separately, combines them into one PDF.
 * References always start on a fresh page after the resume pages.
 *
 * @param {string} resumeElementId – id of the hidden resume print div
 * @param {string} refsElementId   – id of the hidden references print div
 * @param {string} fileName        – output filename (with or without .pdf)
 */
export async function downloadResumePDFWithRefs(resumeElementId, refsElementId, fileName) {
  const resumeEl = document.getElementById(resumeElementId);
  const refsEl   = document.getElementById(refsElementId);
  if (!resumeEl) throw new Error('Resume element not found');
  if (!refsEl)   throw new Error('References element not found');

  const html2canvasLib = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  await document.fonts.ready;

  const [resumeCanvas, refsCanvas] = await Promise.all([
    captureElement(resumeEl, html2canvasLib),
    captureElement(refsEl,   html2canvasLib),
  ]);

  const pdf       = new jsPDF('p', 'mm', 'a4');
  const pdfWidth  = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Resume pages (first page already added by jsPDF constructor)
  addCanvasToPDF(pdf, resumeCanvas, pdfWidth, pdfHeight, true);

  // References page — always starts on a clean new page
  addCanvasToPDF(pdf, refsCanvas, pdfWidth, pdfHeight, false);

  pdf.save(fileName ? fileName.replace(/\.pdf$/i, '') + '.pdf' : 'resume.pdf');
}

// ── Helper: derive a filename from the resume owner's name ────────────────────
export function buildFilename(fullName) {
  const slug = (fullName || 'resume')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${slug}-resume.pdf`;
}
