/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta clara — base do redesenho (referência do cliente).
        canvas: '#F5F3EE',
        surface: '#FFFFFF',
        ink: '#16170F',
        muted: '#6E6C63',
        faint: '#9C9A90',
        line: '#E4E0D6',
        forest: {
          DEFAULT: '#12352A',
          700: '#0E2A21',
          600: '#17493A',
          500: '#1D5C48',
          100: '#E7EFEA',
        },
        clay: '#B4531F',
        danger: '#A32C22',
        // Paleta escura — não existe na referência (ela só tem tema
        // claro); desenhada na mesma família (verde-floresta aquecido)
        // pra preservar o dark mode real que o ATHLO já tem, em vez de
        // reusar o slate/cyan antigo.
        'canvas-dark': '#11140F',
        'surface-dark': '#1A1F18',
        'ink-dark': '#F2F0E9',
        'muted-dark': '#A6A89C',
        'faint-dark': '#74766B',
        'line-dark': '#2B2F27',
        'forest-400': '#2E6B54',
        'forest-900': '#0A1C16',
        'clay-dark': '#D97A43',
        'danger-dark': '#D96456',
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '10px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
