/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cad: {
          bg: '#0f1115',
          panel: '#161920',
          panelLight: '#1e222c',
          border: '#2a2f3d',
          borderLight: '#394154',
          accent: '#10b981',      // Emerald / Fashion CAD Green
          accentHover: '#059669',
          accentSoft: 'rgba(16, 185, 129, 0.15)',
          selection: '#38bdf8',   // Bright cyan for CAD selection
          text: '#f1f5f9',
          textMuted: '#94a3b8',
          textDim: '#64748b',
          grid: '#222734',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

