/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f5425d',  // Example primary color
        secondary: '#ffed4a',  // Example secondary color
        accent: '#e3342f',  // Example accent color
        // Add other colors or shades as needed
      },
    },
  },
  plugins: [],
}

