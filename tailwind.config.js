{
  /* <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link> */
}

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      yellow: {
        light: "#ffd581",
        DEFAULT: "#ffff00",
        dark: "#009eeb",
      },
      purple: {
        extralight: "#8d5cff",
        light: "#7e47ff",
        DEFAULT: "#6927ff",
        dark: "#621fff",
        extradark: "#540aff",
      },
      indigo: colors.indigo,
    },
    minHeight: {
      block: "200px",
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio")],
};
