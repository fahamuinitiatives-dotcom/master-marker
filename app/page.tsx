'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap', weight: ['400', '500', '600', '700', '800', '900'] });

const spring = { type: 'spring', stiffness: 260, damping: 26 } as const;

const LOADING_STEPS = [
  'Preparing economics response',
  'Checking command word requirements',
  'Evaluating causal chains & PAI structure',
  'Verifying Cambridge 0455 terminology',
  'Scoring against the mark scheme',
  'Writing Chief Examiner feedback',
];

type Preset = { commandWord: string; question: string; essay: string };

const PRESETS: Record<number, Preset> = {
  2: {
    commandWord: 'Define',
    question: "Define what is meant by 'opportunity cost'.",
    essay: 'Opportunity cost is defined as the next best alternative forgone when making a decision.',
  },
  4: {
    commandWord: 'Explain',
    question: 'Explain two causes of a shift in the demand curve for smartphones.',
    essay:
      'One cause is a rise in consumer disposable incomes, which increases purchasing power and shifts demand to the right.\n\nAnother cause is a decrease in the price of complementary goods like headphones, making smartphones more attractive.',
  },
  6: {
    commandWord: 'Analyse',
    question:
      'Analyse how the imposition of an indirect tax on a product with negative externalities, such as cigarettes, affects market equilibrium and welfare.',
    essay:
      'An indirect tax increases production costs for firms, causing the supply curve to shift left from S1 to S2.\n\nThis creates a shortage at the original price, forcing equilibrium price to rise from P1 to P2 and quantity to fall from Q1 to Q2, internalising negative externalities.',
  },
  8: {
    commandWord: 'Discuss',
    question: 'Discuss whether the imposition of a maximum price on rented housing is beneficial to an economy.',
    essay:
      'A maximum price makes housing more affordable for low-income tenants, increasing consumer surplus in the short term. Landlords are legally prohibited from charging above this price, which prevents exploitation during housing shortages.\n\nConversely, it creates excess demand and severe housing shortages in the long run. Because rental yields are artificially suppressed, landlord incentives to maintain or build new properties fall, leading to lower housing quality and the emergence of underground black markets.',
  },
};

interface Suggestion {
  description: string;
  model: string;
}
interface Annotation {
  paragraph: number;
  comment: string;
}
interface Feedback {
  marks: number;
  maxMarks: number;
  score: string;
  grade: string;
  summary: string;
  positives: string[];
  suggestions: Suggestion[];
  annotations: Annotation[];
  caps: string[];
}

type ViewState = 'input' | 'loading' | 'results';

