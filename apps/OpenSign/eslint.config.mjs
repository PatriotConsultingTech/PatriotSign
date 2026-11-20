import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["**/build/**", "**/*.config.js"] },
  js.configs.recommended,
  react.configs.flat.recommended,
  // The app uses the automatic JSX runtime, so React does not need to be in scope.
  react.configs.flat["jsx-runtime"],
  {
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
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
