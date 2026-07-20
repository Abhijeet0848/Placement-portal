/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f6f6f9',
          100: '#ececf3',
          200: '#d5d5e3',
          300: '#b1b1ca',
          400: '#8787aa',
          500: '#68688f',
          600: '#535377',
          700: '#444462',
          800: '#2e2e42',
          900: '#1b1b2a',
          950: '#0f0f18',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.47)',
      }
    },
  },
  plugins: [],
}
