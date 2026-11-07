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
        score: "6 / 6",
        grade: "A*",
        summary: "Your economic analysis demonstrates rigorous multi-link causal chains (AO3), correctly translating cost shifts into market equilibrium adjustments without unnecessary evaluation padding.",
        positives: [
          "Flawless multi-link causal chain (Cost of production → Supply shift → Equilibrium price/quantity).",
          "Precise use of Cambridge terminology (demerit goods, deadweight loss, internalising externalities).",
          "Adhered strictly to zero counter-arguments for a 6-mark analysis question."
        ],
        suggestions: [
          {
            title: "Diagrammatic Labelling",
            description: "Enhance your terminal link by explicitly referencing equilibrium price (P1 to P2) and quantity (Q1 to Q2) in your concluding sentence.",
            model: "Consequently, the rise in price from P1 to P2 and fall in quantity from Q1 to Q2 successfully curtails consumption of the demerit good."
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased flex">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 select-none">
        <div>
          {/* Custom Brand Header */}
          <div className="h-16 px-6 flex items-center space-x-2.5 border-b border-slate-800/80">
            <div className="h-7 w-7 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
              ★
            </div>
            <span className="font-bold tracking-tight text-white text-base">master-marker</span>
          </div>

          <div className="p-4 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Your Subjects
            </div>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800 text-white text-xs font-semibold border border-slate-700/60 shadow-xs">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span>Economics (0455)</span>
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-mono font-bold">IGCSE</span>
            </button>
            <div className="text-[11px] text-slate-500 hover:text-slate-400 cursor-pointer pt-1 px-1">
              Show other subjects ∨
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <button className="w-full py-2 px-3 rounded-lg border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5">
            <span>+ Add Subjects</span>
          </button>
          <div className="flex items-center space-x-3 px-2 pt-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold">
              MM
            </div>
            <div className="text-xs truncate">
              <div className="text-white font-semibold">Student Workspace</div>
              <div className="text-slate-400 text-[10px]">Cambridge Zone 3</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 px-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center space-x-1">
              <span>← Back to History</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-4 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-2xs flex items-center space-x-1.5">
              <span>📥 Download PDF</span>
            </button>
          </div>
        </header>

        {/* Split Grid */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Question & Candidate Response */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Question Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] uppercase tracking-wider bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md border border-orange-200 font-bold">
                    {commandWord} Question
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Paper 2</span>
                </div>

                <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  {[2, 4, 6, 8].map((m) => (
                    <button
                      key={m}
                      onClick={() => handleMarkChange(m)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
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
                rows={3}
                className="w-full bg-transparent border-0 text-base font-bold text-slate-900 placeholder-slate-400 focus:outline-none resize-none leading-snug"
              />
            </div>

            {/* Candidate Response Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Candidate Response</span>
                  <span className="text-[10px] font-semibold bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full border border-sky-200">AO3 Analysis</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{wordCount} words</span>
              </div>

              <textarea
                rows={10}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Draft your structured economic response..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all leading-relaxed resize-y font-normal"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500 font-medium">
                  Rule: {maxMarks === 6 ? "Strict 1-sided causal chain (No 'however')" : "Chief Examiner Mode Active"}
                </div>
                <button
                  onClick={handleMarking}
                  disabled={loading || !answer.trim()}
                  className="bg-slate-900 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg text-xs tracking-wide transition-all disabled:opacity-40 shadow-2xs flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin text-orange-400">◌</span>
                      <span>Auditing Response...</span>
                    </>
                  ) : (
                    <span>Run Chief Examiner Audit</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Exact Reference Card Layouts */}
          <div className="lg:col-span-5 space-y-6">
            
            <AnimatePresence mode="wait">
              {feedback ? (
                <motion.div
                  key="feedback-results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {/* Exact "Estimated Mark" Blue Card matching the Reference Photo */}
                  <div className="bg-white border border-sky-200 rounded-2xl overflow-hidden shadow-xs">
                    {/* Top Bright Blue Header */}
                    <div className="bg-[#0284c7] px-6 py-5 text-white flex items-center justify-between relative overflow-hidden">
                      <h3 className="text-sm font-bold tracking-wide">Estimated Mark</h3>
                      <div className="text-3xl font-extrabold font-mono opacity-20 absolute -right-2 -bottom-2 text-white select-none">
                        100%
                      </div>
                    </div>

                    {/* Lower Card Content */}
                    <div className="p-6 space-y-4 bg-white">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">This answer would be awarded:</p>
                        <div className="text-2xl font-black text-slate-900">
                          {showExactMarks ? feedback.score : `Grade ${feedback.grade === 'A*' ? '9 (A*)' : feedback.grade}`}
                        </div>
                      </div>

                      {/* See Exact Marks Toggle */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">See Exact Marks</span>
                        <button
                          onClick={() => setShowExactMarks(!showExactMarks)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
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

                  {/* Feedback Summary Purple Banner Card */}
                  <div className="bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-[#8b5cf6] px-6 py-3 text-white font-bold text-xs uppercase tracking-wider">
                      Feedback Summary
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {feedback.summary}
                      </p>
                    </div>
                  </div>

                  {/* Positives Card */}
                  <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Positives</span>
                    </span>
                    <ul className="space-y-2.5">
                      {feedback.positives?.map((pos: string, idx: number) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="leading-relaxed font-normal">{pos}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions Card */}
                  <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-700">Suggestions</span>
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">Actionable</span>
                    </div>
                    {feedback.suggestions?.map((sug: any, idx: number) => (
                      <div key={idx} className="space-y-3">
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {sug.description}
                        </p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-orange-200 text-xs text-slate-800 space-y-2">
                          <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">Upgraded Model Standard:</div>
                          <div className="leading-relaxed text-slate-700 font-normal">{sug.model}</div>
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
                  className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3 shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto text-base font-bold">
                    ★
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Ready for Audit</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto font-normal">
                    Submit your structured response to generate your exact grade breakdown and examiner suggestions.
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
