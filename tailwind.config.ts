import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;


theme: {
    extend: {
        colors: {
            ink: '#0F0F0F'
            lime: '#C9F231'
            surface: '#F4F4F4'
        }
    }
}

