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
        // CVeed brand
        brand: {
          DEFAULT: "#6C3EF4", // primary purple
          dark: "#5A2FD8",
          light: "#F1ECFE",
          ring: "#C9B8FB",
        },
        ink: "#111111", // near-black text
        canvas: "#FAFAFA", // light background
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,17,17,0.04), 0 4px 16px rgba(17,17,17,0.04)",
        lift: "0 1px 2px rgba(17,17,17,0.05), 0 8px 30px rgba(17,17,17,0.08)",
        ring: "0 0 0 1px rgba(17,17,17,0.06)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
