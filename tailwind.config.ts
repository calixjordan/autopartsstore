import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#fdfbf7",
          100: "#f7f1e3",
          200: "#ebdcb9",
          300: "#dfc78f",
          400: "#d3b265",
          500: "#c59d3f", // Warm luxurious signature gold
          600: "#a9812e",
          700: "#8a6624",
          800: "#6b4e1c",
          900: "#4f3914",
        },
        dark: {
          900: "#0c0b0a", // Deep warm black (obsidian/warm onyx)
          800: "#141211", // Warm dark charcoal
          700: "#1d1b19", // Warm stone
          600: "#272522", // Warm medium gray/brown
          500: "#33302c",
          400: "#494540",
          300: "#746f68",
          200: "#a39f97",
          100: "#d4d1cc",
        },
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
