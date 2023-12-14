/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  theme: {
    extend: {
      animation: {
        'breathe': 'breathe 2s ease-in-out 2',
         },
      keyframes:{
        breathe: {
          '0%, 100%': {transform: 'scale(1)'},
          '50%': {transform: 'scale(1.2)'}
        },
      }
    },
  },
  plugins: [],
 }