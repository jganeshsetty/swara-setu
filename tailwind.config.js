/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css,scss}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Karnataka Arishina-Kumkuma & Obsidian Heritage palette
        obsidian: {
          900: "#0B0908",
          800: "#140C0A",
          700: "#1F1613",
        },
        arishina: {
          400: "#F5B700",
          500: "#FFC13B",
          600: "#E6A800",
        },
        kumkuma: {
          500: "#C81D25",
          600: "#E63946",
          700: "#A0161C",
        },
        glass: {
          DEFAULT: "rgba(20, 14, 12, 0.72)",
          border: "rgba(245, 183, 0, 0.22)",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        serif: ["Noto Serif Kannada", "Noto Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        "float-glass": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "draw-beam": {
          from: { strokeDashoffset: "1000", opacity: "0" },
          to: { strokeDashoffset: "0", opacity: "1" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "float-glass": "float-glass 6s ease-in-out infinite",
        "draw-beam": "draw-beam 1.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

