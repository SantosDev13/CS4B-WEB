import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B1F33",
        "primary-light": "#1a3a5c",
        secondary: "#3FA9F5",
        "secondary-light": "#5cb8ff",
        accent: "#B6E356",
        "accent-warm": "#ffb86c",
        "bg-light": "#f7f7f8",
        "bg-white": "#ffffff",
        "text-primary": "#0B1F33",
        "text-secondary": "#5e6e82",
        "text-muted": "#97a0af",
        brand: {
          dark: "#0B1F33",
          blue: "#3FA9F5",
          green: "#B6E356",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1440px",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #3FA9F5 0%, #0B1F33 50%, #B6E356 100%)",
        "gradient-blue": "linear-gradient(135deg, #3FA9F5 0%, #1a3a5c 100%)",
        "gradient-dark": "linear-gradient(to bottom, #0B1F33 0%, #1a3a5c 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(63,169,245,0.05) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
