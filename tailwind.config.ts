import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        black: '#000000',
        surface: '#0D0D0D',
        'surface-2': '#141414',
        border: '#1A1A1A',
        orange: {
          DEFAULT: '#FF751F',
          hover: '#FF8C3F',
          dim: '#FF751F10',
          glow: '#FF751F20',
          border: '#FF751F40',
        },
        gray: {
          1: '#A0A0A0',
          2: '#606060',
          3: '#2A2A2A',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #FF751F 0%, #FF9A3C 100%)',
        'gradient-text': 'linear-gradient(135deg, #FF751F, #FFB347)',
        'dot-grid': 'radial-gradient(circle, #ffffff08 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '32px 32px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        float: 'float 6s ease-in-out infinite',
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
      },
      boxShadow: {
        'orange-glow': '0 0 20px #FF751F40',
        'orange-glow-sm': '0 0 10px #FF751F30',
        'card-hover': '0 0 0 1px #FF751F30, 0 8px 32px #FF751F10',
      },
    },
  },
  plugins: [],
}

export default config
