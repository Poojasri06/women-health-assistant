/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        plum: {
          50: "#FAF5FB",
          100: "#F1E2F5",
          200: "#E0C2EA",
          300: "#C690D6",
          400: "#A75DBE",
          500: "#7C3AA8",
          600: "#642C88",
          700: "#4F2069",
          800: "#3A1750",
          900: "#28103A",
        },
        rose: {
          50: "#FFF1F5",
          100: "#FFDCE7",
          200: "#FFB7CF",
          300: "#FF8AB1",
          400: "#F45D93",
          500: "#E8336F",
          600: "#C71F58",
          700: "#9E1746",
        },
        blush: {
          50: "#FFF8FA",
          100: "#FFF0F4",
        },
        ink: {
          900: "#241823",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "plum-rose": "linear-gradient(135deg, #4F2069 0%, #7C3AA8 45%, #E8336F 100%)",
        "plum-rose-soft": "linear-gradient(135deg, #F1E2F5 0%, #FFE3ED 100%)",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(124, 58, 168, 0.12)",
        card: "0 2px 12px -2px rgba(124, 58, 168, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
