/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], 
  darkMode: "class", 
  theme: {
    extend: {fontFamily: {
        heading: ["Lato", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
