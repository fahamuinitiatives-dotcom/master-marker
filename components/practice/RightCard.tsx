'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RightCard({ isMarked }: { isMarked: boolean }) {
  const [activeTab, setActiveTab] = useState('Feedback');
  const tabs = ['Feedback', 'Suggestions', 'Tutor'];

  if (!isMarked) {
    return (
      <div className="bg-white/50 dark:bg-surface-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 h-full flex items-center justify-center p-8">
        <p className="text-slate-500 text-center">Submit your answer to see examiner feedback, grade estimation, and suggestions.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-t-[32px] lg:rounded-3xl shadow-xl lg:shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-[85vh] lg:h-full overflow-hidden">
      <div className="p-4 flex gap-2 bg-slate-50 dark:bg-surface-900 border-b border-slate-200 dark:border-slate-700 relative z-10" role="tablist">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`relative px-4 py-2 text-sm font-medium rounded-full z-10 transition-colors ${activeTab === tab ? 'text-subject' : 'text-slate-600'}`} role="tab" aria-selected={activeTab === tab}>
            {activeTab === tab && <motion.div layoutId="activeTab" className="absolute inset-0 bg-subject/10 rounded-full -z-10" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            {tab}
            {tab === 'Suggestions' && <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">3</span>}
          </button>
        ))}
      </div>
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'Feedback' && (
            <motion.div key="feedback" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="bg-gradient-to-br from-subject to-blue-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="text-xs font-bold tracking-wider opacity-80 mb-2">ESTIMATED GRADE</div>
                <div className="flex justify-between items-end">
                  <motion.div initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: 0.3, type: "spring" }} className="text-7xl font-black">B</motion.div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-white/20 px-3 py-1 rounded-lg">2.5 / 4</div>
                    <div className="text-sm mt-2 opacity-90">Level 2</div>
                  </div>
                </div>
                <div className="mt-6 h-2 bg-black/20 rounded-full overflow-hidden relative">
                  <motion.div initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }} className="absolute top-0 left-0 h-full bg-white rounded-full" />
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: -8, opacity: 1 }} transition={{ delay: 1.2, type: "spring" }} className="absolute left-[70%] top-0 w-1 h-4 bg-yellow-400" />
                </div>
                <p className="text-xs mt-3 opacity-80">Rough guide, boundaries change. Your goal is A.</p>
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <h3 className="font-bold mb-2">✨ Summary</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">You successfully identified substitutes. However, your second point confuses PED with PES (conflation).</p>
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                <details className="group" open>
                  <summary className="font-bold p-4 bg-slate-50 dark:bg-surface-900 cursor-pointer list-none flex justify-between">Score Breakdown <span>▼</span></summary>
                  <div className="p-4 text-sm border-t border-slate-200 dark:border-slate-700">Point 1 (Substitutes) - 2 marks.<br/>Point 2 (PES confusion) - 0.5 marks.</div>
                </details>
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                <details className="group">
                  <summary className="font-bold p-4 bg-slate-50 dark:bg-surface-900 cursor-pointer list-none flex justify-between">Model Answer Rewrite <span>▼</span></summary>
                  <div className="p-4 text-sm border-t border-slate-200 dark:border-slate-700 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100">
                    <p><strong>Original:</strong> The supply takes time to adjust.</p>
                    <p><strong>Rewrite:</strong> In the short term, consumers are locked into habits. Over time, they find alternatives, making demand more price elastic.</p>
                    <p className="text-xs mt-2 opacity-70">Reason: Addressed the conflation tag by switching focus from producer supply (PES) to consumer habit (PED).</p>
                  </div>
                </details>
              </div>
            </motion.div>
          )}
          {activeTab === 'Tutor' && (
            <motion.div key="tutor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
              <div className="flex-1 bg-slate-50 dark:bg-surface-900 rounded-xl p-4 mb-4 text-sm">
                <p className="mb-2"><strong>Tutor:</strong> I noticed you mentioned supply side issues in a demand question. Why do you think time affects a *consumer's* choice, rather than a firm's?</p>
              </div>
              <input type="text" className="w-full border rounded-full px-4 py-2 text-sm" placeholder="Reply to tutor..." />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}