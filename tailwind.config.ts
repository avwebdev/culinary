import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "saffron-mango": {
          50: "#fff8eb",
          100: "#feebc7",
          200: "#fdd68a",
          300: "#fcbe57",
          400: "#fba124",
          500: "#f57d0b",
          600: "#d95906",
          700: "#b43b09",
          800: "#922d0e",
          900: "#78260f",
          950: "#451103",
        },
        ivory: {
          50: "#fcfdee",
          100: "#f6fac7",
          200: "#f2f692",
          300: "#f0f054",
          400: "#eae125",
          500: "#daca18",
          600: "#bca012",
          700: "#967512",
          800: "#7d5d16",
          900: "#6a4c19",
          950: "#3e290a",
        },
      },
      keyframes: {
        bannermove: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-50%, 0)" },
        },
      },
      animation: {
        // 10s linear infinite (adjust as needed)
        bannermove: "bannermove 10s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
