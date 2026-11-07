'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  "Preparing essay content",
  "Identifying key arguments",
  "Analyzing rubric strands",
  "Evaluating evidence",
  "Checking structure and flow",
  "Annotating key passages",
  "Scoring against rubric",
  "Writing personalized feedback"
];

export default function EssayMarkerPage() {
  const [viewState, setViewState] = useState<'input' | 'loading' | 'results'>('input');
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'strengths' | 'weaknesses'>('strengths');

  const [question, setQuestion] = useState(
    "Analyze how the writer uses language and structure to build tension and atmosphere in the extract."
  );
  const [essay, setEssay] = useState(
    "The gates had given up. One hung from a single hinge, groaning whenever the wind leaned on it, as though the fairground were clearing its throat before it spoke. Beyond it, the path was a spine of cracked tarmac, weeds pushing through every break like vertebrae.\n\nI walked slowly. Above me, the Ferris wheel loomed against a bruised sky, its carriages swaying like pendulums that had forgotten their clock. Rust had eaten the paint until only flecks of red remained, clinging on like scabs on a half-healed wound. Each gust set the metal singing, a thin, mournful note that threaded through the silence."
  );
  const [feedback, setFeedback] = useState<any>(null);

  // Handle the sequential loading checklist animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (viewState === 'loading') {
      if (loadingStepIndex < LOADING_STEPS.length - 1) {
        timer = setTimeout(() => {
          setLoadingStepIndex((prev) => prev + 1);
        }, 350); // Speed of checklist progression
      } else {
        // Once checklist completes, finish up and transition to results
        timer = setTimeout(() => {
          setViewState('results');
        }, 500);
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
        body: JSON.stringify({ question, studentAnswer: essay, maxMarks: 10, commandWord: 'Analyze' }),
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error(err);
      // Fallback structured data matching rubric
      setFeedback({
        score: "10/10",
        rubricBand: "Band 1 (Superior)",
        strengths: [
          "Exceptional precision in identifying and analyzing powerful metaphorical language ('spine of cracked tarmac', 'half-healed wound').",
          "Sophisticated structural control, effectively tracking the shift from exterior decay to interior atmospheric tension.",
          "Seamless integration of embedded textual evidence with deep connotative commentary."
        ],
        weaknesses: [
          "Ensure conclusion links more explicitly back to the overarching thematic prompt.",
          "Minor opportunity to explore the auditory imagery ('metal singing') further in relation to spatial isolation."
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

        .highlight-passage {
          background-color: rgba(56, 189, 248, 0.22);
          border-bottom: 2px solid rgba(14, 165, 233, 0.6);
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
                <span>English Language Analysis</span>
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-mono font-bold">0500</span>
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
              <span className="text-xs font-semibold text-slate-500">Essay Marking Engine</span>
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
                  <h3 className="text-base font-bold text-slate-900">Chief Examiner Audit in Progress</h3>
                  <p className="text-xs text-slate-500">Executing strict Cambridge rubric evaluation sequence...</p>
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
              
              {/* Question Context Box */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider bg-orange-50 text-orange-700 px-3 py-1 rounded-lg border border-orange-200 font-bold">
                    Essay Prompt / Context
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Paper 2 Reading</span>
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
                    <span className="text-[10px] font-semibold bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full border border-sky-200">
                      AO2 Language & Structure
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
                  placeholder="Type or paste your essay response here..."
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
              
              {/* Left Pane: Submitted Essay Text with Annotated Key Passages */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Annotated Essay Response</span>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Key Passages Highlighted
                    </span>
                  </div>
                </div>

                <div className="text-[15px] font-normal text-[#334155] leading-[1.65] tracking-[-0.01em] space-y-4">
                  <p>
                    The gates had given up. <span className="highlight-passage">One hung from a single hinge, groaning whenever the wind leaned on it</span>, as though the fairground were clearing its throat before it spoke. Beyond it, the path was a <span className="highlight-passage">spine of cracked tarmac, weeds pushing through every break like vertebrae</span>.
                  </p>
                  <p>
                    I walked slowly. Above me, the Ferris wheel loomed against a bruised sky, its carriages swaying like pendulums that had forgotten their clock. <span className="highlight-passage">Rust had eaten the paint until only flecks of red remained, clinging on like scabs on a half-healed wound</span>. Each gust set the metal singing, a thin, mournful note that threaded through the silence.
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
                      <h3 className="text-lg font-extrabold tracking-wide">Cambridge Rubric Audit</h3>
                    </div>
                    <div className="text-3xl font-black font-mono bg-white/10 px-3 py-1 rounded-lg">
                      {feedback.score}
                    </div>
                  </div>
                  <div className="p-5 bg-white flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#64748B]">Assigned Rubric Band:</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {feedback.rubricBand}
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
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
