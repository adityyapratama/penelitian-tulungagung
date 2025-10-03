import heroui from "@heroui/theme/plugin";
import tailwindcssAnimate from "tailwindcss-animate";
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/components/(image|input|form).js"
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
     daisyui,
    heroui(),
    tailwindcssAnimate // Gunakan variabel yang sudah di-import
    
  ],
  daisyui: {},
};

export default config;