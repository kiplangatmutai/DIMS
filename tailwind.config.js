
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626', // Primary Red
          700: '#b91c1c',
          900: '#7f1d1d',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9', // Sky Blue
          600: '#0284c7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
