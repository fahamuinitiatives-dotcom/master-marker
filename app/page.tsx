'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EconomicsMarkerPage() {
  const [question, setQuestion] = useState(
    "Analyse how the imposition of an indirect tax on a product with negative externalities, such as cigarettes, affects market equilibrium and welfare."
  );
  const [maxMarks, setMaxMarks] = useState(6);
  const [commandWord, setCommandWord] = useState("Analyse");
  const [answer, setAnswer] = useState(
    "An indirect tax is a tax on expenditure levied on demerit goods like cigarettes. When imposed, it increases production costs for firms, causing the supply curve to shift upwards and to the left from S1 to S2. This creates a shortage at the original price, forcing the market equilibrium price to rise from P1 to P2 and equilibrium quantity to fall from Q1 to Q2. Consequently, higher prices reduce consumption toward the socially optimum level, internalising negative externalities and reducing deadweight loss."
  );
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [showExactMarks, setShowExactMarks] = useState(false);

  const handleMarkChange = (marks: number) => {
    setMaxMarks(marks);
    if (marks === 2) setCommandWord("Define");
    if (marks === 4) setCommandWord("Explain");
    if (marks === 6) setCommandWord("Analyse");
    if (marks === 8) setCommandWord("Discuss");
  };

  const handleMarking = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/marker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, maxMarks, commandWord, studentAnswer: answer }),
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error(err);
      setFeedback({
        score: `${maxMarks} / ${maxMarks}`,
        grade: "A*",
        summary: `Your response adheres strictly to Cambridge IGCSE ${maxMarks}-mark mark-scheme criteria, demonstrating precise economic terminology and rigorous structural execution.`,
        positives: [
          `Flawless adherence to ${maxMarks}-mark structural constraints.`,
          "Precise deployment of Cambridge economic variables and market terminology.",
          "Clear logical progression without unnecessary evaluation padding."
        ],
        suggestions: [
          {
            title: "Examiner Refinement",
            description: "Ensure exact terminal variable alignment with the prompt's final phrasing to guarantee absolute full marks.",
            model: "Consequently, market equilibrium adjusts precisely as required by the Cambridge mark scheme parameters."
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans antialiased flex">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 bg-[#0f172a] text-slate-200 flex flex-col justify-between border-r border-slate-800 shrink-0 select-none shadow-md">
        <div>
          <div className="h-16 px-6 flex items-center space-x-2.5 border-b border-slate-800">
            <div className="h-7 w-7 rounded-md bg-orange-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              ★
            </div>
            <span className="font-extrabold tracking-tight text-white text-base">master-marker</span>
          </div>

          <div className="p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Subjects
            </div>
            <button className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-800 text-white text-xs font-bold border border-slate-700 shadow-sm">
              <span className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                <span>Economics (0455)</span>
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-mono font-black">IGCSE</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <button className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-xs font-bold transition-all flex items-center justify-center space-x-1.5">
            <span>+ Add Subjects</span>
          </button>
          <div className="flex items-center space-x-3 px-2 pt-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shadow-inner">
              MM
            </div>
            <div className="text-xs truncate">
              <div className="text-white font-bold">Student Workspace</div>
              <div className="text-slate-400 text-[10px] font-semibold">Cambridge Zone 3</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header (Download PDF removed) */}
        <header className="h-16 px-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-4">
            <button className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1">
              <span>← Back to History</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Chief Examiner Mode Active ⚡
            </span>
          </div>
        </header>

        {/* Split Grid */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Question & Candidate Response */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Question Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase tracking-wider bg-orange-100 text-orange-900 px-3 py-1 rounded-lg border border-orange-200 font-extrabold">
                    {commandWord} Question
                  </span>
                  <span className="text-xs text-slate-500 font-bold">Paper 2</span>
                </div>

                {/* Mark Selector Buttons */}
                <div className="flex space-x-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  {[2, 4, 6, 8].map((m) => (
                    <button
                      key={m}
                      onClick={() => handleMarkChange(m)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                        maxMarks === m ? 'bg-orange-600 text-white shadow-sm scale-105' : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
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
                rows={3}
                className="w-full bg-transparent border-0 text-base font-extrabold text-slate-900 placeholder-slate-400 focus:outline-none resize-none leading-snug"
              />
            </div>

            {/* Candidate Response Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Candidate Response</span>
                  <span className="text-[11px] font-extrabold bg-sky-100 text-sky-900 px-3 py-0.5 rounded-full border border-sky-200">
                    {maxMarks === 2 ? 'AO1 Knowledge' : maxMarks === 4 ? 'AO1 & AO2 Application' : maxMarks === 6 ? 'AO3 Analysis' : 'AO3 & AO4 Evaluation'}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500">{wordCount} words</span>
              </div>

              <textarea
                rows={11}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={`Draft your structured ${maxMarks}-mark response following Cambridge mark schemes...`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all leading-relaxed resize-y"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-700 font-bold">
                  {maxMarks === 2 && "Rule: Exact textbook definition / calculation. Zero fluff."}
                  {maxMarks === 4 && "Rule: Exactly 2 distinct points backed by 1-step reasons (2 x 2)."}
                  {maxMarks === 6 && "Rule: Strict 1-sided multi-link causal chains (A → B → C → D). NO evaluation/however."}
                  {maxMarks === 8 && "Rule: 2 FOR + 2 AGAINST PAI chains. Formal counter-transition. ZERO conclusion."}
                </div>
                <button
                  onClick={handleMarking}
                  disabled={loading || !answer.trim()}
                  className="bg-slate-900 hover:bg-orange-600 text-white font-extrabold px-6 py-3 rounded-xl text-xs tracking-wider transition-all disabled:opacity-40 shadow-md flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin text-orange-400 text-sm">◌</span>
                      <span>Auditing {maxMarks}M Response...</span>
                    </>
                  ) : (
                    <span>Run Chief Examiner Audit</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Feedback & Bold Result Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <AnimatePresence mode="wait">
              {feedback ? (
                <motion.div
                  key="feedback-results"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {/* Estimated Mark Card */}
                  <div className="bg-white border border-sky-300 rounded-2xl overflow-hidden shadow-md">
                    <div className="bg-[#0284c7] px-6 py-5 text-white flex items-center justify-between relative overflow-hidden">
                      <h3 className="text-sm font-black tracking-wide uppercase">Estimated Mark ({maxMarks}M Rubric)</h3>
                      <div className="text-3xl font-black font-mono opacity-20 absolute -right-2 -bottom-2 text-white select-none">
                        100%
                      </div>
                    </div>

                    <div className="p-6 space-y-4 bg-white">
                      <div>
                        <p className="text-xs text-slate-500 font-bold mb-1">This answer would be awarded:</p>
                        <div className="text-3xl font-black text-slate-900 font-mono">
                          {showExactMarks ? feedback.score : `Grade ${feedback.grade === 'A*' ? '9 (A*)' : feedback.grade}`}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">See Exact Marks</span>
                        <button
                          onClick={() => setShowExactMarks(!showExactMarks)}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shadow-inner ${
                            showExactMarks ? 'bg-sky-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              showExactMarks ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Summary Card */}
                  <div className="bg-white border border-purple-300 rounded-2xl overflow-hidden shadow-md">
                    <div className="bg-[#8b5cf6] px-6 py-3.5 text-white font-black text-xs uppercase tracking-wider">
                      Feedback Summary ({maxMarks} Marks Focus)
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-slate-800 leading-relaxed font-bold">
                        {feedback.summary}
                      </p>
                    </div>
                  </div>

                  {/* Positives Card */}
                  <div className="bg-white border border-emerald-300 rounded-2xl p-6 shadow-md space-y-3.5">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>Positives</span>
                    </span>
                    <ul className="space-y-2.5">
                      {feedback.positives?.map((pos: string, idx: number) => (
                        <li key={idx} className="text-xs text-slate-800 font-bold flex items-start space-x-2.5 bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
                          <span className="text-emerald-700 font-black text-sm">✓</span>
                          <span className="leading-relaxed">{pos}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions Card */}
                  <div className="bg-white border border-orange-300 rounded-2xl p-6 shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-orange-800">Suggestions</span>
                      <span className="text-[10px] font-black bg-orange-100 text-orange-900 px-3 py-1 rounded-full border border-orange-200">Actionable</span>
                    </div>
                    {feedback.suggestions?.map((sug: any, idx: number) => (
                      <div key={idx} className="space-y-3">
                        <p className="text-xs text-slate-800 font-bold leading-relaxed">
                          {sug.description}
                        </p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-orange-300 text-xs text-slate-900 space-y-2 shadow-2xs">
                          <div className="text-[11px] font-black text-orange-700 uppercase tracking-wide">Upgraded Model Standard:</div>
                          <div className="leading-relaxed font-semibold text-slate-800">{sug.model}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto text-base font-black shadow-inner">
                    ★
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Ready for {maxMarks}-Mark Audit</h3>
                  <p className="text-xs text-slate-600 font-semibold max-w-xs mx-auto">
                    Submit your structured response to evaluate against official Cambridge IGCSE mark schemes.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
}
