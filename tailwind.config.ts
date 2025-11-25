import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './types.ts',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        calligraphy: ['"Ma Shan Zheng"', 'cursive'],
      },
      colors: {
        temple: {
          gold: '#D4AF37',
          red: '#8B0000',
          wood: '#855E42',
          dark: '#0c0a09',
          paper: '#Fdfbf7',
          gray: '#4a4a4a',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 1.5s ease-out forwards',
        'slow-zoom': 'slowZoom 20s infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        smoke: 'smoke 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        smoke: {
          '0%': { transform: 'translate(-50%, 0) scale(0.9)', opacity: '0.6', filter: 'blur(0px)' },
          '50%': { transform: 'translate(-50%, -60px) scale(1.05)', opacity: '0.35', filter: 'blur(2px)' },
          '100%': { transform: 'translate(-50%, -120px) scale(1.15)', opacity: '0', filter: 'blur(4px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
