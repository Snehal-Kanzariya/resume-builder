import mammoth from 'mammoth';

/**
 * Extract raw text from a DOCX file.
 * @param {File} file - DOCX File object
 * @returns {Promise<string>} - extracted plain text
 */
export async function extractTextFromDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
