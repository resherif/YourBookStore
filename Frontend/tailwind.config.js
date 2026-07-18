/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lux: {
          bg: '#0B0B0F',
          card: '#16161E',
          gold: '#D4AF37',
          goldHover: '#AA8822',
          textMain: '#F3F4F6',
          textMuted: '#9CA3AF'
        }
      }
    },
  },
  plugins: [],
}