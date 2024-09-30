import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2021,
      globals: globals.node, // Enables Node.js globals (e.g., process, __dirname)
    },
    rules: {
      // Add your custom rules here if needed
    }
  },
  pluginJs.configs.recommended, // Apply ESLint's recommended rules
];
