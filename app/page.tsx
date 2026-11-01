'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [subject, setSubject] = useState('0455');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: string; feedback: string } | null>(null);

  const handleMark = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating Claude API response (Replace with your actual API endpoint call e.g., /api/mark)
    setTimeout(() => {
      setResult({
        score: "2 / 3",
        feedback: "Clear and concise explanation. To secure the final mark, ensure you explicitly define the core economic term or reference the mark scheme key point."
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center shadow-xs">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">🎯 IGCSE AI Marker</h1>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/practice" className="text-blue-600 hover:underline">Practice Hub</Link>
          <Link href="/dashboard" className="text-slate-600 hover:underline">Dashboard</Link>
          <Link href="/admin" className="text-slate-600 hover:underline">Admin</Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Instant Exam Paper Marker</h2>
          <p className="text-slate-600 mb-8">
            Select your syllabus subject, paste your practice question, and submit your answer for instant, mark-scheme-aligned AI feedback powered by Claude.
          </p>

          <form onSubmit={handleMark} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subject Selection</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="0455">Economics (0455)</option>
                <option value="0580">Mathematics Extended (0580)</option>
                <option value="0610">Biology (0610)</option>
                <option value="0500">First Language English (0500)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Question Text</label>
              <textarea 
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Explain one reason why a government might impose a maximum price on a good..."
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Answer</label>
              <textarea 
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type or paste your structured response here..."
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition duration-200 disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Evaluating with Claude AI...' : 'Submit for AI Marking'}
            </button>
          </form>

          {/* Results Display Box */}
          {result && (
            <div className="mt-8 p-6 bg-blue-50/50 border border-blue-100 rounded-xl animate-fadeIn">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Marking Assessment</h3>
              <div className="mb-3">
                <span className="text-sm font-medium text-slate-600">Awarded Score: </span>
                <span className="text-blue-600 font-bold text-lg">{result.score}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600 block mb-1">Examiner Feedback: </span>
                <p className="text-slate-700 bg-white p-4 rounded-lg border border-slate-200 text-sm leading-relaxed">
                  {result.feedback}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
