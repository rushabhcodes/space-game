/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom space theme colors
        space: {
          blue: "#00D4FF",
          purple: "#8B5FFF",
          green: "#00FF88",
          orange: "#FF6B35",
          yellow: "#FFD700",
        }
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 212, 255, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.8)" },
        },
        "drift": {
          "0%": { transform: "translateX(0px) translateY(0px)" },
          "25%": { transform: "translateX(10px) translateY(-5px)" },
          "50%": { transform: "translateX(-5px) translateY(-10px)" },
          "75%": { transform: "translateX(-10px) translateY(5px)" },
          "100%": { transform: "translateX(0px) translateY(0px)" },
        }
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "drift": "drift 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
