import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        subject: {
          light: 'var(--accent-light)',
          DEFAULT: 'var(--accent-main)',
          dark: 'var(--accent-dark)',
        },
        surface: { 50: '#f8fafc', 100: '#f1f5f9', 800: '#1e293b', 900: '#0f172a' }
      },
      borderRadius: { '2xl': '1.5rem', '3xl': '2rem' }
    },
  },
  plugins: [],
} satisfies Config

export default config
