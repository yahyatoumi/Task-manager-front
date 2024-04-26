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
    },
    colors: {
      "primary": "#007bff",
      "secondary": "#ffc107",
      "background": "#f8f9fa",
      "b-hover": "#dfdfdf",
      "text": "#343a40",
      "success": "#28a745",
      "warning": "#ffc107",
      "error": "#dc3545",
      "white": "#FFFFFF"
    }
  },
  plugins: [],
};
export default config;
