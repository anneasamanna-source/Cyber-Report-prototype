/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)", soft: "var(--soft)", ink: "var(--ink)", muted: "var(--muted)", line: "var(--line)",
        navy: "var(--navy)", onnavy: "var(--onnavy)", saffron: "var(--saffron)", green: "var(--green)",
        greensoft: "var(--greensoft)", alert: "var(--alert)", alertink: "var(--alertink)",
      },
    },
  },
  plugins: [],
};
