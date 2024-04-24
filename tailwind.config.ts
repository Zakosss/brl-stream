import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './**/*.{html,js}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'dark': {
          100: '#343434',
          200: '#4B4B4B',
          300: "#272727"
        }
      },
      aspectRatio: {
        '2': '2',
      },
      width: {
        '90': '22.5rem'
      },
      maxHeight: {
        '1.25': '0.3125rem'
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%'
      }
    },
  },
  plugins: [],
};
export default config;
