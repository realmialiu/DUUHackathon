/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#141210',
        charcoal: '#1c1a17',
        charcoal2: '#242119',
        rust: '#c1502e',
        rustdark: '#8f3a20',
        cream: '#f2e9d8',
        creamdim: '#d9cdb2',
        moss: '#6f7a4f',
        mossdark: '#4d5636',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'Impact', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(242,233,216,0.05) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
