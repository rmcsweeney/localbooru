import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/*.{js,ts,jsx,tsx,mdx}",
    "./*/*.css"
  ],
  theme: {
    extend: {
      // remove CSS variable mappings; use Tailwind colors directly
    },
  },
  plugins: [],
} satisfies Config;
