/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',  
          100: '#bedfff94', 
          200: '#bcd0fe', 
          300: '#8fb1fc',
          400: '#5c8af8',
          500: '#3865f0',  
          600: '#2547e3',
          700: '#1e37c4',
          800: '#1e309d',
          900: '#1e2d7c',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundColor: {
       canvas: '#eaf1ff',
      },
    },
  },
  plugins: [],
};