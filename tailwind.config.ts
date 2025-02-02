import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "saffron-mango": {
          "50": "#fff8eb",
          "100": "#feebc7",
          "200": "#fdd68a",
          "300": "#fcbe57",
          "400": "#fba124",
          "500": "#f57d0b",
          "600": "#d95906",
          "700": "#b43b09",
          "800": "#922d0e",
          "900": "#78260f",
          "950": "#451103",
        },
        ivory: {
          "50": "#fcfdee",
          "100": "#f6fac7",
          "200": "#f2f692",
          "300": "#f0f054",
          "400": "#eae125",
          "500": "#daca18",
          "600": "#bca012",
          "700": "#967512",
          "800": "#7d5d16",
          "900": "#6a4c19",
          "950": "#3e290a",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        bannermove: {
          "0%": {
            transform: "translate(0, 0)",
          },
          "100%": {
            transform: "translate(-100%, 0)",
          },
        }, bannermovereverse: {
          "0%": {
            transform: "translate(-100%, 0)",
          },
          "100%": {
            transform: "translate(0, 0)",
          },
        },
      },
      animation: {
        bannermove: "bannermove 10s  infinite",
        bannermovereverse: "bannermovereverse 10s linear infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
