import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#e8dcc1",
        foreground: "#c6b098",
        accent: "#ca9968",
        primary: "#c59e82",
        secondary: "#4f3f2f",
	tertiary: "#977861",     
        highlight: "#ff9563",
	highlighthover: "#cb7d58",
        error: "#b7410e",
      },
      fontFamily: {
        sans: ["Raleway", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
      },
      boxShadow: {
        'retro': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'none': '0px',
        'lg': '8px',
      },
      borderWidth: {
        'retro': '1px',
      },
      backgroundImage: {
        'paper': "url('/library_background.jpg')",
      },
    },
  },
  plugins: [],
};
export default config;
