import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IGCSE Marker',
  description: 'Strict, examiner-style marking for Cambridge IGCSE 0455 and 0500.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface-50 dark:bg-surface-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}