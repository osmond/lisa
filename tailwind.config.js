import colors from 'tailwindcss/colors'
import plugin from 'tailwindcss/plugin'

export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        offwhite: '#f9faf8',
        sage: '#eaf4ec',
        stone: '#f2f2f2',
        accent: 'var(--color-accent)',
        water: colors.blue,
        fertilize: colors.orange,
        healthy: colors.green,
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Cabinet Grotesk"', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        headline: ['"Cabinet Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.pb-safe': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
      })
    }),
  ],
};
