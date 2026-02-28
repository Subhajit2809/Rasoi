import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Indian kitchen palette
        saffron: {
          50: "#fff8f0",
          100: "#ffecd6",
          200: "#ffd5a8",
          300: "#ffb870",
          400: "#ff9035",
          500: "#ff6f0f",
          600: "#f05005",
          700: "#c73a07",
          800: "#9e2f0e",
          900: "#7f280f",
        },
        turmeric: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
      },
    },
  },
  plugins: [],
};
export default config;
