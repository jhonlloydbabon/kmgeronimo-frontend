/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      // Colors for blue
      'primary': '#00bfff',
      'subprimary': '#0099cc',
      'darkprimary': '#007399',

      // Colors for background 
      'secondary': '#F9F8FD',


      // Colors for headings
      'dark-gray': '#666666',

      // Colors for input
      'light-gray': '#e2e8f0',
      'medium-gray': '#8795a1',

      // Colors for buttons and cards
      'green': '#00e68a',
      'dark-green': '#00cc7a',
      'orange': '#ffa366',
      'orange-sub': '#ff8533',
      'dark-orange': '#803300',
      'yellow': '#ffff00',
      'dark-yellow': '#cccc00',

      'red': '#e26565',

      // Colors for texts
      'white': '#ffffff',

      'modal': '#111827',

      'black': '#2b2b2b'


    }
  },
  plugins: [],
}