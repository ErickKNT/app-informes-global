/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#00236f",
        "primary-container": "#1e3a8a",
        "on-primary": "#ffffff",
        "on-primary-container": "#90a8ff",
        "primary-fixed": "#dce1ff",
        "primary-fixed-dim": "#b6c4ff",
        "secondary": "#006c49",
        "secondary-container": "#6cf8bb",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#00714d",
        "secondary-fixed": "#6ffbbe",
        "secondary-fixed-dim": "#4edea3",
        "tertiary": "#442100",
        "tertiary-container": "#653400",
        "on-tertiary-container": "#fc922b",
        "tertiary-fixed": "#ffdcc3",
        "tertiary-fixed-dim": "#ffb77d",
        "surface": "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "surface-variant": "#d3e4fe",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#444651",
        "outline": "#757682",
        "outline-variant": "#c5c5d3",
        "background": "#f8f9ff",
        "on-background": "#0b1c30",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "sm": "0.125rem",
        "md": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "space-xxs": "0.25rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "space-2xl": "3rem",
        "container-max": "80rem"
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "headline": ["Plus Jakarta Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
};

