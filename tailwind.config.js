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
        // Stitch Editorial Palette
        paper: "#FAF9F5",
        surface: "#FFFFFF",
        hairline: "#E5E5E0",
        ink: {
          900: "#111827",
          700: "#27272A",
          500: "#52525B",
          400: "#71717A",
          300: "#A1A1AA",
        },
        karnataka: {
          crimson: "#D92D20",
          "crimson-dark": "#B42318",
          gold: "#EAAA08",
          "gold-light": "#FEF08A",
        },
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
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        serif: ["Noto Serif Kannada", "Noto Serif", "Georgia", "serif"],
        kannada: ["Noto Sans Kannada", "sans-serif"],
        tiro: ["Tiro Kannada", "serif"],
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
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "float-reverse": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(6px)" },
        },
        "draw-beam": {
          from: { strokeDashoffset: "1000", opacity: "0" },
          to: { strokeDashoffset: "0", opacity: "1" },
        },
        "subtle-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.94)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        waveform: {
          "0%, 100%": { height: "4px" },
          "50%": { height: "20px" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "float-glass": "float-glass 6s ease-in-out infinite",
        "float-slow": "float-slow 4.5s ease-in-out infinite",
        "float-reverse": "float-reverse 5.5s ease-in-out infinite",
        "draw-beam": "draw-beam 1.2s ease-out forwards",
        "subtle-pulse": "subtle-pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.2s infinite",
        waveform: "waveform 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

