/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./styles/theme.css",
    "./node_modules/@nextui-org/theme/dist/components/(calendar|date-input|date-picker|listbox|select|button|ripple|spinner|form|popover|divider|scroll-shadow).js",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          100: "#72AEC8",
        },
        dark: {
          100: "#FFFFFF",
          200: "#202020",
          300: "#252525",
          400: "#191919",
          450: "#D9D9D9",
        },
        light: {
          500: "#272727",
          600: "#E4DEE4",
          800: "#FFFFFF",
          850: "#3A3A3A",
        },
        headerTiltle: "#666666",
        "accent-blue": "#1DA1F2",
        "dark-green": "#00B135",
        "border-color": "#D9D9D9",
        "custom-green": "#bee7c5",
        "light-red": "#F8CED0",
        "light-blue": "#BCF0F6",
        "light-yellow": "#FFFEDE",
        "inactive-background": "#C4C4C4",
        "import-bg-blue": "#EAF9FF",
        background: "hsl(var(--background))", // Định nghĩa màu nền tùy chỉnh
        foreground: "hsl(var(--foreground))", // Định nghĩa màu chữ tùy chỉnh
        border: "hsl(var(--border))",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        spaceGrotesk: ["var(--font-spaceGrotesk)"],
      },
      boxShadow: {
        "light-100":
          "0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px rgba(184, 184, 184, 0.02), 0px 2px 4px 0px rgba(184, 184, 184, 0.03)",
        "light-200": "10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
        "light-300": "-10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
        "dark-100": "0px 2px 10px 0px rgba(46, 52, 56, 0.10)",
        "dark-200": "2px 0px 20px 0px rgba(39, 36, 36, 0.04)",
      },
      backgroundImage: {
        "auth-dark": "url('/assets/images/auth-dark.png')",
        "auth-light": "url('/assets/images/auth-light.png')",
      },
      screens: {
        xs: "420px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};
