import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.04em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      colors: {
        background: 'var(--color-bg)',
        foreground: 'var(--color-fg)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-disabled': 'var(--color-text-disabled)',
        accent: {
          DEFAULT: '#FF751F',
          hover: '#FF8C42',
          dim: 'var(--color-accent-dim)',
          glow: 'rgba(255, 117, 31, 0.2)',
          border: 'rgba(255, 117, 31, 0.3)',
        },
        primary: {
          DEFAULT: '#FF751F',
          hover: '#FF8C42',
          dim: 'var(--color-primary-dim)',
          glow: 'rgba(255, 117, 31, 0.2)',
          dark: '#E5671B',
        },
        orange: {
          DEFAULT: '#FF751F',
          hover: '#FF8C42',
          dim: 'var(--color-accent-dim)',
          glow: 'rgba(255, 117, 31, 0.2)',
          border: 'rgba(255, 117, 31, 0.3)',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #FF751F 0%, #FF9A56 100%)',
        'gradient-text': 'linear-gradient(135deg, #FF751F, #FFAD70)',
        'gradient-warm': 'linear-gradient(135deg, #FF751F, #FF4D00)',
        'gradient-surface': 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-slower': 'floatSlower 12s ease-in-out infinite',
        'beam-fall': 'beamFall 4s ease-in infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(10px, -15px)' },
          '66%': { transform: 'translate(-8px, 8px)' },
        },
        floatSlower: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-15px, 10px) scale(1.05)' },
        },
        beamFall: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'accent-glow': '0 0 30px rgba(255, 117, 31, 0.25)',
        'accent-glow-sm': '0 0 15px rgba(255, 117, 31, 0.15)',
        'primary-glow': '0 0 40px rgba(255, 117, 31, 0.3)',
        'card-hover': '0 0 0 1px rgba(255, 117, 31, 0.2), 0 8px 32px rgba(255, 117, 31, 0.06)',
        'orange-glow': '0 0 30px rgba(255, 117, 31, 0.25)',
        'orange-glow-sm': '0 0 15px rgba(255, 117, 31, 0.15)',
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
      },
    },
  },
  plugins: [],
}

export default config
