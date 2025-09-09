/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#1a6bff',
          600: '#1554cc',
          700: '#103e99',
          800: '#0a2966',
          900: '#051433'
        },
        neon: '#39ff14',
        graphite: '#0b0f17',
      },
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      backgroundImage: {
        'grid-slim': 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)'
      },
      backgroundSize: {
        'grid-slim': '60px 60px'
      },
      boxShadow: {
        glass: 'inset 0 1px 0 0 rgba(255,255,255,0.02), 0 10px 30px rgba(0,0,0,0.4)'
      }
    },
  },
  plugins: [],
}


