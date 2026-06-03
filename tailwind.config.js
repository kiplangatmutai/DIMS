
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb', // Primary cool blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#172554',
        },
        accent: {
          50: '#f8fafc',
          100: '#e2e8f0',
          200: '#cbd5e1',
          500: '#0ea5e9', // Ice blue accent
          600: '#0284c7',
          700: '#0369a1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
