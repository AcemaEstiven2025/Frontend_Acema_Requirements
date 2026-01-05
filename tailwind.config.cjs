/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
  "bg-green-600",
  "bg-green-700",
  "bg-red-600",
  "bg-red-700",
  "text-white",
  "rounded-lg",
  "focus:ring-2",
  "focus:ring-green-400",
  "focus:ring-red-400",
  "px-4",
  "py-2"
]
});
