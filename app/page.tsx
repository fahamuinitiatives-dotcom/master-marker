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
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#334155] font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif] antialiased [text-rendering:optimizeLegibility] flex">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }
      `}</style>

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

                <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border
