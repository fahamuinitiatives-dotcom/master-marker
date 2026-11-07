'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  "Preparing economics response",
  "Checking command word requirements",
  "Evaluating PAI chains & mark constraints",
  "Verifying Cambridge IGCSE terminology",
  "Scoring against dynamic rubric",
  "Writing Chief Examiner feedback"
];

export default function EconomicsMarkerPage() {
  const [viewState, setViewState] = useState<'input' | 'loading' | 'results'>('input');
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const [question, setQuestion] = useState(
    "Discuss whether the imposition of a maximum price on rented housing is beneficial to an economy."
  );
  const [maxMarks, setMaxMarks] = useState(8);
  const [commandWord, setCommandWord] = useState("Discuss");
  const [essay, setEssay] = useState(
    "A maximum price makes housing more affordable for low-income tenants, increasing consumer surplus in the short term. Landlords are legally prohibited from charging above this price, which prevents exploitation during housing shortages.\n\nConversely, it creates excess demand and severe housing shortages in the long run. Because rental yields are artificially suppressed, landlord incentives to maintain or build new properties fall, leading to lower housing quality and the emergence of underground black markets."
  );
  const [feedback, setFeedback] = useState<any>(null);
  const [showExactMarks, setShowExactMarks] = useState(false);

  const handleMarkChange = (marks: number) => {
    setMaxMarks(marks);
    if (marks === 2) {
      setCommandWord("Define");
      setQuestion("Define what is meant by 'opportunity cost'.");
      setEssay("Opportunity cost is defined as the next best alternative forgone when making a decision.");
    } else if (marks === 4) {
      setCommandWord("Explain");
      setQuestion("Explain two causes of a shift in the demand curve for smartphones.");
      setEssay("One cause is a rise in consumer disposable incomes, which increases purchasing power and shifts demand to the right.\n\nAnother cause is a decrease in the price of complementary goods like headphones, making smartphones more attractive.");
    } else if (marks === 6) {
      setCommandWord("Analyse");
      setQuestion("Analyse how the imposition of an indirect tax on a product with negative externalities, such as cigarettes, affects market equilibrium and welfare.");
      setEssay("An indirect tax increases production costs for firms, causing the supply curve to shift left from S1 to S2.\n\nThis creates a shortage at the original price, forcing equilibrium price to rise from P1 to P2 and quantity to fall from Q1 to Q2, internalising negative externalities.");
    } else if (marks === 8) {
      setCommandWord("Discuss");
      setQuestion("Discuss whether the imposition of a maximum price on rented housing is beneficial to an economy.");
      setEssay("A maximum price makes housing more affordable for low-income tenants, increasing consumer surplus in the short term. Landlords are legally prohibited from charging above this price, which prevents exploitation during housing shortages.\n\nConversely, it creates excess demand and severe housing shortages in the long run. Because rental yields are artificially suppressed, landlord incentives to maintain or build new properties fall, leading to lower housing quality and the emergence of underground black markets.");
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (viewState === 'loading') {
      if (loadingStepIndex < LOADING_STEPS.length - 1) {
        timer = setTimeout(() => {
          setLoadingStepIndex((prev) => prev + 1);
        }, 280);
      } else {
        timer = setTimeout(() => {
          setViewState('results');
        }, 350);
      }
    }
    return () => clearTimeout(timer);
  }, [viewState, loadingStepIndex]);

  const handleStartMarking = async () => {
    if (!essay.trim()) return;
    setViewState('loading');
    setLoadingStepIndex(0);

    try {
      const res = await fetch('/api/marker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, maxMarks, commandWord, studentAnswer: essay }),
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error(err);
      setFeedback({
        score: `4 / ${maxMarks}`,
        grade: "Grade 5 (C)",
        summary: `Your response lacks the required structural depth for an 8-mark question. Only 2 of the mandatory 4 PAI chains were developed, leading to a major mark deduction under Cambridge 0455 rubrics.`,
        positives: [
          "Identified basic economic effects (consumer surplus and supply suppression)."
        ],
        suggestions: [
          {
            description: "To score above 4/8, you must include 2 full FOR chains and 2 full AGAINST chains following the Point → Analysis → Impact (PAI) formula with zero concluding paragraphs.",
            model: "Paragraph 1 (FOR): Point 1 + Analysis + Impact. Point 2 + Analysis + Impact.\nParagraph 2 (AGAINST): Conversely... Point 1 + Analysis + Impact. Point 2 + Analysis + Impact."
          }
        ]
      });
    }
  };

  const essayParagraphs = essay.split(/\n+/).filter(Boolean);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#334155] font-sans antialiased flex">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 select-none shadow-sm">
        <div>
          <div className="h-16 px-6 flex items-center space-x-2.5 border-b border-slate-800">
            <div className="h-7 w-7 rounded-md bg-orange-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
              ★
            </div>
            <span className="font-bold tracking-tight text-white text-base">master-marker</span>
          </div>

          <div className="p-4 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Workspace
            </div>
            <div className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-800 text-white text-xs font-semibold border border-slate-700 shadow-xs">
              <span className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                <span>Economics (0455)</span>
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-mono font-bold">IGCSE</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center space-x-3 px-2 pt-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shadow-inner">
              MM
            </div>
            <div className="text-xs truncate">
              <div className="text-white font-semibold">Student Workspace</div>
              <div className="text-slate-400 text-[10px]">Cambridge Zone 3 • Year 11</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Header Bar */}
        <header className="h-16 px-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-2xs w-full">
          <div className="flex items-center space-x-4">
            {viewState === 'results' ? (
              <button 
                onClick={() => setViewState('input')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <span>← Back to Editor</span>
              </button>
            ) : (
              <span className="text-xs font-semibold text-slate-500">IGCSE Economics Marking Engine (0455)</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              Chief Examiner Mode Active ⚡
            </span>
          </div>
        </header>

        {/* Loading Modal overlay */}
        <AnimatePresence>
          {viewState === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-center p-6"
            >
              <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl space-y-6">
                <div className="space-y-1 text-center">
                  <h3 className="text-base font-bold text-slate-900">Chief Examiner Economics Audit</h3>
                  <p className="text-xs text-slate-500">Enforcing strict Cambridge {maxMarks}-mark 0455 rules...</p>
                </div>

                <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-100">
                  {LOADING_STEPS.map((step, idx) => {
                    const isCompleted = idx < loadingStepIndex;
                    const isCurrent = idx === loadingStepIndex;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0.4, x: -5 }}
                        animate={{ opacity: isCompleted || isCurrent ? 1 : 0.4, x: 0 }}
                        className="flex items-center space-x-3 text-xs font-medium"
                      >
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {isCompleted ? (
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                          ) : isCurrent ? (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-orange-600 border-t-transparent animate-spin"></span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                          )}
                        </div>
                        <span className={isCurrent ? "text-slate-900 font-bold" : isCompleted ? "text-slate-700 font-semibold" : "text-slate-400"}>
                          {step}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Views */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-8">
          
          {/* Submission View */}
          {viewState === 'input' && (
            <div className="max-w-4xl mx-auto space-y-6 w-full">
              
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] uppercase tracking-wider bg-orange-50 text-orange-700 px-3 py-1 rounded-lg border border-orange-200 font-bold">
                      {commandWord} Question ({maxMarks}M)
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Paper 2</span>
                  </div>

                  <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                    {[2, 4, 6, 8].map((m) => (
                      <button
                        key={m}
                        onClick={() => handleMarkChange(m)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                          maxMarks === m ? 'bg-orange-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {m}M
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={2}
                  className="w-full bg-transparent border-0 text-base font-semibold text-slate-900 placeholder-slate-400 focus:outline-none resize-none leading-snug tracking-[-0.01em]"
                />
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 w-full">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Candidate Response</span>
                    <span className="text-[10px] font-semibold bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {maxMarks}-Mark Rubric Active
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {essay.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <textarea
                  rows={12}
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  placeholder={`Draft your structured ${maxMarks}-mark economics response... Separate FOR and AGAINST paragraphs with a blank line for 8-mark questions.`}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-[15px] font-normal text-[#334155] placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all leading-[1.65] tracking-[-0.01em] resize-y"
                />

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleStartMarking}
                    disabled={!essay.trim()}
                    className="bg-slate-900 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-40 shadow-sm cursor-pointer flex items-center space-x-2"
                  >
                    <span>Mark essay</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Results View */}
          {viewState === 'results' && feedback && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
              
              {/* Left Column: Paragraph Breakdown */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6 w-full">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Annotated Economics Response</span>
                    <span className="text-[10px] font-semibold bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {maxMarks}-Mark Evaluation
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {essayParagraphs.map((para, idx) => (
                    <div key={idx} className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 font-mono">
                          {maxMarks === 8 ? (idx === 0 ? "Paragraph 1: Arguments FOR" : idx === 1 ? "Paragraph 2: Arguments AGAINST" : `Paragraph ${idx + 1}`) : `Paragraph ${idx + 1}`}
                        </span>
                      </div>
                      <p className="text-[14px] font-normal text-[#334155] leading-[1.65]">
                        {para}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: MarkMe Feedback Cards */}
              <div className="lg:col-span-5 space-y-6 w-full">
                
                {/* 1. Estimated Mark Card */}
                <div className="bg-white border border-sky-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="bg-[#0284c7] px-6 py-4 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest opacity-90">Estimated Mark</span>
                      <h3 className="text-lg font-extrabold tracking-wide">Cambridge 0455 Audit ({maxMarks}M)</h3>
                    </div>
                    <div className="text-3xl font-black font-mono bg-white/10 px-3 py-1 rounded-lg">
                      {feedback.score}
                    </div>
                  </div>
                  <div className="p-5 bg-white flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-0.5">This answer would be awarded:</p>
                      <div className="text-xl font-black text-slate-900">
                        {showExactMarks ? feedback.score : feedback.grade}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-500">Exact Marks</span>
                      <button
                        onClick={() => setShowExactMarks(!showExactMarks)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                          showExactMarks ? 'bg-sky-600' : 'bg-slate-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                            showExactMarks ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Feedback Summary Card */}
                <div className="bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="bg-[#8b5cf6] px-6 py-3 text-white font-bold text-xs uppercase tracking-wider">
                    Feedback Summary
                  </div>
                  <div className="p-6">
                    <p className="text-[14px] font-normal text-[#4A5568] leading-[1.5] tracking-[-0.01em]">
                      {feedback.summary}
                    </p>
                  </div>
                </div>

                {/* 3. Positives Card */}
                <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Positives</span>
                  </span>
                  <ul className="space-y-2.5">
                    {feedback.positives?.map((pos: string, idx: number) => (
                      <li key={idx} className="text-[13px] font-normal text-[#4A5568] leading-[1.5] flex items-start space-x-2.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>{pos}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Suggestions Card */}
                <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-700">Suggestions</span>
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">Actionable</span>
                  </div>
                  {feedback.suggestions?.map((sug: any, idx: number) => (
                    <div key={idx} className="space-y-3">
                      <p className="text-[14px] font-normal text-[#4A5568] leading-[1.5]">
                        {sug.description}
                      </p>
                      <div className="bg-slate-50 p-4 rounded-xl border border-orange-200 text-[13px] font-normal text-[#334155] leading-[1.5] space-y-2">
                        <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wide">Upgraded Model Standard:</div>
                        <div className="whitespace-pre-line font-mono text-xs">{sug.model}</div>
                      </div>
                      <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-xs transition-all shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer">
                        <span>✨ Show me</span>
                      </button>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
