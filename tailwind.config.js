import heroui from "@heroui/theme/plugin";
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'hsl(var(--border))'
      },
      colors: {
        border: 'hsl(var(--border))',
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
    tailwindcssAnimate // Gunakan variabel yang sudah di-import
  ],
};

export default config;