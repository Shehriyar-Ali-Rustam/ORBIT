import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        // Landing page (v.l.01) design system — scoped to .ds
        grotesk: ['var(--font-grotesk)', 'system-ui', 'sans-serif'],
        spacemono: ['var(--font-space-mono)', 'ui-monospace', 'monospace'],
        syne: ['var(--font-syne)', 'var(--font-grotesk)', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.025em',
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
        // Landing page palette (v.l.02). Every token resolves through a CSS
        // variable defined in src/styles/landing.css, so light and dark are one
        // block of values rather than a rewrite of every component.
        orbit: {
          /** Brand orange. Fills, and text sitting on a dark surface. */
          acc: 'rgb(var(--acc-rgb) / <alpha-value>)',
          /** Contrast-safe accent for text/icons on the canvas. On white,
           *  brand orange only reaches 2.7:1 — this is 5.1:1. */
          accInk: 'rgb(var(--acc-ink-rgb) / <alpha-value>)',
          /** Page background. */
          canvas: 'rgb(var(--canvas-rgb) / <alpha-value>)',
          /** Primary text. */
          ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
          /** Tint for hairline borders and surface fills. */
          line: 'rgb(var(--line-rgb) / <alpha-value>)',
          /** Fixed near-black for text on top of an orange fill — the one
           *  colour that must NOT flip with the theme. */
          onAcc: '#0D0D0D',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #FF751F 0%, #FF9A56 100%)',
      },
      animation: {
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.5)' },
        },
      },
      boxShadow: {
        'accent-glow': '0 0 30px rgba(255, 117, 31, 0.25)',
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
