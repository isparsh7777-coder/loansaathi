import type { Config } from "tailwindcss";

// Design tokens for LoanSaathi
// ink      - primary trust color, headers, nav, body text on light bg
// marigold - the single action color: reserved for GET LOAN / primary CTAs only
// paper    - warm off-white background, not pure white (easier on cheap-phone screens)
// success  - eligible / verified states
// caution  - "more information required" / pending states
// line     - hairline borders / dividers
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14213D",
          700: "#1D2E52",
          500: "#3B4D78",
          100: "#E7EAF3",
        },
        marigold: {
          DEFAULT: "#F2A93B",
          600: "#DB9422",
          700: "#B9791A",
        },
        paper: "#FBF9F4",
        success: { DEFAULT: "#1B7A4D", 100: "#E1F3E8" },
        caution: { DEFAULT: "#B5590B", 100: "#FBEBD8" },
        line: "#E3DFD3",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        devanagari: ["var(--font-plex-devanagari)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "1rem",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,33,61,0.06), 0 8px 24px rgba(20,33,61,0.06)",
      },
      maxWidth: {
        mobile: "430px",
      },
    },
  },
  plugins: [],
};

export default config;
