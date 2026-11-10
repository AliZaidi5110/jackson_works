/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // JDM Racing Red – primary accent
        red: {
          950: '#2d0707',
          900: '#450a0a',
          800: '#7f1d1d',
          700: '#b91c1c',
          600: '#dc2626',
          500: '#ef4444',
          400: '#f87171',
        },
        // Dark zinc backgrounds
        zinc: {
          950: '#09090b',
          900: '#18181b',
          800: '#27272a',
          700: '#3f3f46',
          600: '#52525b',
          500: '#71717a',
          400: '#a1a1aa',
          300: '#d4d4d8',
          200: '#e4e4e7',
          100: '#f4f4f5',
        },
        // Gold – secondary accent
        gold: {
          500: '#f59e0b',
          400: '#fbbf24',
          300: '#fcd34d',
        },
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
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'red-glow': '0 0 32px rgba(220, 38, 38, 0.25)',
        'card': '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover': '0 16px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(220,38,38,0.6)',
      },
      backgroundImage: {
        'gradient-red': 'linear-gradient(135deg, #dc2626, #b91c1c)',
        'gradient-red-orange': 'linear-gradient(135deg, #ef4444, #f97316)',
        'gradient-dark': 'linear-gradient(180deg, #18181b, #09090b)',
        'gradient-hero': 'linear-gradient(135deg, rgba(9,9,11,0.97) 0%, rgba(9,9,11,0.75) 60%, rgba(9,9,11,0.3) 100%)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulse_red: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220,38,38,0.4)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(220,38,38,0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease',
        slideUp: 'slideUp 0.25s ease',
        pulse_red: 'pulse_red 2s ease infinite',
      },
    },
  },
  plugins: [],
};
