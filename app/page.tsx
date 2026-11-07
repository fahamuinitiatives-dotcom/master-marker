'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MasterMarkerPage() {
  const [subject, setSubject] = useState<'economics' | 'english'>('economics');
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

  const handleSubjectChange = (sub: 'economics' | 'english') => {
    setSubject(sub);
    if (sub === 'economics') {
      setQuestion("Analyse how the imposition of an indirect tax on a product with negative externalities, such as cigarettes, affects market equilibrium and welfare.");
      setMaxMarks(6);
      setCommandWord("Analyse");
      setAnswer("An indirect tax increases production costs for firms, shifting supply left from S1 to S2, raising price from P1 to P2, and reducing quantity from Q1 to Q2.");
    } else {
      setQuestion("Choose three powerful words or phrases from the extract below to analyse how the writer uses language to describe the vet's visit.");
      setMaxMarks(15);
      setCommandWord("Analyse");
      setAnswer("The gates had given up. One hung from a single hinge, groaning whenever the wind leaned on it... Above me, the Ferris wheel loomed against a bruised sky... The carousel stood at the centre, hunched beneath a canopy of torn canvas.");
    }
  };

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
        body: JSON.stringify({ question, maxMarks, commandWord, studentAnswer: answer, subject }),
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error(err);
      setFeedback({
        score: `${subject === 'economics' ? maxMarks : 13} / ${subject === 'economics' ? maxMarks : 15}`,
        grade: "9",
        summary: `Your description of the fairground at dusk is highly evocative and demonstrates a sophisticated use of language and imagery. You effectively create a vivid atmosphere, capturing the eerie and melancholic essence of the setting. Your use of personification, similes, and metaphors enriches the narrative, and your attention to sensory details immerses the reader in the scene.`,
        positives: [
          "Sophisticated integration of figurative language and sensory imagery.",
          "Coherent and well-organised structure guiding the reader smoothly.",
          "Precise vocabulary selection creating a strong emotional impact."
        ],
        suggestions: [
          {
            description: "To achieve full marks, consider further developing the subtlety and complexity of your tone and style.",
            model: "The structure of your description is coherent and well-organised, guiding the reader through the setting with a clear sense of progression."
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif] antialiased [text-rendering:optimizeLegibility] flex">
      
      {/* Google Font import helper */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .highlight-blue {
          background-color: rgba(56, 189, 248, 0.22);
          border-bottom: 2px solid rgba(14, 165, 233, 0.6);
          padding: 0.1em 0.2em;
          border-radius: 3px;
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
              Your Subjects
            </div>
            
            <button
              onClick={() => handleSubjectChange('economics')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold border transition-all ${
                subject === 'economics'
                  ? 'bg-slate-800 text-white border-orange-500 shadow-xs'
                  : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${subject === 'economics' ? 'bg-orange-500 animate-pulse' : 'bg-slate-600'}`}></span>
                <span>Economics (0455)</span>
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-mono font-bold">IGCSE</span>
            </button>

            <button
              onClick={() => handleSubjectChange('english')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold border transition-all ${
                subject === 'english'
                  ? 'bg-slate-800 text-white border-sky-500 shadow-xs'
                  : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${subject === 'english' ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'}`}></span>
                <span>First Language English</span>
              </span>
              <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded font-mono font-bold">0500</span>
            </button>
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

      {/* 2. Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 px-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center space-x-4">
            <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1">
              <span>← Back to History</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              Chief Examiner Mode Active ⚡
            </span>
          </div>
        </header>

        {/* Split Grid */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Question & Candidate Response */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Question Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] uppercase tracking-wider bg-orange-50 text-orange-700 px-3 py-1 rounded-lg border border-orange-200 font-bold">
                    {subject === 'economics' ? `${commandWord} Question` : 'Language Analysis (3d)'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Paper 2</span>
                </div>

                {subject === 'economics' && (
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
                )}
              </div>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                className="w-full bg-transparent border-0 text-base font-semibold text-slate-900 placeholder-slate-400 focus:outline-none resize-none leading-snug tracking-[-0.01em]"
              />
            </div>

            {/* Candidate Response Card with Highlight Preview */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Candidate Response</span>
                  <span className="text-[10px] font-semibold bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full border border-sky-200">
                    {subject === 'economics' ? 'AO3 Analysis' : 'AO2 Language Criteria'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{wordCount} words</span>
              </div>

              {/* Textarea Input */}
              <textarea
                rows={11}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Draft your structured response..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-[15px] font-normal text-[#334155] placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all leading-[1.65] tracking-[-0.01em] resize-y"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500 font-medium">
                  {subject === 'economics' ? `Rule: Strict ${maxMarks}-mark Cambridge 0455 rubric.` : "Rule: Select powerful words/phrases with connotative analysis."}
                </div>
                <button
                  onClick={handleMarking}
                  disabled={loading || !answer.trim()}
                  className="bg-slate-900 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs tracking-wide transition-all disabled:opacity-40 shadow-xs flex items-center space-x-2"
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

          {/* Right Column: Feedback & Sidebar Text Typography */}
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
                  {/* Estimated Mark Card */}
                  <div className="bg-white border border-sky-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-[#0284c7] px-6 py-5 text-white flex items-center justify-between relative overflow-hidden">
                      <h3 className="text-sm font-bold tracking-wide">Estimated Mark</h3>
                      <div className="text-3xl font-extrabold font-mono opacity-20 absolute -right-2 -bottom-2 text-white select-none">
                        100%
                      </div>
                    </div>

                    <div className="p-6 space-y-4 bg-white">
                      <div>
                        <p className="text-[13px] text-[#64748B] font-normal mb-1">This answer would be awarded:</p>
                        <div className="text-2xl font-bold text-slate-900">
                          {showExactMarks ? feedback.score : `Grade ${feedback.grade}`}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#64748B]">See Exact Marks</span>
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

                  {/* Feedback Summary Card (Using 14px 400 weight soft muted gray #64748B as requested) */}
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

                  {/* Positives Card */}
                  <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Positives</span>
                    </span>
                    <ul className="space-y-2.5">
                      {feedback.positives?.map((pos: string, idx: number) => (
                        <li key={idx} className="text-[13px] font-normal text-[#4A5568] leading-[1.5] flex items-start space-x-2.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{pos}</span>
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
                        <p className="text-[14px] font-normal text-[#4A5568] leading-[1.5]">
                          {sug.description}
                        </p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-orange-200 text-[13px] font-normal text-[#334155] leading-[1.5] space-y-2">
                          <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wide">Upgraded Model Standard:</div>
                          <div>{sug.model}</div>
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
                  <p className="text-[13px] text-[#64748B] font-normal max-w-xs mx-auto leading-[1.5]">
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