export default function EconomicsMarkerPage() {
  const [viewState, setViewState] = useState<ViewState>('input');
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [apiDone, setApiDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [question, setQuestion] = useState(PRESETS[8].question);
  const [maxMarks, setMaxMarks] = useState(8);
  const [commandWord, setCommandWord] = useState(PRESETS[8].commandWord);
  const [essay, setEssay] = useState(PRESETS[8].essay);

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showExactMarks, setShowExactMarks] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const handleMarkChange = (marks: number) => {
    const preset = PRESETS[marks];
    if (!preset) return;
    setMaxMarks(marks);
    setCommandWord(preset.commandWord);
    setQuestion(preset.question);
    setEssay(preset.essay);
    setErrorMsg(null);
  };

  // Sequential checklist: advances step by step, then waits for the API before showing results.
  useEffect(() => {
    if (viewState !== 'loading') return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (loadingStepIndex < LOADING_STEPS.length - 1) {
      timer = setTimeout(() => setLoadingStepIndex((prev) => prev + 1), 650);
    } else if (apiDone) {
      timer = setTimeout(() => setViewState('results'), 450);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [viewState, loadingStepIndex, apiDone]);

  const handleStartMarking = async () => {
    if (!essay.trim() || viewState === 'loading') return;
    setErrorMsg(null);
    setFeedback(null);
    setShowExactMarks(false);
    setShowModel(false);
    setApiDone(false);
    setLoadingStepIndex(0);
    setViewState('loading');

    try {
      const res = await fetch('/api/marker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, maxMarks, commandWord, studentAnswer: essay }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.error) {
        throw new Error(data?.error || `Marking failed (${res.status}).`);
      }
      setFeedback(data as Feedback);
      setApiDone(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong while marking.');
      setViewState('input');
    }
  };

  const essayParagraphs = essay.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;

  const paragraphLabel = (idx: number) => {
    if (maxMarks === 8) {
      if (idx === 0) return 'Paragraph 1: Arguments FOR';
      if (idx === 1) return 'Paragraph 2: Arguments AGAINST';
    }
    return `Paragraph ${idx + 1}`;
  };

  return (
    <div
      className={`${inter.className} min-h-screen w-full bg-[#f8fafc] text-[#334155] antialiased [text-rendering:optimizeLegibility] flex`}
    >
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0f172a] text-slate-300 flex-col justify-between border-r border-slate-800 shrink-0 select-none">
        <div>
          <div className="h-16 px-6 flex items-center space-x-2.5 border-b border-slate-800">
            <div className="h-7 w-7 rounded-md bg-[#f97316] flex items-center justify-center text-white font-extrabold text-sm">
              ★
            </div>
            <span className="font-extrabold tracking-tight text-white text-base">master-marker</span>
          </div>

          <div className="p-4 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Workspace</div>
            <div className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-800 text-white text-xs font-semibold border border-slate-700">
              <span className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] animate-pulse" />
                <span>Economics (0455)</span>
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-bold">IGCSE</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 px-2 pt-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold">
              MM
            </div>
            <div className="text-xs truncate">
              <div className="text-white font-semibold">Student Workspace</div>
              <div className="text-slate-400 text-[10px]">Cambridge Zone 3 • Year 11</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 px-4 md:px-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 w-full">
          <div className="flex items-center">
            {viewState === 'results' ? (
              <button
                onClick={() => setViewState('input')}
                className="text-xs font-bold text-slate-600 hover:text-[#f97316] transition-colors cursor-pointer"
              >
                ← Back to editor
              </button>
            ) : (
              <span className="text-xs font-semibold text-slate-500">IGCSE Economics Marking Engine (0455)</span>
            )}
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200">
            Chief Examiner mode ⚡
          </span>
        </header>

        {/* Loading overlay */}
        <AnimatePresence>
          {viewState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={spring}
                className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl space-y-6"
              >
                <div className="space-y-1 text-center">
                  <h3 className="text-base font-extrabold text-slate-900">Chief Examiner economics audit</h3>
                  <p className="text-xs text-slate-500">Enforcing strict Cambridge {maxMarks}-mark 0455 rules…</p>
                </div>

                <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-100">
                  {LOADING_STEPS.map((step, idx) => {
                    const isCompleted = idx < loadingStepIndex;
                    const isCurrent = idx === loadingStepIndex;
                    return (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0.4, x: -6 }}
                        animate={{ opacity: isCompleted || isCurrent ? 1 : 0.4, x: 0 }}
                        transition={spring}
                        className="flex items-center space-x-3 text-xs font-medium"
                      >
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {isCompleted ? (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={spring}
                              className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold"
                            >
                              ✓
                            </motion.span>
                          ) : isCurrent ? (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#f97316] border-t-transparent animate-spin" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                          )}
                        </div>
                        <span
                          className={
                            isCurrent
                              ? 'text-slate-900 font-bold'
                              : isCompleted
                              ? 'text-slate-700 font-semibold'
                              : 'text-slate-400'
                          }
                        >
                          {step}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 pb-28">
          <AnimatePresence mode="wait">
            {/* ---------------- Submission view ---------------- */}
            {viewState !== 'results' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={spring}
                className="max-w-4xl mx-auto space-y-6 w-full"
              >
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring}
                    role="alert"
                    className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-5 py-3 text-sm font-semibold"
                  >
                    {errorMsg}
                  </motion.div>
                )}

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] uppercase tracking-wider bg-orange-50 text-orange-700 px-3 py-1 rounded-lg border border-orange-200 font-bold">
                        {commandWord} question ({maxMarks}M)
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Paper 2</span>
                    </div>

                    <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200" role="group" aria-label="Mark allocation">
                      {[2, 4, 6, 8].map((m) => (
                        <button
                          key={m}
                          onClick={() => handleMarkChange(m)}
                          aria-pressed={maxMarks === m}
                          className="relative px-3.5 py-1 rounded-md text-xs font-bold cursor-pointer"
                        >
                          {maxMarks === m && (
                            <motion.span
                              layoutId="markPill"
                              transition={spring}
                              className="absolute inset-0 rounded-md bg-[#f97316] shadow-sm"
                            />
                          )}
                          <span className={`relative z-10 transition-colors ${maxMarks === m ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                            {m}M
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={2}
                    aria-label="Question"
                    className="w-full bg-transparent border-0 text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-none resize-none leading-snug tracking-[-0.01em]"
                  />
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 w-full">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Candidate response</span>
                      <span className="text-[10px] font-semibold bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-200">
                        {maxMarks}-mark rubric active
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{wordCount} words</span>
                  </div>

                  <textarea
                    rows={14}
                    value={essay}
                    onChange={(e) => setEssay(e.target.value)}
                    aria-label="Candidate response"
                    placeholder={`Draft your structured ${maxMarks}-mark economics response… Separate FOR and AGAINST paragraphs with a blank line for 8-mark questions.`}
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-4 text-[15px] font-normal text-[#334155] placeholder-slate-400 focus:outline-none focus:border-[#f97316] focus:bg-white transition-colors leading-[1.65] tracking-[-0.01em] resize-y"
                  />
                </div>
              </motion.div>
            )}

            {/* ---------------- Results view ---------------- */}
            {viewState === 'results' && feedback && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={spring}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full"
              >
                {/* Left: annotated response */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 w-full">
                  <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Annotated economics response</span>
                    <span className="text-[10px] font-semibold bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {maxMarks}-mark evaluation
                    </span>
                  </div>

                  <div className="space-y-4">
                    {essayParagraphs.map((para, idx) => {
                      const note = feedback.annotations?.find((a) => a.paragraph === idx + 1);
                      const isFor = maxMarks === 8 && idx === 0;
                      const isAgainst = maxMarks === 8 && idx === 1;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ...spring, delay: idx * 0.08 }}
                          className={`rounded-xl p-4 space-y-2 border ${
                            isFor
                              ? 'bg-emerald-50/60 border-emerald-200'
                              : isAgainst
                              ? 'bg-rose-50/60 border-rose-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              isFor ? 'text-emerald-700' : isAgainst ? 'text-rose-700' : 'text-[#f97316]'
                            }`}
                          >
                            {paragraphLabel(idx)}
                          </span>
                          <p className="text-[14px] font-normal text-[#334155] leading-[1.65] tracking-[-0.01em]">{para}</p>
                          {note && (
                            <p className="text-[13px] font-medium text-slate-600 leading-[1.5] border-t border-slate-200/80 pt-2">
                              <span className="font-bold text-slate-800">Examiner: </span>
                              {note.comment}
                            </p>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: MarkMe cards */}
                <div className="lg:col-span-5 space-y-6 w-full">
                  {/* 1. Estimated mark */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.05 }}
                    className="bg-white border border-sky-200 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className="bg-[#0284c7] px-6 py-4 text-white flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest opacity-90">Estimated mark</span>
                        <h3 className="text-lg font-extrabold tracking-wide">Cambridge 0455 audit ({maxMarks}M)</h3>
                      </div>
                      <div className="text-3xl font-black bg-white/15 px-3 py-1 rounded-lg tabular-nums">
                        {showExactMarks ? feedback.score : '? / ' + feedback.maxMarks}
                      </div>
                    </div>
                    <div className="p-5 bg-white flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-0.5">This answer would be awarded:</p>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={showExactMarks ? 'exact' : 'grade'}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                            className="text-xl font-black text-slate-900"
                          >
                            {showExactMarks ? feedback.score : feedback.grade}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-xs font-semibold text-slate-500">Exact marks</span>
                        <button
                          role="switch"
                          aria-checked={showExactMarks}
                          aria-label="Show exact marks"
                          onClick={() => setShowExactMarks((v) => !v)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                            showExactMarks ? 'bg-[#f97316]' : 'bg-slate-200'
                          }`}
                        >
                          <motion.div
                            layout
                            transition={spring}
                            className="bg-white w-4 h-4 rounded-full shadow-md"
                            style={{ marginLeft: showExactMarks ? 20 : 0 }}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* 2. Feedback summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.12 }}
                    className="bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className="bg-[#8b5cf6] px-6 py-3 text-white font-bold text-xs uppercase tracking-wider">
                      Feedback summary
                    </div>
                    <div className="p-6 space-y-3">
                      <p className="text-[14px] font-normal text-[#4a5568] leading-[1.65] tracking-[-0.01em]">{feedback.summary}</p>
                      {feedback.caps?.length > 0 && (
                        <ul className="space-y-1.5">
                          {feedback.caps.map((c, i) => (
                            <li
                              key={i}
                              className="text-[12px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-snug"
                            >
                              Examiner rule applied: {c}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>

                  {/* 3. Positives */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.19 }}
                    className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm space-y-3"
                  >
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Positives</span>
                    </span>
                    {feedback.positives?.length > 0 ? (
                      <ul className="space-y-2.5">
                        {feedback.positives.map((pos, idx) => (
                          <li
                            key={idx}
                            className="text-[13px] font-normal text-[#4a5568] leading-[1.5] flex items-start space-x-2.5 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100"
                          >
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span>{pos}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[13px] text-slate-500 font-medium">No creditworthy points were identified.</p>
                    )}
                  </motion.div>

                  {/* 4. Suggestions */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.26 }}
                    className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-orange-700">Suggestions</span>
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">Actionable</span>
                    </div>

                    {feedback.suggestions?.map((sug, idx) => (
                      <div key={idx} className="space-y-3">
                        <p className="text-[14px] font-normal text-[#4a5568] leading-[1.65] tracking-[-0.01em]">{sug.description}</p>

                        <AnimatePresence initial={false}>
                          {showModel && sug.model && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-slate-50 p-4 rounded-xl border border-orange-200 space-y-2">
                                <div className="text-[11px] font-bold text-[#f97316] uppercase tracking-wide">Upgraded model standard</div>
                                <div className="whitespace-pre-line text-[13px] text-[#334155] leading-[1.65]">{sug.model}</div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}

                    <button
                      onClick={() => setShowModel((v) => !v)}
                      className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg text-xs transition-colors shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>{showModel ? 'Hide model answer' : '✨ Show me'}</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Fixed "Mark essay" action */}
        <AnimatePresence>
          {viewState === 'input' && (
            <motion.button
              key="mark-btn"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={spring}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartMarking}
              disabled={!essay.trim()}
              className="fixed bottom-6 right-6 md:right-10 z-40 bg-[#f97316] hover:bg-orange-600 text-white font-extrabold px-8 py-3.5 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2"
            >
              <span>Mark essay</span>
              <span aria-hidden="true">→</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
