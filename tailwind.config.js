/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#eaeefe',
          200: '#cfd8fd',
          300: '#a7b8fb',
          400: '#7b92f8',
          500: '#5b75f6',
          600: '#3e58e8',
          700: '#2f44c5',
          800: '#2839a0',
          900: '#233280',
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          md: '1.5rem',
          lg: '2rem',
          xl: '2rem',
        },
      },
    },
  },
  plugins: [],
}

