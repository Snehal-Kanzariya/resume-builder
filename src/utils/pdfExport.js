import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// ── Print page style injected by react-to-print ───────────────────────────────
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
    box-sizing: border-box;
  }
  p, h1, h2, h3, h4, h5, h6, blockquote, figure, pre {
    margin: 0;
    padding: 0;
  }
  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    margin: 0;
    padding: 0;
  }
  .no-print { display: none !important; }
  .resume-entry { break-inside: avoid; page-break-inside: avoid; }
  .resume-section-header { break-after: avoid; page-break-after: avoid; }
  .resume-section { break-inside: avoid; page-break-inside: avoid; }
`;

// ── Single-shot download (fixed 1-page, no slicing needed) ────────────────────
export async function downloadPDF(element, filename = 'resume.pdf') {
  if (!element) throw new Error('downloadPDF: element is null');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: 794,
    height: 1123,
    scrollX: 0,
    scrollY: 0,
    logging: false,
    ignoreElements: el => el.getAttribute('aria-hidden') === 'true' && !el.contains(element),
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4', compress: true });
  pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89);
  pdf.save(filename);
}

// ── Smart multi-page download ─────────────────────────────────────────────────
/**
 * Clones the resume element off-screen, measures where every section/entry/
 * paragraph sits, finds page-break points that never cut through an element,
 * then captures each segment with html2canvas and builds a multi-page PDF.
 *
 * @param {string} elementId – id of the hidden full-res 794px print div
 * @param {string} fileName  – output filename (with or without .pdf)
 */
export async function downloadResumePDF(elementId, fileName) {
  await document.fonts.ready;

  const { default: h2c } = await import('html2canvas');
  const { jsPDF: JsPDF } = await import('jspdf');

  const element = document.getElementById(elementId);
  if (!element) throw new Error('Resume element not found');

  // ── 1. Off-screen clone — position:absolute so scrollHeight is reliable ───
  const clone = element.cloneNode(true);
  clone.querySelectorAll('.no-print').forEach(el => el.remove());
  clone.style.cssText =
    'position:absolute;left:-9999px;top:0;width:794px;height:auto;' +
    'max-height:none;transform:none;overflow:visible;background:white;z-index:-1;';
  document.body.appendChild(clone);

  // Expand any overflow:hidden so all content is visible to html2canvas
  clone.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.overflow === 'hidden' || cs.overflowY === 'hidden' || cs.overflowX === 'hidden') {
      el.style.overflow  = 'visible';
      el.style.overflowX = 'visible';
      el.style.overflowY = 'visible';
    }
  });

  // Wait for layout + fonts
  await new Promise(r => setTimeout(r, 200));
  await document.fonts.ready;

  const contentHeight = clone.scrollHeight;
  const pageHeight    = 1123; // A4 at 96 dpi

  const pdf          = new JsPDF('p', 'mm', 'a4');
  const pdfWidth     = pdf.internal.pageSize.getWidth();  // 210 mm
  const pdfPageHeight= pdf.internal.pageSize.getHeight(); // 297 mm

  // ── 2. Single-page fast path ──────────────────────────────────────────────
  if (contentHeight <= pageHeight * 1.05) {
    const canvas = await h2c(clone, {
      scale: 2, useCORS: true, allowTaint: true,
      backgroundColor: '#ffffff', logging: false,
      width: 794, height: contentHeight,
      scrollX: 0, scrollY: 0,
    });
    const imgData  = canvas.toDataURL('image/png');
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);

  } else {
    // ── 3. Multi-page: find smart break points ──────────────────────────────
    //
    // Broad selector catches every visual atom that should not be split:
    // named section wrappers, individual entries, headings, paragraphs, list items,
    // and direct child divs (handles inline-styled template blocks).
    const sections = clone.querySelectorAll(
      '.resume-section, .resume-entry, .resume-section-header, h2, h3, p, li, div > div'
    );

    const cloneRect = clone.getBoundingClientRect();

    let breakPoints  = [0];
    let currentBreak = pageHeight;

    for (let i = 1; i < Math.ceil(contentHeight / pageHeight); i++) {
      let bestBreak = currentBreak;

      sections.forEach(section => {
        const rect        = section.getBoundingClientRect();
        const elementTop  = rect.top    - cloneRect.top;
        const elementBottom = elementTop + rect.height;

        // Element straddles the current page boundary
        if (elementTop < currentBreak && elementBottom > currentBreak) {
          // Only pull the break UP if the element starts within the last 150 px
          // of the page (so we don't try to rescue elements that span most of the page)
          if (elementTop > currentBreak - 150) {
            bestBreak = Math.min(bestBreak, elementTop - 5);
          }
        }
      });

      // Safety: if the adjusted break would leave a page less than 50 % filled,
      // fall back to the exact A4 boundary instead.
      if (bestBreak < currentBreak - pageHeight * 0.5) {
        bestBreak = currentBreak;
      }

      breakPoints.push(Math.round(bestBreak));
      currentBreak = bestBreak + pageHeight;
    }
    breakPoints.push(contentHeight);

    // ── 4. Capture each page segment separately ─────────────────────────────
    for (let i = 0; i < breakPoints.length - 1; i++) {
      const segmentTop    = breakPoints[i];
      const segmentHeight = breakPoints[i + 1] - breakPoints[i];
      if (segmentHeight <= 0) continue;

      if (i > 0) pdf.addPage();

      // html2canvas `y` crops the capture window starting at segmentTop pixels
      // from the top of the clone (which sits at document top = 0).
      const canvas = await h2c(clone, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: '#ffffff', logging: false,
        width:        794,
        height:       segmentHeight,
        y:            segmentTop,
        scrollX:      0,
        scrollY:      0,
        windowHeight: segmentHeight,
      });

      const imgData   = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    }
  }

  // ── 5. Watermark on every page (free version) ─────────────────────────────
  const isPremium = JSON.parse(localStorage.getItem('resumeai_premium') || 'false');
  if (!isPremium) {
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(176, 176, 176);
      pdf.text('Built with ResumeAI', pdfWidth - 42, pdfPageHeight - 5);
    }
  }

  // ── 6. Cleanup and save ───────────────────────────────────────────────────
  document.body.removeChild(clone);
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
