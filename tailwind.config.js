/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        grass: '#C7EF77',
        sky: {
          light: '#C4F2FF',
          dark: '#4FABFF',
        },
        box: {
          DEFAULT: '#E29B55',
          dark: '#914A32',
        },
        ui: {
          fill: '#3A4466',
          dark: '#262B45',
          border: '#181425',
          frame: '#35232F',
          paper: '#EAD4AA',
        },
      },
    },
  },
  groupVariants: {
    'collapsable-expanded': ['collapsable', 'expanded', '.expanded'],
  },
  plugins: [require('tailwindcss-group-variants')],
};
