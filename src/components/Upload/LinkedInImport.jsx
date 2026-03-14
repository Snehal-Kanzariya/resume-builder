import { useState, useRef, useCallback } from 'react';
import {
  Linkedin, Upload, FileText, CheckCircle, AlertCircle,
  ChevronRight, Loader2, Info,
} from 'lucide-react';
import { extractTextFromPDF } from '../../utils/pdfParser';
import { parseLinkedInCSV, parseLinkedInPDF } from '../../utils/linkedinParser';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB — ZIPs/CSVs can be larger

// ── Step-by-step instruction item ─────────────────────────────────────────────
function Step({ num, text, sub }) {
  return (
    <div className="flex gap-3">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
        {num}
      </span>
      <div>
        <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-snug">{text}</p>
        {sub && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function LinkedInImport({ onSuccess }) {
  const [mode,       setMode]      = useState('csv');   // 'csv' | 'pdf'
  const [status,     setStatus]    = useState('idle');  // idle | parsing | success | error
  const [error,      setError]     = useState('');
  const [summary,    setSummary]   = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [dragOver,   setDragOver]  = useState(false);
  const fileInputRef               = useRef(null);

  const isProcessing = status === 'parsing';

  function buildSummary(data) {
    return {
      positions: data.experience?.length     ?? 0,
      degrees:   data.education?.length      ?? 0,
      skills:    data.skills?.reduce((n, g) => n + (g.items?.length ?? 0), 0) ?? 0,
      certs:     data.certifications?.length ?? 0,
    };
  }

  const processCSVFiles = useCallback(async (files) => {
    const csvFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.csv'));
    if (!csvFiles.length) {
      setError('No CSV files found. Please select CSV files from your LinkedIn data export ZIP (e.g. Profile.csv, Positions.csv, Skills.csv).');
      setStatus('error');
      return;
    }
    const oversized = csvFiles.find(f => f.size > MAX_SIZE_BYTES);
    if (oversized) { setError(`${oversized.name} is too large (max 10 MB).`); setStatus('error'); return; }

    setError('');
    setStatus('parsing');
    try {
      const data = await parseLinkedInCSV(csvFiles);
      const sum  = buildSummary(data);
      if (!sum.positions && !sum.degrees && !sum.skills) {
        throw new Error('Could not extract any data from the CSV files. Make sure you selected the right files from the LinkedIn export ZIP.');
      }
      setParsedData(data);
      setSummary(sum);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Failed to parse LinkedIn CSV files. Please try again.');
      setStatus('error');
    }
  }, []);

  const processPDFFile = useCallback(async (file) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file for this option.');
      setStatus('error');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('File too large (max 10 MB).');
      setStatus('error');
      return;
    }
    setError('');
    setStatus('parsing');
    try {
      const text = await extractTextFromPDF(file);
      if (!text?.trim()) throw new Error('Could not extract text from the PDF. Make sure it is a text-based PDF, not a scanned image.');
      const data = await parseLinkedInPDF(text);
      const sum  = buildSummary(data);
      setParsedData(data);
      setSummary(sum);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Failed to parse LinkedIn PDF. Please try again.');
      setStatus('error');
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (!files.length) return;
    if (mode === 'pdf') {
      processPDFFile(files[0]);
    } else {
      processCSVFiles(files);
    }
  }, [mode, processCSVFiles, processPDFFile]);

  const handleFileChange = useCallback((e) => {
    const files = e.target.files;
    if (!files.length) return;
    if (mode === 'pdf') {
      processPDFFile(files[0]);
    } else {
      processCSVFiles(files);
    }
    e.target.value = '';
  }, [mode, processCSVFiles, processPDFFile]);

  function reset() {
    setStatus('idle');
    setError('');
    setSummary(null);
    setParsedData(null);
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Linkedin size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Import from LinkedIn</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Upload your LinkedIn data export or profile PDF</p>
        </div>
      </div>

      {/* Sub-mode toggle — CSV vs PDF */}
      {status === 'idle' && (
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-medium">
          <button
            onClick={() => setMode('csv')}
            className={`flex-1 py-1.5 transition-colors ${
              mode === 'csv'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            CSV Data Export
          </button>
          <button
            onClick={() => setMode('pdf')}
            className={`flex-1 py-1.5 transition-colors border-l border-slate-200 dark:border-slate-700 ${
              mode === 'pdf'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Profile PDF
          </button>
        </div>
      )}

      {/* ── CSV mode instructions ── */}
      {status === 'idle' && mode === 'csv' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
            <Info size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
              LinkedIn's data export gives you accurate, structured data. It takes only a few minutes to request.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
              How to get your LinkedIn data
            </p>
            <Step num={1} text="Go to LinkedIn → click Me → Settings & Privacy" />
            <Step num={2} text="Click 'Get a copy of your data'" />
            <Step num={3}
              text="Select 'Want something in particular?'"
              sub="Check: Profile, Positions, Education, Skills, Certifications — then click Request archive"
            />
            <Step num={4} text="Download the ZIP file" sub="LinkedIn emails you a link — usually ready within a few minutes" />
            <Step num={5} text="Unzip and upload the CSV files here" sub="Select Profile.csv, Positions.csv, Education.csv, Skills.csv, Certifications.csv" />
          </div>
        </div>
      )}

      {/* ── PDF mode instructions ── */}
      {status === 'idle' && mode === 'pdf' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900">
            <Info size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
              PDF parsing uses AI and may miss some details. CSV export gives more accurate results.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
              How to download your LinkedIn PDF
            </p>
            <Step num={1} text="Go to your LinkedIn profile" />
            <Step num={2} text="Click 'More' → 'Save to PDF'" sub="The button is on your profile page near your name" />
            <Step num={3} text="Upload the downloaded PDF here" />
          </div>
        </div>
      )}

      {/* ── Drop zone ── */}
      {(status === 'idle' || status === 'error') && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl py-8 px-4 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
          }`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
            dragOver ? 'bg-blue-100 dark:bg-blue-900' : 'bg-white dark:bg-slate-800 shadow-sm'
          }`}>
            <Upload size={20} className={dragOver ? 'text-blue-500' : 'text-slate-400'} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {dragOver
                ? 'Drop files here'
                : mode === 'csv'
                  ? 'Drop CSV files here or click to browse'
                  : 'Drop LinkedIn PDF here or click to browse'
              }
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              {mode === 'csv' ? 'Select multiple CSV files at once · Max 10 MB each' : 'PDF only · Max 10 MB'}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={mode === 'csv' ? '.csv' : '.pdf'}
            multiple={mode === 'csv'}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* ── Parsing state ── */}
      {isProcessing && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
            <Loader2 size={22} className="text-blue-600 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {mode === 'pdf' ? 'AI is reading your LinkedIn profile…' : 'Parsing your LinkedIn data…'}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {mode === 'pdf' ? 'This may take 10–15 seconds' : 'Just a moment…'}
          </p>
        </div>
      )}

      {/* ── Success ── */}
      {status === 'success' && summary && parsedData && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>

          <div className="text-center">
            <p className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
              LinkedIn Data Imported!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Found{' '}
              {summary.positions > 0 && (
                <><span className="font-semibold text-slate-700 dark:text-slate-300">{summary.positions} position{summary.positions !== 1 ? 's' : ''}</span>{', '}</>
              )}
              {summary.degrees > 0 && (
                <><span className="font-semibold text-slate-700 dark:text-slate-300">{summary.degrees} degree{summary.degrees !== 1 ? 's' : ''}</span>{', '}</>
              )}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{summary.skills} skill{summary.skills !== 1 ? 's' : ''}</span>
              {summary.certs > 0 && (
                <>{', '}<span className="font-semibold text-slate-700 dark:text-slate-300">{summary.certs} certification{summary.certs !== 1 ? 's' : ''}</span></>
              )}
              . Review and edit in Builder.
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => onSuccess?.(parsedData)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <FileText size={15} />
              Edit in Builder
              <ChevronRight size={15} />
            </button>
            <button
              onClick={reset}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1"
            >
              Import different files
            </button>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">{error}</p>
        </div>
      )}
      {status === 'error' && (
        <button
          onClick={reset}
          className="w-full py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
