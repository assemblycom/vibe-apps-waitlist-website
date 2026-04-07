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
      },
    },
  },
  plugins: [],
};
