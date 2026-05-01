/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"PP Mori"', "system-ui", "sans-serif"],
        mono: ['"ABC Diatype Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        assembly: {
          black: "#101010",
          gray: "#6F6F6F",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
        "success-pop": "successPop 0.55s cubic-bezier(0.22, 1.2, 0.36, 1) forwards",
        "success-ring": "successRing 0.9s ease-out forwards",
        "row-complete": "rowComplete 0.35s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "progress-fill": "progressFill 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        successPop: {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "60%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        successRing: {
          "0%": { opacity: "0.6", transform: "scale(0.8)" },
          "100%": { opacity: "0", transform: "scale(1.8)" },
        },
        rowComplete: {
          "0%": { transform: "scale(0.7)", opacity: "0" },
          "60%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        progressFill: {
          "0%": { transform: "scaleX(var(--from, 0))" },
          "100%": { transform: "scaleX(var(--to, 1))" },
        },
      },
    },
  },
  plugins: [],
};
