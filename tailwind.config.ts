import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f7f4ee",
        foreground: "#172126",
        border: "#e7dfd3",
        muted: {
          DEFAULT: "#efe7db",
          foreground: "#6a6d66",
        },
        card: {
          DEFAULT: "#fffdf9",
          foreground: "#172126",
        },
        primary: {
          DEFAULT: "#185b63",
          foreground: "#f8fbfb",
        },
        secondary: {
          DEFAULT: "#e8d6bf",
          foreground: "#3e2b1f",
        },
        accent: {
          DEFAULT: "#c36a2d",
          foreground: "#fff8f1",
        },
        success: {
          DEFAULT: "#2b7a57",
          foreground: "#f3fbf6",
        },
        warning: {
          DEFAULT: "#b57923",
          foreground: "#fff9ee",
        },
        danger: {
          DEFAULT: "#aa4a44",
          foreground: "#fff5f4",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      boxShadow: {
        panel: "0 14px 32px rgba(53, 42, 31, 0.08)",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
