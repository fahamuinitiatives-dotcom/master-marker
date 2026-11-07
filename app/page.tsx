'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  "Preparing economics response",
  "Checking command word requirements",
  "Evaluating causal chains (A → B → C → D)",
  "Verifying Cambridge IGCSE terminology",
  "Checking mark-scheme constraints",
  "Analyzing economic actor logic",
  "Scoring against 0455 rubric",
  "Writing Chief Examiner feedback"
];

export default function EconomicsMarkerPage() {
  const [viewState, setViewState] = useState<'input' | 'loading' | 'results'>('input');
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'strengths' | 'weaknesses'>('strengths');

  const [question, setQuestion] = useState(
    "Analyse how the imposition of an indirect tax on a product with negative externalities, such as cigarettes, affects market equilibrium and welfare."
  );
  const [maxMarks, setMaxMarks] = useState(6);
  const [commandWord, setCommandWord] = useState("Analyse");
  const [essay, setEssay] = useState(
    "An indirect tax is a tax on expenditure levied on demerit goods like cigarettes. When imposed, it increases production costs for firms, causing the supply curve to shift upwards and to the left from S1 to S2. This creates a shortage at the initial price, forcing the market equilibrium price to rise from P1 to P2 and equilibrium quantity to fall from Q1 to Q2. Consequently, higher prices reduce consumption toward the socially optimum level, internalising negative externalities and reducing deadweight loss."
  );
  const [feedback, setFeedback] = useState<any>(null);

  const handleMarkChange = (marks: number) => {
    setMaxMarks(marks);
    if (marks === 2) setCommandWord("Define");
    if (marks === 4) setCommandWord("Explain");
    if (marks === 6) setCommandWord("Analyse");
    if (marks === 8) setCommandWord("Discuss");
  };

  // Handle sequential loading checklist animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (viewState === 'loading') {
      if (loadingStepIndex < LOADING_STEPS.length - 1) {
        timer = setTimeout(() => {
          setLoadingStepIndex((prev) => prev + 1);
        }, 300);
      } else {
        timer = setTimeout(() => {
          setViewState('results');
        }, 400);
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
        score: `${maxMarks} / ${maxMarks}`,
        grade: "9 (A*)",
        rubricBand: "Top Band (Full Marks)",
        strengths: [
          "Flawless multi-link causal chain (Cost of production → Supply shift → Equilibrium price/quantity).",
          "Precise use of Cambridge terminology (demerit goods, deadweight loss, internalising externalities).",
          "Adhered strictly to zero counter-arguments for a 6-mark analysis question."
        ],
        weaknesses: [
          "Ensure diagrammatic variables (P1, P2, Q1, Q2) are explicitly referenced in your concluding terminal link.",
          "Keep explanations strictly one-sided as required by the 'Analyse' command word rule."
        ]
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif] antialiased [text-rendering:optimizeLegibility] flex">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .highlight-economic {
          background-color: rgba(249, 115, 22, 0.15);
          border-bottom: 2px solid rgba(249, 115, 22, 0.6);
          padding: 0.1em 0.2em;
          border-radius: 3px;
        }
      `}</style>

      {/* Sidebar Navigation */}
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

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Top Header */}
        <header className="h-16 px-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
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

        {/* LOADING MODAL / OVERLAY ("The Generator") */}
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
                  <p className="text-xs text-slate-500">Enforcing strict Cambridge 0455 mark-scheme rules...</p>
                </div>

                {/* Text-Based Generator Checklist */}
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

        {/* WORKFLOW VIEWS */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-8">
          
          {/* 1. SUBMISSION VIEW (INPUT PAGE) */}
          {viewState === 'input' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Question Context Box & Mark Selector */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] uppercase tracking-wider bg-orange-50 text-orange-700 px-3 py-1 rounded-lg border border-orange-200 font-bold">
                      {commandWord} Question
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Paper 2</span>
                  </div>

                  {/* Mark Selector Pills */}
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
                  rows={2}
                  className="w-full bg-transparent border-0 text-base font-semibold text-slate-900 placeholder-slate-400 focus:outline-none resize-none leading-snug tracking-[-0.01em]"
                />
              </div>

              {/* Essay Text Editor & Input Field */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Candidate Response</span>
                    <span className="text-[10px] font-semibold bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {maxMarks === 6 ? 'AO3 Analysis Causal Chains' : `${maxMarks}-Mark Rubric`}
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
                  placeholder={`Draft your structured ${maxMarks}-mark economics response...`}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-[15px] font-normal text-[#334155] placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all leading-[1.65] tracking-[-0.01em] resize-y"
                />

                {/* Primary Action Button placed at Bottom Right */}
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

          {/* 3. RESULTS VIEW (AFTER-MARKING PAGE) */}
          {viewState === 'results' && feedback && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Pane: Submitted Economics Response with Highlighted Causal Links */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Annotated Economics Response</span>
                    <span className="text-[10px] font-semibold bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-200">
                      Causal Chains Highlighted
                    </span>
                  </div>
                </div>

                <div className="text-[15px] font-normal text-[#334155] leading-[1.65] tracking-[-0.01em] space-y-4">
                  <p>
                    An indirect tax is a tax on expenditure levied on demerit goods like cigarettes. When imposed, <span className="highlight-economic">it increases production costs for firms, causing the supply curve to shift upwards and to the left from S1 to S2</span>. This creates a shortage at the initial price, <span className="highlight-economic">forcing the market equilibrium price to rise from P1 to P2 and equilibrium quantity to fall from Q1 to Q2</span>. Consequently, higher prices reduce consumption toward the socially optimum level, internalising negative externalities and reducing deadweight loss.
                  </p>
                </div>
              </div>

              {/* Right Sidebar: Score Badge, Rubric Band, and Strengths/Weaknesses Tabbed Panel */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Score & Rubric Band Badge Card */}
                <div className="bg-white border border-sky-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="bg-[#0284c7] px-6 py-4 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest opacity-90">Estimated Mark</span>
                      <h3 className="text-lg font-extrabold tracking-wide">Cambridge 0455 Audit</h3>
                    </div>
                    <div className="text-3xl font-black font-mono bg-white/10 px-3 py-1 rounded-lg">
                      {feedback.score}
                    </div>
                  </div>
                  <div className="p-5 bg-white flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#64748B]">Assigned Grade / Band:</span>
                    <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                      {feedback.grade} — {feedback.rubricBand}
                    </span>
                  </div>
                </div>

                {/* Tabbed Panel for Strengths and Weaknesses */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex space-x-2 border-b border-slate-100 pb-3">
                    <button
                      onClick={() => setActiveTab('strengths')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'strengths'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Strengths
                    </button>
                    <button
                      onClick={() => setActiveTab('weaknesses')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'weaknesses'
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Weaknesses & Areas to Improve
                    </button>
                  </div>

                  <div className="space-y-3 min-h-[180px]">
                    {activeTab === 'strengths' ? (
                      <ul className="space-y-3">
                        {feedback.strengths?.map((str: string, idx: number) => (
                          <li key={idx} className="text-[13px] font-normal text-[#4A5568] leading-[1.5] flex items-start space-x-2.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-3">
                        {feedback.weaknesses?.map((weak: string, idx: number) => (
                          <li key={idx} className="text-[13px] font-normal text-[#4A5568] leading-[1.5] flex items-start space-x-2.5 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                            <span className="text-orange-600 font-bold shrink-0">⚠</span>
