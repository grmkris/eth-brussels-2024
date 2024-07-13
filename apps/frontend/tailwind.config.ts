import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        rainbow: {
          "0%, 100%": { color: "#b70505" }, // Red
          "16%": { color: "#FF7F00" }, // Orange
          "32%": { color: "#FFFF00" }, // Yellow
          "48%": { color: "#00FF00" }, // Green
          "64%": { color: "#0000FF" }, // Blue
          "80%": { color: "#4B0082" }, // Indigo
          "96%": { color: "#9400D3" }, // Violet
        },
        customRainbow: {
          "0%, 100%": { fill: "#8a16d5" }, // Color 1
          "50%": { fill: "#d900a9" }, // Color 2
          "100%": { fill: "#4e23ce" }, // Color 3
        },
      },
      animation: {
        rainbow: "rainbow 3s linear infinite",
        customRainbow: "customRainbow 2s linear infinite",
        moveRight: "moveRight 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
