export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        offwhite: '#f9faf8',
        sage: '#eaf4ec',
        stone: '#f2f2f2',
        accent: '#87a96b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Cabinet Grotesk"', 'Recoleta', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        headline: ['2rem', {}],
        subhead: ['1.25rem', {}],
        label: ['0.875rem', {}],
        detail: ['0.75rem', {}],
      },
      letterSpacing: {
        heading: '-0.01em',
        label: '0.05em',
      },
      lineHeight: {
        heading: '1.25',
        label: '1.3',
      },
    },
  },
  plugins: [],
};
