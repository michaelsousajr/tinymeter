import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        meter: {
          bg: "#0F0F1A",
          magenta: {
            bg: "#000000",
            primary: "#D946EF",
            secondary: "#8B5CF6"
          },
          ocean: {
            bg: "#064E3B",
            primary: "#0EA5E9",
            secondary: "#2563EB"
          },
          sunset: {
            bg: "#7C2D12",
            primary: "#F97316",
            secondary: "#DB2777"
          },
          pink: {
            bg: "#FFD0CB",
            primary: "#FFFFFF",
            secondary: "#FFD0CB"
          },
          cosmic: {
            bg: "#221F26",
            primary: "#D6BCFA",
            secondary: "#9F7AEA"
          }
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "meter-bounce": {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.95)" },
        },
        "meter-noise": {
          "0%, 100%": { opacity: "0.9" },
          "50%": { opacity: "1" },
        }
      },
      animation: {
        "meter-bounce": "meter-bounce 0.3s ease-in-out",
        "meter-noise": "meter-noise 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
