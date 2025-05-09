import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        // Custom theme colors
        algorithm: {
          bubble: "#FF6B6B",
          quick: "#4ECDC4",
          merge: "#FFD166",
          insertion: "#6A0572",
          selection: "#AB83A1",
        },
        datastructure: {
          array: "#845EC2",
          linkedlist: "#D65DB1",
          stack: "#FF6F91",
          queue: "#FF9671",
          tree: "#FFC75F",
          graph: "#F9F871",
          heap: "#00C9A7",
          hash: "#C4FCEF",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "bounce-horizontal": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(10px)" },
        },
        "rotate-node": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
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
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        float: "float 3s ease-in-out infinite",
        "bounce-horizontal": "bounce-horizontal 1s ease-in-out infinite",
        "rotate-node": "rotate-node 10s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
      boxShadow: {
        neon: "0 0 5px theme(colors.primary.DEFAULT), 0 0 20px theme(colors.primary.DEFAULT)",
        "neon-hover":
          "0 0 10px theme(colors.primary.DEFAULT), 0 0 30px theme(colors.primary.DEFAULT), 0 0 50px theme(colors.primary.DEFAULT)",
        "algorithm-bubble": "0 0 10px theme(colors.algorithm.bubble)",
        "algorithm-quick": "0 0 10px theme(colors.algorithm.quick)",
        "algorithm-merge": "0 0 10px theme(colors.algorithm.merge)",
        "algorithm-insertion": "0 0 10px theme(colors.algorithm.insertion)",
        "algorithm-selection": "0 0 10px theme(colors.algorithm.selection)",
        "ds-array": "0 0 10px theme(colors.datastructure.array)",
        "ds-linkedlist": "0 0 10px theme(colors.datastructure.linkedlist)",
        "ds-stack": "0 0 10px theme(colors.datastructure.stack)",
        "ds-queue": "0 0 10px theme(colors.datastructure.queue)",
        "ds-tree": "0 0 10px theme(colors.datastructure.tree)",
        "ds-graph": "0 0 10px theme(colors.datastructure.graph)",
        "ds-heap": "0 0 10px theme(colors.datastructure.heap)",
        "ds-hash": "0 0 10px theme(colors.datastructure.hash)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern":
          "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-pattern": "20px 20px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
