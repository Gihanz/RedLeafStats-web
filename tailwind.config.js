/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // ✅ MUST be this
  darkMode: "class", // optional, needed for dark mode
  theme: {
    extend: {fontFamily: {
        heading: ["Lato", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
