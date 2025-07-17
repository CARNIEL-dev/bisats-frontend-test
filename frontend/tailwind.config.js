/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      priYellow: "#F5BB00",
      priWhite: "#F7F7F7",
      priBlack: "#0A0E12",
      white: "#fff",
      black: "#000",
    },
  },
  plugins: ["@tailwindcss/postcss"],
};
