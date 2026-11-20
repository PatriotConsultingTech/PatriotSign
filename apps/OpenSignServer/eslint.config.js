import js from "@eslint/js";
import globals from "globals";
import babelParser from "@babel/eslint-parser";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        Parse: "writable",
      },
      parserOptions: {
        requireConfigFile: false,
      },
    },
    rules: {
      indent: ["error", 2, { SwitchCase: 1 }],
      "linebreak-style": ["error", "unix"],
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "space-in-parens": ["error", "never"],
      "no-multiple-empty-lines": "warn",
      "prefer-const": "error",
      "space-infix-ops": "error",
      "no-useless-escape": "off",
      "require-atomic-updates": "off",
      "no-var": "warn",
      "no-await-in-loop": "warn",
    },
  },
];
