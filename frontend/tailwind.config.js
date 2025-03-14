/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        ripple: "ripple 0.6s linear",
      },
      keyframes: {
        ripple: {
          to: {
            transform: "scale(2)",
            opacity: "0",
          },
        },
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      screens: {
        xs: "420px",
        // => @media (min-width: 640px) { ... }
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        dosis: ["Dosis", "sans-serif"],
        figtree: ["Figtree", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
