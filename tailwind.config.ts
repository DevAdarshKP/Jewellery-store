import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium White & Alabaster Palette
        alabaster: '#FFFBF5',
        'warm-white': '#FFFBF5',
        obsidian: '#08090B',
        graphite: '#1A1C20',
        charcoal: {
          DEFAULT: '#111316',
          50: '#F7F6F7',
          100: '#EEECEE',
          200: '#DDD9DE',
          300: '#C3BDC5',
          400: '#A5A19A',
          500: '#786D6D',
          600: '#5A5151',
          700: '#3E3636',
          800: '#2A2323',
          900: '#171316',
          950: '#111316',
          muted: '#A5A19A',
        },
        champagne: {
          50: '#FCFAF7',
          100: '#F5EFE4',
          200: '#EADEC9',
          300: '#D6C4A6',
          400: '#D5B477', // Champagne Gold
          500: '#B89A60', // Soft Metallic Gold
          600: '#9C7747',
          700: '#7A5C34',
          800: '#5A4223',
          900: '#3C2A15',
          gold: '#D5B477',
          metallic: '#B89A60',
          antique: '#9C7747',
        },
        ivory: {
          50: '#FCFAF7',
          100: '#FAF7F2',
          200: '#F5F0E7', // Warm Ivory
          300: '#EAE3D5',
          400: '#D7CBB7',
          500: '#BEAF98',
          soft: '#FAF7F2',
          warm: '#F5F0E7',
          cream: '#F5F0E7',
        },
        burgundy: {
          50: '#FAF0F2',
          100: '#F4DFE4',
          200: '#E8C0C9',
          300: '#D296A5',
          400: '#B5667B',
          500: '#8C2B4E',
          600: '#721D3D',
          700: '#5A1832', // Rich Burgundy
          800: '#3B0D20', // Deep Burgundy
          900: '#250713', // Dark Wine
          950: '#1A040D',
          primary: '#5A1832',
          rich: '#5A1832',
          deep: '#3B0D20',
          wine: '#250713',
        },
        // Maintained for backward-compatibility with Admin CMS
        gold: {
          50: '#FAF7F2',
          100: '#F4EFE6',
          200: '#E8DEC8',
          300: '#D6C4A1',
          400: '#C5A880',
          500: '#B8935B',
          600: '#9C763F',
          700: '#7E5B2B',
          800: '#5F431F',
          900: '#3D2912',
        },
        onyx: {
          50: '#F8F9FA',
          100: '#F0F1F4',
          200: '#E1E3E8',
          300: '#C6CAD4',
          400: '#8D93A3',
          500: '#646977',
          600: '#484C57',
          700: '#34373F',
          800: '#222429',
          900: '#141518',
          950: '#0B0C0E',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 10px 40px -10px rgba(53, 17, 28, 0.08)',
        'luxury-hover': '0 20px 45px -10px rgba(87, 28, 43, 0.18)',
        'luxury-gold': '0 15px 40px -10px rgba(208, 173, 120, 0.25)',
        'luxury-dark': '0 12px 40px -10px rgba(37, 33, 38, 0.5)',
      },
      letterSpacing: {
        'luxury-widest': '0.28em',
      },
    },
  },
  plugins: [],
};

export default config;

