'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const spring = { type: 'spring', stiffness: 260, damping: 26 } as const;

const LOADING_STEPS = [
  'Preparing economics response',
  'Checking command word requirements',
  'Evaluating causal chains and PAI structure',
  'Verifying Cambridge 0455 terminology',
  'Scoring against the mark scheme',
  'Writing Chief Examiner feedback',
];

const RUBRIC_HINT: Record<number, string> = {
  2: 'One precise textbook definition earns full marks.',
  4: 'Two distinct points, each with a reason.',
  6: 'Two or three developed one-sided chains. No evaluation.',
  8: 'Two arguments for, then two against. No conclusion.',
};

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

/* ---------------------------- Icons ---------------------------- */

type IconProps = { className?: string };

const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
  </svg>
);

const ArrowRightIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
);

const ArrowLeftIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M16 10H4M9 5l-5 5 5 5" />
  </svg>
);

const SparkleIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
    <path d="M10 2l1.8 5.2L17 9l-5.2 1.8L10 16l-1.8-5.2L3 9l5.2-1.8L10 2z" />
  </svg>
);

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2';

/* ----------------------------- Page ---------------------------- */

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

  // Checklist advances step by step, then waits for the API before showing results.
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
      if (idx === 0) return 'Arguments for';
      if (idx === 1) return 'Arguments against';
    }
    return `Paragraph ${idx + 1}`;
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-700">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col justify-between bg-[#0f172a] md:flex">
        <div>
          <div className="flex h-16 items-center border-b border-white/10 px-6">
            <span className="text-[17px] font-extrabold tracking-tight text-white">master-marker</span>
          </div>
          <nav className="px-3 py-5">
            <p className="px-3 pb-2 text-xs font-semibold text-slate-400">Subject</p>
            <div className="relative flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5 text-sm font-semibold text-white">
              <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-orange-500" />
              <span>Economics</span>
              <span className="text-xs font-medium text-slate-400">0455</span>
            </div>
          </nav>
        </div>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
              MM
            </div>
            <div className="text-xs">
              <div className="font-semibold text-white">Student workspace</div>
              <div className="text-slate-400">Year 11</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 md:px-8">
          <span className="mr-4 text-[15px] font-extrabold tracking-tight text-slate-900 md:hidden">master-marker</span>
          {viewState === 'results' ? (
            <button
              onClick={() => setViewState('input')}
              className={`flex cursor-pointer items-center gap-1.5 rounded-md text-sm font-semibold text-slate-600 transition-colors hover:text-orange-600 ${focusRing}`}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to editor
            </button>
          ) : (
            <span className="text-sm font-semibold text-slate-500">IGCSE Economics 0455</span>
          )}
        </header>

        {/* Loading overlay */}
        <AnimatePresence>
          {viewState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 p-6 backdrop-blur-sm md:left-60"
              role="status"
              aria-live="polite"
            >
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={spring}
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-xl"
              >
                <h3 className="text-lg font-bold tracking-tight text-slate-900">Marking your response</h3>
                <p className="mt-1 text-sm text-slate-500">Applying the {maxMarks}-mark Cambridge 0455 scheme.</p>

                <ul className="mt-6 space-y-3.5">
                  {LOADING_STEPS.map((step, idx) => {
                    const isCompleted = idx < loadingStepIndex;
                    const isCurrent = idx === loadingStepIndex;
                    return (
                      <motion.li
                        key={step}
                        initial={{ opacity: 0.4, x: -6 }}
                        animate={{ opacity: isCompleted || isCurrent ? 1 : 0.4, x: 0 }}
                        transition={spring}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                          {isCompleted ? (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={spring}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"
                            >
                              <CheckIcon className="h-3 w-3" />
                            </motion.span>
                          ) : isCurrent ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          )}
                        </span>
                        <span
                          className={
                            isCurrent
                              ? 'font-semibold text-slate-900'
                              : isCompleted
                              ? 'font-medium text-slate-600'
                              : 'text-slate-400'
                          }
                        >
                          {step}
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="mx-auto w-full max-w-6xl flex-1 p-4 pb-28 md:p-8 md:pb-28">
          <AnimatePresence mode="wait">
            {/* ---------------- Submission view ---------------- */}
            {viewState !== 'results' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={spring}
                className="mx-auto w-full max-w-3xl space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Mark your answer</h1>
                  <p className="mt-1.5 text-[15px] text-slate-500">
                    Choose the mark allocation, check the question, then write or paste your response.
                  </p>
                </div>

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring}
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                  >
                    <p className="text-sm font-bold text-red-800">Marking failed</p>
                    <p className="mt-0.5 text-sm text-red-700">{errorMsg}</p>
                  </motion.div>
                )}

                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[13px] font-semibold text-slate-500">
                      Command word: <span className="text-slate-900">{commandWord}</span>
                    </p>

                    <div
                      className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1"
                      role="group"
                      aria-label="Mark allocation"
                    >
                      {[2, 4, 6, 8].map((m) => (
                        <button
                          key={m}
                          onClick={() => handleMarkChange(m)}
                          aria-pressed={maxMarks === m}
                          className={`relative cursor-pointer rounded-md px-3.5 py-1 text-[13px] font-bold ${focusRing}`}
                        >
                          {maxMarks === m && (
                            <motion.span
                              layoutId="markPill"
                              transition={spring}
                              className="absolute inset-0 rounded-md bg-orange-500"
                            />
                          )}
                          <span
                            className={`relative z-10 transition-colors ${
                              maxMarks === m ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {m}M
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={3}
                    aria-label="Question"
                    className="mt-4 w-full resize-none bg-transparent text-xl font-bold leading-snug tracking-tight text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[15px] font-bold text-slate-900">Your response</h2>
                    <span className="text-[13px] font-medium text-slate-400">{wordCount} words</span>
                  </div>

                  <textarea
                    rows={14}
                    value={essay}
                    onChange={(e) => setEssay(e.target.value)}
                    aria-label="Your response"
                    placeholder="Write your response here. For 8-mark questions, separate the arguments for and against with a blank line."
                    className="mt-4 w-full resize-y rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-[15px] leading-[1.65] tracking-[-0.01em] text-slate-700 placeholder-slate-400 transition-colors focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </section>
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
                className="w-full space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Your results</h1>
                  <p className="mt-1.5 text-[15px] text-slate-500">
                    Marked against the {maxMarks}-mark Cambridge 0455 scheme.
                  </p>
                </div>

                <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-12">
                  {/* Left: annotated response */}
                  <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
                    <h2 className="text-[15px] font-bold text-slate-900">Annotated response</h2>
                    <p className="mt-0.5 text-[13px] text-slate-500">{commandWord}: {question}</p>

                    <div className="mt-6 space-y-6">
                      {essayParagraphs.map((para, idx) => {
                        const note = feedback.annotations?.find((a) => a.paragraph === idx + 1);
                        const isFor = maxMarks === 8 && idx === 0;
                        const isAgainst = maxMarks === 8 && idx === 1;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...spring, delay: idx * 0.07 }}
                            className={`border-l-[3px] pl-4 ${
                              isFor ? 'border-emerald-500' : isAgainst ? 'border-rose-500' : 'border-slate-300'
                            }`}
                          >
                            <p
                              className={`text-[13px] font-bold ${
                                isFor ? 'text-emerald-700' : isAgainst ? 'text-rose-700' : 'text-slate-500'
                              }`}
                            >
                              {paragraphLabel(idx)}
                            </p>
                            <p className="mt-1.5 text-[15px] leading-[1.65] tracking-[-0.01em] text-slate-700">{para}</p>
                            {note && (
                              <div className="mt-3 rounded-lg bg-slate-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-600">
                                <span className="font-bold text-slate-900">Examiner </span>
                                {note.comment}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Right: feedback cards */}
                  <div className="space-y-6 lg:col-span-5">
                    {/* Estimated mark */}
                    <motion.section
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: 0.05 }}
                      className="rounded-xl border border-slate-200 bg-white p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-[15px] font-bold text-slate-900">Estimated mark</h3>
                          <p className="mt-0.5 text-[13px] text-slate-500">{maxMarks}-mark question</p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[13px] font-semibold text-slate-600">See exact marks</span>
                          <button
                            role="switch"
                            aria-checked={showExactMarks}
                            aria-label="See exact marks"
                            onClick={() => setShowExactMarks((v) => !v)}
                            className={`flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ${focusRing} ${
                              showExactMarks ? 'bg-orange-500' : 'bg-slate-300'
                            }`}
                          >
                            <motion.span
                              animate={{ x: showExactMarks ? 16 : 0 }}
                              transition={spring}
                              className="block h-4 w-4 rounded-full bg-white shadow-sm"
                            />
                          </button>
                        </div>
                      </div>

                      <div className="mt-6 min-h-[3.5rem]">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={showExactMarks ? 'exact' : 'grade'}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                          >
                            {showExactMarks ? (
                              <p className="text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                                {feedback.marks}
                                <span className="ml-1.5 text-xl font-bold text-slate-400">/ {feedback.maxMarks}</span>
                              </p>
                            ) : (
                              <p className="text-4xl font-extrabold tracking-tight text-slate-900">{feedback.grade}</p>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {showExactMarks && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4 flex gap-1.5"
                          aria-hidden="true"
                        >
                          {Array.from({ length: feedback.maxMarks }).map((_, i) => (
                            <span
                              key={i}
                              className={`h-1.5 flex-1 rounded-full ${i < feedback.marks ? 'bg-orange-500' : 'bg-slate-200'}`}
                            />
                          ))}
                        </motion.div>
                      )}

                      <p className="mt-5 text-xs leading-relaxed text-slate-400">
                        Grades are indicative for a single question and are not official boundaries.
                      </p>
                    </motion.section>

                    {/* Feedback summary */}
                    <motion.section
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: 0.12 }}
                      className="rounded-xl border border-slate-200 bg-white p-6"
                    >
                      <h3 className="text-[15px] font-bold text-slate-900">Feedback summary</h3>
                      <p className="mt-3 text-[15px] leading-[1.65] tracking-[-0.01em] text-slate-600">{feedback.summary}</p>
                      {(feedback.caps?.length ?? 0) > 0 && (
                        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                          <p className="text-[13px] font-bold text-amber-900">Mark ceiling applied</p>
                          <ul className="mt-1.5 space-y-1 text-[13px] leading-snug text-amber-900">
                            {feedback.caps.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.section>

                    {/* Positives */}
                    <motion.section
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: 0.19 }}
                      className="rounded-xl border border-slate-200 bg-white p-6"
                    >
                      <h3 className="text-[15px] font-bold text-slate-900">Positives</h3>
                      {(feedback.positives?.length ?? 0) > 0 ? (
                        <ul className="mt-3 space-y-3">
                          {feedback.positives.map((pos, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-[15px] leading-[1.55] text-slate-600">
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <CheckIcon className="h-3 w-3" />
                              </span>
                              <span>{pos}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-[15px] text-slate-500">No creditworthy points were identified.</p>
                      )}
                    </motion.section>

                    {/* Suggestions */}
                    <motion.section
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: 0.26 }}
                      className="rounded-xl border border-slate-200 bg-white p-6"
                    >
                      <h3 className="text-[15px] font-bold text-slate-900">Suggestions</h3>

                      {feedback.suggestions?.map((sug, idx) => (
                        <div key={idx} className="mt-3">
                          <p className="text-[15px] leading-[1.65] tracking-[-0.01em] text-slate-600">{sug.description}</p>

                          <AnimatePresence initial={false}>
                            {showModel && sug.model && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50/50 p-4">
                                  <p className="text-[13px] font-bold text-orange-700">Upgraded model standard</p>
                                  <p className="mt-2 whitespace-pre-line text-[14px] leading-[1.65] text-slate-700">{sug.model}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}

                      <button
                        onClick={() => setShowModel((v) => !v)}
                        className={`mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-orange-500 bg-white py-2.5 text-sm font-bold text-orange-600 transition-colors hover:bg-orange-50 ${focusRing}`}
                      >
                        <SparkleIcon className="h-4 w-4" />
                        {showModel ? 'Hide model answer' : 'Show me'}
                      </button>
                    </motion.section>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Fixed action bar */}
        <AnimatePresence>
          {viewState === 'input' && (
            <motion.div
              key="action-bar"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={spring}
              className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur md:left-60"
            >
              <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-4 md:px-0">
                <p className="hidden text-[13px] text-slate-500 sm:block">
                  <span className="font-bold text-slate-700">{maxMarks} marks: </span>
                  {RUBRIC_HINT[maxMarks]}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStartMarking}
                  disabled={!essay.trim()}
                  className={`ml-auto flex cursor-pointer items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
                >
                  Mark essay
                  <ArrowRightIcon className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
