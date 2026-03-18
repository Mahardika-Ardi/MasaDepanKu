/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#14213d',
          ember: '#fca311',
          mist: '#e5e5e5',
          paper: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}

