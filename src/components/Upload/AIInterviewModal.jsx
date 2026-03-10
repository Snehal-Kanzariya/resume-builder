import { useState, useEffect, useRef } from 'react';
import { X, Bot, User, ChevronRight, SkipForward, Loader2, CheckCircle, Sparkles, Eye } from 'lucide-react';
import { generateInterviewQuestions, applyInterviewAnswers } from '../../utils/resumeParser';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';

const FIELD_PLACEHOLDERS = {
  personalInfo:   'e.g. Senior Software Engineer at Microsoft',
  experience:     'e.g. Increased team productivity by 40% through CI/CD automation',
  education:      'e.g. Completed an online ML specialisation on Coursera',
  skills:         'e.g. React, Node.js, Python, AWS, Docker',
  projects:       'e.g. E-commerce platform with real-time inventory management',
  certifications: 'e.g. AWS Solutions Architect, completed March 2025',
};

function getPlaceholder(question) {
  return question.placeholder || FIELD_PLACEHOLDERS[question.field] || 'Type your answer…';
}

// screen: loading | questions | applying | done | error
export default function AIInterviewModal({ resumeData, onUpdate, onClose, onViewPreview }) {
  const { importResumeData } = useResume();
  const toast = useToast();
  const [screen, setScreen]       = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [answers, setAnswers]     = useState([]);
  const [inputVal, setInputVal]   = useState('');
  const [error, setError]         = useState('');
  const textareaRef               = useRef(null);

  // Load questions on mount
  useEffect(() => {
    let cancelled = false;
    generateInterviewQuestions(resumeData)
      .then(qs => {
        if (cancelled) return;
        setQuestions(qs);
        setScreen('questions');
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message || 'Failed to generate questions.');
        setScreen('error');
      });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-focus textarea when question changes
  useEffect(() => {
    if (screen === 'questions') {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [current, screen]);

  const currentQ = questions[current];
  const progress = questions.length ? ((current) / questions.length) * 100 : 0;

  function recordAnswer(skip = false) {
    const answer = skip ? '' : inputVal.trim();
    const newAnswers = [
      ...answers,
      { id: currentQ.id, question: currentQ.question, field: currentQ.field, answer },
    ];
    setAnswers(newAnswers);
    setInputVal('');

    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
    } else {
      // All questions answered — apply them
      applyAnswers(newAnswers);
    }
  }

  async function applyAnswers(finalAnswers) {
    setScreen('applying');
    try {
      // Filter out skipped answers
      const answered = finalAnswers.filter(a => a.answer.trim());
      const updated = answered.length
        ? await applyInterviewAnswers(resumeData, answered)
        : resumeData;

      // Import into context using safe deep-merge (never blanks existing data)
      importResumeData(updated);
      // Notify parent (Home/Builder) so it can sync its local parsedResume state
      if (onUpdate) onUpdate(updated);
      toast('Resume updated with your answers!', 'success', 3000);
      setScreen('done');
    } catch (err) {
      toast(err.message || 'Failed to update resume. Your existing data is unchanged.', 'error', 4000);
      setError(err.message || 'Failed to update resume.');
      setScreen('error');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      recordAnswer(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">AI Interview</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Let&apos;s update your resume</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress bar */}
        {screen === 'questions' && questions.length > 0 && (
          <div className="h-1 bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Body */}
        <div className="p-5 min-h-[320px] flex flex-col">

          {/* Loading screen */}
          {screen === 'loading' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="animate-spin text-blue-500" />
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Analyzing your resume and generating questions…
              </p>
            </div>
          )}

          {/* Questions screen */}
          {screen === 'questions' && currentQ && (
            <div className="flex-1 flex flex-col gap-4">
              {/* Progress label */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Question {current + 1} of {questions.length}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                  {currentQ.field}
                </span>
              </div>

              {/* AI avatar + question bubble */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                  <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
                    {currentQ.question}
                  </p>
                </div>
              </div>

              {/* User answer input */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={getPlaceholder(currentQ)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl rounded-tl-sm text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 placeholder:italic resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                  <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 pl-1">
                    Ctrl+Enter to submit · press Skip to skip this question
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-auto pt-2">
                <button
                  onClick={() => recordAnswer(true)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <SkipForward size={13} /> Skip
                </button>

                <button
                  onClick={() => recordAnswer(false)}
                  disabled={!inputVal.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {current + 1 < questions.length ? (
                    <>Next <ChevronRight size={15} /></>
                  ) : (
                    <>Finish <CheckCircle size={15} /></>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Applying screen */}
          {screen === 'applying' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <Loader2 size={28} className="animate-spin text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">
                  Updating your resume…
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  AI is merging your answers into the resume. This takes a few seconds.
                </p>
              </div>
            </div>
          )}

          {/* Done screen */}
          {screen === 'done' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">
                  Resume Updated!
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Your answers have been merged into the resume. All forms are now up to date.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 mt-2 w-full max-w-xs">
                <button
                  onClick={onClose}
                  className="flex-1 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Go to Builder
                </button>
                {onViewPreview && (
                  <button
                    onClick={onViewPreview}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    <Eye size={15} /> View Full Preview
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Error screen */}
          {screen === 'error' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <X size={28} className="text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">
                  Something went wrong
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  {error}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => { setScreen('loading'); setError(''); setAnswers([]); setCurrent(0); setInputVal(''); }}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
