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
          primary: "#00477B",
          "primary-content": "#FFFFFF",

          secondary: "#00477B",
          "secondary-content": "#FFFFFF",

          accent: "#B00000",
          "accent-content": "#FFFFFF",

          neutral: "#09131A",
          "neutral-content": "#ECF3F8",

          "base-100": "#09131A",
          "base-200": "#09131A",
          "base-300": "#67737C",
          "base-content": "#ECF3F8",

          info: "#00477B",
          "info-content": "#FFFFFF",
          success: "#00477B",
          "success-content": "#FFFFFF",
          warning: "#B00000",
          "warning-content": "#FFFFFF",
          error: "#B00000",
          "error-content": "#FFFFFF",

          "--rounded-btn": "0.7rem",
          "--tab-border": "2px",
          "--tab-radius": "0.7rem",

          // Custom CSS variables for icon and button states
          "--icon-color": "#ECF3F8",
          "--icon-color-muted": "#D8DFE4",
          "--icon-color-disabled": "#67737C",
          "--btn-disabled-bg": "#67737C",
          "--btn-disabled-color": "#FFFFFF",
          "--btn-disabled-border": "#67737C",

          // Optional polish
          "--navbar-padding": "0.8rem",
          "--border-color": "#67737C",
          "--tooltip-color": "#09131A"
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
          info: "#00477B",
          "info-content": "#FFFFFF",
          success: "#00477B",
          "success-content": "#FFFFFF",
          warning: "#B00000",
          "warning-content": "#FFFFFF",
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
