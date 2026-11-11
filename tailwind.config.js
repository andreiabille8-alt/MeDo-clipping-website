/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0B0908', 900: '#0B0908', 800: '#141110', 700: '#1C1816' },
        fg: { DEFAULT: '#F5EFEA', muted: '#A79D96', dim: '#6E6560' },
        ember: { DEFAULT: '#FF6A1F', 300: '#FFA472', 400: '#FF8A4C', 500: '#FF6A1F', 600: '#E5520A' },
        live: '#FF3B3B',
        ok: '#4ADE80',
        warn: '#FACC15',
      },
      fontFamily: {
        display: ['"Schibsted Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: { xl: '14px', '2xl': '18px' },
    },
  },
  plugins: [],
}
