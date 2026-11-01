'use client';
import { motion } from 'framer-motion';
import TopNav from '@/components/layout/TopNav';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <TopNav currentMode="Dashboard" />
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Progress Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white dark:bg-surface-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="font-bold mb-6">Average % per Topic</h2>
            <div className="space-y-4">
              {[{name: 'Market Systems', val: 75}, {name: 'PED', val: 40}, {name: 'Labour', val: 60}].map(topic => (
                <div key={topic.name}>
                  <div className="flex justify-between text-sm mb-1"><span>{topic.name}</span><span>{topic.val}%</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${topic.val}%` }} transition={{ duration: 0.7, ease: "easeOut" }} className={`h-2 rounded-full ${topic.val < 50 ? 'bg-red-400' : 'bg-subject'}`} />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-2 bg-slate-100 dark:bg-surface-900 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200">Retry Weakest Topic (PED)</button>
          </div>

          <div className="bg-white dark:bg-surface-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="font-bold mb-6">Most Frequent Mistakes</h2>
            <ul className="space-y-3">
              <li className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-200 rounded-xl text-sm"><span>skipped_link</span><span className="font-bold">12 times</span></li>
              <li className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/10 text-orange-800 dark:text-orange-200 rounded-xl text-sm"><span>conflation</span><span className="font-bold">8 times</span></li>
              <li className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 rounded-xl text-sm"><span>unsupported</span><span className="font-bold">5 times</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}