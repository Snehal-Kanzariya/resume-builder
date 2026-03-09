import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, FileType2, AlertCircle, X } from 'lucide-react';
import { extractTextFromPDF } from '../../utils/pdfParser';
import { extractTextFromDOCX } from '../../utils/docxParser';
import { parseResumeText, hasApiKey } from '../../utils/resumeParser';
import ResumeParsingStatus from './ResumeParsingStatus';

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// idle | uploading | extracting | parsing | success | error
function validateFile(file) {
  if (!file) return 'No file selected.';
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['pdf', 'docx'].includes(ext)) return 'Only PDF and DOCX files are supported.';
  if (file.size > MAX_SIZE_BYTES) return `File size must be under ${MAX_SIZE_MB}MB.`;
  return null;
}

function stepForStatus(status) {
  if (status === 'uploading')  return 'upload';
  if (status === 'extracting') return 'extract';
  if (status === 'parsing')    return 'parse';
  return 'fill';
}

function buildSummary(parsed) {
  return {
    jobs:     parsed.experience?.length    ?? 0,
    degrees:  parsed.education?.length     ?? 0,
    skills:   parsed.skills?.length        ?? 0,
    projects: parsed.projects?.length      ?? 0,
  };
}

export default function ResumeUpload({ onParsed, onClose }) {
  const [status, setStatus]         = useState('idle');
  const [error, setError]           = useState('');
  const [dragOver, setDragOver]     = useState(false);
  const [fileName, setFileName]     = useState('');
  const [summary, setSummary]       = useState(null);
  const fileInputRef                = useRef(null);

  const noKey = !hasApiKey();

  const processFile = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) { setError(validationError); return; }

    setError('');
    setFileName(file.name);
    const ext = file.name.split('.').pop().toLowerCase();

    try {
      // Step 1: uploading
      setStatus('uploading');
      await new Promise(r => setTimeout(r, 400)); // brief pause for UX

      // Step 2: extracting
      setStatus('extracting');
      let text;
      if (ext === 'pdf') {
        text = await extractTextFromPDF(file);
      } else {
        text = await extractTextFromDOCX(file);
      }

      if (!text?.trim()) throw new Error('Could not extract text from the file. Make sure it is not image-only.');

      // Step 3: AI parsing
      setStatus('parsing');
      const parsed = await parseResumeText(text);

      // Step 4: success
      const sum = buildSummary(parsed);
      setSummary(sum);
      setStatus('success');

      // Small delay so user sees the success state
      await new Promise(r => setTimeout(r, 800));
      onParsed(parsed);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }, [onParsed]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = '';
  }, [processFile]);

  const isProcessing = ['uploading', 'extracting', 'parsing'].includes(status);

  return (
    <div className="relative">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <X size={14} />
        </button>
      )}

      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
            <Upload size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Upload Your Resume</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">AI will extract and fill your forms automatically</p>
          </div>
        </div>

        {/* No API key warning */}
        {noKey && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
            <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              AI parsing requires a Groq API key. Add <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">VITE_GROQ_API_KEY</code> to your <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">.env</code> file.
            </p>
          </div>
        )}

        {/* Drop zone */}
        {status === 'idle' || status === 'error' ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !noKey && fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-10 px-6 text-center transition-all duration-200 ${
              noKey
                ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 cursor-not-allowed opacity-60'
                : dragOver
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 cursor-copy scale-[1.01]'
                : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
              dragOver ? 'bg-blue-200 dark:bg-blue-900' : 'bg-white dark:bg-slate-800 shadow-sm'
            }`}>
              {dragOver ? (
                <Upload size={26} className="text-blue-500" />
              ) : (
                <div className="flex gap-1">
                  <FileText size={20} className="text-red-400" />
                  <FileType2 size={20} className="text-blue-400" />
                </div>
              )}
            </div>

            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-1">
                {dragOver ? 'Drop your resume here' : 'Drag your resume here or click to browse'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs">
                PDF or DOCX · Max {MAX_SIZE_MB}MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
              disabled={noKey}
            />
          </div>
        ) : (
          /* Processing / success state */
          <div className="py-4">
            <div className="flex items-center gap-2 mb-5">
              <FileText size={16} className="text-blue-500 flex-shrink-0" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{fileName}</p>
            </div>
            <ResumeParsingStatus
              currentStep={stepForStatus(status)}
              summary={summary}
            />
            {status === 'success' && (
              <p className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-4">
                All done! Opening AI interview…
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Retry button after error */}
        {status === 'error' && (
          <button
            onClick={() => { setStatus('idle'); setError(''); setSummary(null); }}
            className="mt-3 w-full py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            Try again
          </button>
        )}

        {/* Loading hint */}
        {isProcessing && (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
            This may take 10–20 seconds…
          </p>
        )}
      </div>
    </div>
  );
}
