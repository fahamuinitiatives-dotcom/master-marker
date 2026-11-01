'use client';
import { motion } from 'framer-motion';
export default function TopNav({ subject, setSubject, currentMode }: any) {
  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-surface-800 border-b border-slate-200 dark:border-slate-700">
      <div className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">IGCSE Marker</div>
      <div className="flex gap-4">
        {['Practice', 'Notes', 'Dashboard'].map(mode => (
          <a key={mode} href={`/${mode.toLowerCase()}`} className={`font-medium ${currentMode === mode ? 'text-subject' : 'text-slate-500'}`}>{mode}</a>
        ))}
      </div>
      <select value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-slate-100 dark:bg-surface-900 rounded px-2 py-1">
        <option value="0455">Economics (0455)</option>
        <option value="0500">English (0500)</option>
      </select>
    </nav>
  );
}