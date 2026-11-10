// tailwind.config.ts – Tailwind CSS configuration for the JDM Engine e‑commerce site
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class', // use class strategy for dark theme
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Charcoal background and racing accent (red). Change to orange if preferred.
        background: '#111111',
        accent: '#e63946',
        // Additional muted palette for UI elements
        muted: '#2d2d2d',
        surface: '#1e1e1e',
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        heading: ['var(--font-heading)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
        'type-h1': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', fontWeight: '800', letterSpacing: '0.03em' }],
        'type-h2': ['clamp(1.875rem, 3vw, 3rem)', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '0.03em' }],
        'type-h3': ['clamp(1.25rem, 1.8vw, 1.75rem)', { lineHeight: '1.2', fontWeight: '600' }],
        'type-h4': ['clamp(1.125rem, 1.25vw, 1.25rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'type-body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'type-meta': ['clamp(0.8125rem, 0.9vw, 0.875rem)', { lineHeight: '1.4', fontWeight: '500' }],
        'type-button': ['clamp(0.875rem, 1vw, 1rem)', { lineHeight: '1.25', fontWeight: '600', letterSpacing: '0.02em' }],
        'type-spec': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
