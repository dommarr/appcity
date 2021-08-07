{
  /* <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link> */
}
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  //mode: "jit",
  purge: {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx,txt}"],
    options: {
      safelist: {
        greedy: ["/safe$/"],
      },
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      google: "#DB4437",
      "google-light": "#E57368",
      facebook: "#1778F2",
      "facebook-light": "#5DA1F6",
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      red: colors.red,
      amber: colors.yellow,
      green: colors.emerald,
      blue: colors.blue,
      indigo: colors.indigo,
      violet: colors.violet,
      pink: colors.pink,
      yellow: {
        light: "#ffd581",
        DEFAULT: "#ffff00",
        dark: "#009eeb",
      },
      purple: {
        // extralight: "#8d5cff",
        // light: "#7e47ff",
        // DEFAULT: "#6927ff",
        // dark: "#621fff",
        // extradark: "#540aff",
        extralight: "#8d5cff",
        light: "#6927ff",
        DEFAULT: "#540aff",
        dark: "#3700b8",
        extradark: "#0F0059",
      },
    },
    extend: {
      // colors: {
      //   google: "#DB4437",
      //   "google-light": "#E57368",
      //   facebook: "#1778F2",
      //   "facebook-light": "#5DA1F6",
      // },
      keyframes: {
        sunset: {
          "0%": {
            transform: "translateY(-200px)",
            "background-position": "left top",
          },
          "50%": {
            transform: "translateY(-100px)",
            "background-position": "center",
          },
          "100%": {
            transform: "translateY(0px)",
            "background-position": "right",
          },
        },
      },
      animation: {
        sunset: "sunset 2s linear 1",
      },
      backgroundSize: {
        400: "400% 400%",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        logo: ["Poppins"],
      },
      height: {
        120: "30rem",
        200: "40rem",
        "40vh": "40vh",
        "50vh": "50vh",
        "60vh": "60vh",
        "70vh": "70vh",
        "80vh": "80vh",
      },
      minHeight: {
        block: "160px",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        "60vh": "60vh",
        "65vh": "65vh",
        "70vh": "70vh",
        "75vh": "75vh",
        "80vh": "80vh",
        "300px": "300px",
      },
      minWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
      },
      // maxWidth: {
      //   "max-w-screen-3xl": "max-width: 1920px",
      // },
      gridTemplateRows: {
        "1mc": "repeat(1, minmax(0, max-content))",
        "2mc": "repeat(2, minmax(0, max-content))",
        "3mc": "repeat(3, minmax(0, max-content))",
        "4mc": "repeat(4, minmax(0, max-content))",
        "5mc": "repeat(5, minmax(0, max-content))",
        "6mc": "repeat(6, minmax(0, max-content))",
        "7mc": "repeat(7, minmax(0, max-content))",
        "8mc": "repeat(8, minmax(0, max-content))",
        "9mc": "repeat(9, minmax(0, max-content))",
        "10mc": "repeat(10, minmax(0, max-content))",
        "11mc": "repeat(11, minmax(0, max-content))",
        "12mc": "repeat(12, minmax(0, max-content))",
        "13mc": "repeat(13, minmax(0, max-content))",
        "14mc": "repeat(14, minmax(0, max-content))",
        "15mc": "repeat(15, minmax(0, max-content))",
        "16mc": "repeat(16, minmax(0, max-content))",
        "17mc": "repeat(18, minmax(0, max-content))",
        "19mc": "repeat(19, minmax(0, max-content))",
        "20mc": "repeat(20, minmax(0, max-content))",
        "21mc": "repeat(21, minmax(0, max-content))",
        "22mc": "repeat(22, minmax(0, max-content))",
        "23mc": "repeat(23, minmax(0, max-content))",
        "24mc": "repeat(24, minmax(0, max-content))",
        "25mc": "repeat(25, minmax(0, max-content))",
        "26mc": "repeat(26, minmax(0, max-content))",
        "27mc": "repeat(27, minmax(0, max-content))",
        "28mc": "repeat(28, minmax(0, max-content))",
        "29mc": "repeat(29, minmax(0, max-content))",
        "30mc": "repeat(30, minmax(0, max-content))",
      },
      gridRowStart: {
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        14: "14",
        15: "15",
        16: "16",
        17: "17",
        18: "18",
        19: "19",
        20: "20",
        21: "21",
        22: "22",
        23: "23",
        24: "24",
        25: "25",
        26: "26",
        27: "27",
        28: "28",
        29: "29",
        30: "30",
        31: "31",
        32: "32",
        33: "33",
        34: "34",
        35: "35",
        36: "36",
        37: "37",
        38: "38",
        39: "39",
        40: "40",
      },
      order: {
        13: "13",
        14: "14",
        15: "15",
        16: "16",
        17: "17",
        18: "18",
        19: "19",
        20: "20",
        21: "21",
        22: "22",
        23: "23",
        24: "24",
        25: "25",
        26: "26",
        27: "27",
        28: "28",
        29: "29",
        30: "30",
        31: "31",
        32: "32",
        33: "33",
        34: "34",
        35: "35",
        36: "36",
        37: "37",
        38: "38",
        39: "39",
        40: "40",
        41: "41",
        42: "42",
        43: "43",
        44: "44",
        45: "45",
        46: "46",
        47: "47",
        48: "48",
        49: "49",
        50: "50",
        51: "51",
        52: "52",
        53: "53",
        54: "54",
        55: "55",
        56: "56",
        57: "57",
        58: "58",
        59: "59",
        60: "60",
        61: "61",
        62: "62",
        63: "63",
        64: "64",
        65: "65",
        66: "66",
        67: "67",
        68: "68",
        69: "69",
        70: "70",
        71: "71",
        72: "72",
        73: "73",
        74: "74",
        75: "75",
        76: "76",
        77: "77",
        78: "78",
        79: "79",
        80: "80",
      },
      textDecoration: {
        dotted: "underline dotted",
      },
    },
  },
  variants: {
    extend: {
      fill: ["hover"],
      cursor: ["hover"],
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio")],
};
