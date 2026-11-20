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
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/prop-types": "off",
      "no-unused-vars": "off",
      "no-empty": "off",
      "no-case-declarations": "off",
      "react/no-deprecated": "off",
      "no-undef": "off",
    },
  },
];
