/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ADD THIS FONT FAMILY SECTION
      fontFamily: {
        'necosmic': ['Necosmic', 'sans-serif'],
        'pixeloid': ['Pixeloid Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}