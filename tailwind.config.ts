import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10213F",
        royal: "#3156D4",
        mist: "#F5F7FB",
        line: "#E7EBF3",
      },
      boxShadow: {
        soft: "0 10px 35px rgba(20, 37, 73, 0.07)",
        card: "0 1px 2px rgba(16, 33, 63, 0.03), 0 10px 24px rgba(16, 33, 63, 0.045)",
      },
    },
  },
  plugins: [],
};

export default config;
