/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      "dark-mode-ligth": "#2b3945",
      "dark-fe": "hsl(207, 26%, 17%)",
      valid: "#54dd91",
      invalid: "#df4d4d",
      white: "#fff",
      black: "#000",
    },
    fontFamily: {
      sans: ["Nunito Sans", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
