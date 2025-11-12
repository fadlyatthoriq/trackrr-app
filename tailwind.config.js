/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6F61',
        secondary: '#FFD166',
        accent: '#06D6A0',
        info: '#118AB2',
        bg: '#FFF8E7',
        surface: '#F9FAFB',
        error: '#EF476F',
        success: '#83C56C',
      },
      fontFamily: {
        baloo: ['Baloo 2', 'cursive'],
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'float-delayed': 'float 20s ease-in-out 5s infinite',
        'float-delayed-2': 'float 20s ease-in-out 10s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
    },
  },
  plugins: [],
};
