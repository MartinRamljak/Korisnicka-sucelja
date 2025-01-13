import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary': '#AC3F25',
        'dark-primary': '#79321D',
        'secondary': '#FFB700',
      },
      fontFamily: {
        oswald: ["var(--font-oswald)"],
        raleway: ["var(--font-raleway)"],
        caladea: ["var(--font-caladea)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
