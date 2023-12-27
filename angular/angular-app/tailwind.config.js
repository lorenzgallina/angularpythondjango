/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#212121',
        accent: '#FAFAFA',
        warn: '#9E9E9E',
      },
    },
  },
  plugins: [],
}

