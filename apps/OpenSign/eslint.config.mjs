import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";

export default [
  { ignores: ["**/build/**", "**/*.config.js"] },
  js.configs.recommended,
  react.configs.flat.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      // process: vite define replaces process.env at build time, so the identifier is provided at runtime.
      globals: { ...globals.browser, process: "readonly" },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/prop-types": "off",
      "no-unused-vars": "warn",
    },
  },
];
