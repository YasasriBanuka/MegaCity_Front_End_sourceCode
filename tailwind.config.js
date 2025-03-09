/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' }, // Start from the left
          '100%': { transform: 'translateX(-100%)' }, // Move to the left by 100%
        },
      },
      animation: {
        'scroll': 'scroll 400s linear infinite', // Apply the animation
      },
    },
  },
  plugins: [],
};