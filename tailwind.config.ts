import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#1f1728",
          plum: "#4b1d5a",
          rose: "#cc5c93",
          gold: "#d7b46a",
          mist: "#faf5fb"
        }
      }
    }
  },
  plugins: []
};

export default config;
