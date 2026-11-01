'use client';

import { useState } from 'react';

export default function Home() {
  const [subject, setSubject] = useState('Economics (0455)');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFeedback('');

    try {
      const res = await fetch('/api/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, question, answer }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate evaluation.');
      }

      setFeedback(data.feedback);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="text-center space-y-2 border-b border-slate-800 pb-6">
          <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/20">
            Cambridge IGCSE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            IGCSE AI Marker & Evaluator
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Get instant mark-scheme evaluations, detailed examiner feedback, and full-mark model candidate answers.
          </p>
        </header>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 shadow-xl space-y-5 backdrop-blur-sm">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Syllabus Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="Economics (0455)">Economics (0455)</option>
              <option value="Biology (0610)">Biology (0610)</option>
              <option value="Chemistry (0620)">Chemistry (0620)</option>
              <option value="Physics (0625)">Physics (0625)</option>
              <option value="First Language English (0500)">First Language English (0500)</option>
              <option value="Global Perspectives (0457)">Global Perspectives (0457)</option>
              <option value="ICT (0417)">ICT (0417)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Exam Question
            </label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Paste the exam question here (e.g. Analyse how an increase in indirect tax on cigarettes can affect market outcomes. [6])"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Your Student Answer
            </label>
            <textarea
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write or paste your answer here..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 text-white font-medium rounded-lg shadow-lg transition duration-150 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Evaluating with Groq AI...
              </>
            ) : (
              'Submit for Examiner Marking'
            )}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Feedback Section */}
        {feedback && (
          <section className="bg-slate-800/90 border border-indigo-500/30 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📋</span> Examiner Evaluation
              </h2>
              <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Groq 120B Verified
              </span>
            </div>

            {/* Formatted Output Box */}
            <div className="whitespace-pre-wrap text-slate-200 text-sm sm:text-base leading-relaxed space-y-3 font-sans">
              {feedback}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
