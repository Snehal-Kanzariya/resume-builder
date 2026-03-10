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
    // Remove any CSS transforms so we capture the raw layout
    ignoreElements: el => el.getAttribute('aria-hidden') === 'true' && el !== element,
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

// ── ID-based download (preferred) ─────────────────────────────────────────────
/**
 * Find an element by ID and download it as a PDF.
 * Falls back to the raw element if ID lookup fails.
 *
 * @param {string} elementId  – id attribute of the 794×1123 hidden print div
 * @param {string} fileName   – output filename
 */
export async function downloadResumePDF(elementId, fileName = 'resume.pdf') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`downloadResumePDF: element #${elementId} not found`);
  return downloadPDF(element, fileName);
}

// ── Helper: derive a filename from the resume owner's name ────────────────────
export function buildFilename(fullName) {
  const slug = (fullName || 'resume')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${slug}-resume.pdf`;
}
