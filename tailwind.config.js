/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        text: "var(--text)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        shapeBg: "var(--shape-bg)",
        "dashboard-primary": "var(--dashboard-primary)",
      },
    },
  },
  plugins: [],
};

