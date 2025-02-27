import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      pluginReact
    },
    rules: {
      "react/react-in-jsx-scope": "off"
    },
  },
  {
    ignores: [
      ".cargo/*",
      ".cargo-husky/*",
      ".vscode/*",
      "migrations/*",
      "node_modules/*",
      "postgres/*",
      "server/*",
      "target/*",
      "static/*"
    ]
  }
];
