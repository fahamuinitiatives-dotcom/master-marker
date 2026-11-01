'use client';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import LeftCard from '@/components/practice/LeftCard';
import RightCard from '@/components/practice/RightCard';
import TopNav from '@/components/layout/TopNav';

export default function PracticeView() {
  const [isMarked, setIsMarked] = useState(false);
  const [subject, setSubject] = useState<'0455' | '0500'>('0455');
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: prefersReducedMotion ? 0 : 0.06 } }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { type: 'tween', duration: 0.35, ease: 'easeOut' } }
  };

  return (
    <div className={`min-h-screen ${subject === '0500' ? 'theme-english' : ''}`}>
      <TopNav subject={subject} setSubject={setSubject} currentMode="Practice" />
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-8">
        <motion.div variants={cardVariants}><LeftCard subject={subject} isMarked={isMarked} onSubmit={() => setIsMarked(true)} /></motion.div>
        <motion.div variants={cardVariants} className="max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:z-50"><RightCard isMarked={isMarked} /></motion.div>
      </motion.div>
    </div>
  );
}