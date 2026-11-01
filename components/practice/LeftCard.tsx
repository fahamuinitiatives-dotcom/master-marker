'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LeftCard({ subject, isMarked, onSubmit }: any) {
  const [answer, setAnswer] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [showOcr, setShowOcr] = useState(false);
  
  return (
    <div className="bg-white dark:bg-surface-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 lg:p-8 flex flex-col h-[75vh]">
      <div className="text-sm text-slate-500 mb-4 flex items-center gap-2">
        <span>IGCSE</span> &rsaquo; <span>{subject === '0455' ? 'Economics' : 'English'}</span> &rsaquo; <span className="font-medium text-slate-800 dark:text-slate-200">PED</span>
      </div>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold leading-tight">Explain two reasons why the price elasticity of demand for a product might change over time. <span className="text-slate-500 font-normal">[4 marks]</span></h2>
      </div>
      
      {!showOcr && (
        <button onClick={() => setShowOcr(true)} className="mb-2 text-sm text-subject border border-subject rounded-full px-4 py-1 self-start">Upload Handwriting (OCR)</button>
      )}

      {showOcr && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl mb-4 border border-yellow-200 dark:border-yellow-800">
          <p className="text-xs font-bold text-yellow-700 dark:text-yellow-500 mb-2">TRANSCRIPTION (Edit before submitting):</p>
          <textarea className="w-full bg-transparent text-sm resize-none h-20 outline-none" value={ocrText} onChange={(e) => setOcrText(e.target.value)} placeholder="Transcribed text appears here..." />
          <button onClick={() => { setAnswer(ocrText); setShowOcr(false); }} className="mt-2 text-xs bg-yellow-500 text-white px-3 py-1 rounded">Apply to Answer</button>
        </div>
      )}

      <textarea 
        className={`flex-1 w-full bg-surface-50 dark:bg-surface-900 rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-subject transition-all text-lg leading-[1.8] ${isMarked ? 'opacity-50 pointer-events-none' : ''}`}
        placeholder="Type your answer here..." value={answer} onChange={(e) => setAnswer(e.target.value)}
      />
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-slate-500">{answer.split(/\s+/).filter(w => w.length > 0).length} words</span>
        <button onClick={onSubmit} className="bg-subject text-white px-8 py-3 rounded-xl font-medium hover:scale-[0.98] transition-transform shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-subject">
          {isMarked ? 'Download improved answer' : 'Submit for marking'}
        </button>
      </div>
    </div>
  );
}