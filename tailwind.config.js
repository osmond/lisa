export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        offwhite: '#f9faf8',
        sage: '#eaf4ec',
        stone: '#f2f2f2',
        accent: '#7fb77e',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Cabinet Grotesk"', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
