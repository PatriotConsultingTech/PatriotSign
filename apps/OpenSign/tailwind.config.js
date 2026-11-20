/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {}
  },
  plugins: [
    require("daisyui"),
    function ({ addUtilities, addVariant }) {
      // ✅ Variants that match html[data-theme="..."] (or any ancestor with data-theme)
      addVariant("opensigncss", '[data-theme="opensigncss"] &');
      addVariant("opensigndark", '[data-theme="opensigndark"] &');

      addUtilities({
        // Prevent iOS long-press popup
        ".touch-callout-none": {
          "-webkit-touch-callout": "none"
        },
        // VS Code-style disabled button for all themes
        ".op-btn-vscode-disabled": {
          "background-color": "#3C3C3C !important",
          color: "#CCCCCC !important",
          "border-color": "#565656 !important",
          cursor: "not-allowed !important",
          opacity: "1 !important",
          "&:hover": {
            "background-color": "#3C3C3C !important",
            color: "#CCCCCC !important",
            "border-color": "#565656 !important",
            transform: "none !important"
          }
        },
        // Dark mode icon improvements using DaisyUI theme detection
        '[data-theme="opensigndark"] .icon-improved': {
          color: "#CCCCCC !important"
        },
        '[data-theme="opensigndark"] .icon-muted': {
          color: "#999999 !important"
        },
        '[data-theme="opensigndark"] .icon-disabled': {
          color: "#858585 !important"
        },
        // Gray text improvements for dark mode
        '[data-theme="opensigndark"] .text-gray-500': {
          color: "#CCCCCC !important"
        },
        '[data-theme="opensigndark"] .text-gray-400': {
          color: "#999999 !important"
        },
        '[data-theme="opensigndark"] .text-gray-600': {
          color: "#CCCCCC !important"
        },
        // CSS variable utilities that work with arbitrary values
        ".icon-themed": {
          color: "var(--icon-color)"
        },
        ".icon-themed-muted": {
          color: "var(--icon-color-muted)"
        },
        ".icon-themed-disabled": {
          color: "var(--icon-color-disabled)"
        },
        ".btn-themed-disabled": {
          "background-color": "var(--btn-disabled-bg)",
          color: "var(--btn-disabled-color)",
          "border-color": "var(--btn-disabled-border)",
          cursor: "not-allowed",
          "&:hover": {
            "background-color": "var(--btn-disabled-bg)",
            color: "var(--btn-disabled-color)",
            "border-color": "var(--btn-disabled-border)",
            transform: "none"
          }
        }
      });
    }
  ],
  daisyui: {
    // themes: true,
    themes: [
      {
        opensigndark: {
          primary: "#60A7D6",
          "primary-content": "#09131A",

          secondary: "#16275C",
          "secondary-content": "#F7F9FC",

          accent: "#B00000",
          "accent-content": "#FFFFFF",

          neutral: "#142942",
          "neutral-content": "#f1f5fa",

          "base-100": "#16263b",
          "base-200": "#0b2347",
          "base-300": "#294764",
          "base-content": "#f1f5fa",

          info: "#2b6099",
          success: "#4a8fca",
          warning: "#e2657b",
          error: "#f07b8e",

          "--rounded-btn": "0.7rem",
          "--tab-border": "2px",
          "--tab-radius": "0.7rem",

          // Custom CSS variables for icon and button states
          "--icon-color": "#f1f5fa",
          "--icon-color-muted": "#b3c1d2",
          "--icon-color-disabled": "#788da7",
          "--btn-disabled-bg": "#294764",
          "--btn-disabled-color": "#b3c1d2",
          "--btn-disabled-border": "#456483",

          // Optional polish
          "--navbar-padding": "0.8rem",
          "--border-color": "#456483",
          "--tooltip-color": "#06162f"
        }
      },
      {
        opensigncss: {
          primary: "#00477B",
          "primary-content": "#FFFFFF",
          secondary: "#00477B",
          "secondary-content": "#FFFFFF",
          accent: "#B00000",
          "accent-content": "#FFFFFF",
          neutral: "#09131A",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#ECF3F8",
          "base-300": "#D8DFE4",
          "base-content": "#09131A",
          info: "#2b6099",
          "info-content": "#f7f9fc",
          success: "#4a8fca",
          "success-content": "#f7f9fc",
          warning: "#e2657b",
          "warning-content": "#142942",
          error: "#B00000",
          "error-content": "#FFFFFF",
          "--rounded-btn": "0.7rem",
          "--tab-border": "2px",
          "--tab-radius": "0.7rem"
        }
      }
    ],
    prefix: "op-"
  }
};
