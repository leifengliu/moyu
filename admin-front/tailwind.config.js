/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#4A3428',
        gold: '#C9A67A',
        warm: '#FAFAF8',
        border: '#E5E3DF',
        muted: '#8B8680'
      }
    }
  },
  plugins: []
}
