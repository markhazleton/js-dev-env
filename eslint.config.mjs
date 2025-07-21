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
  // Test files configuration
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2021,
      globals: {
        ...globals.node,
        ...globals.jest, // Enables Jest globals (describe, test, expect, etc.)
      }
    },
    rules: {
      "no-unused-vars": "warn"
    }
  },
  // Add browser environment configuration for client-side JavaScript files
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2021,
      globals: {
        ...globals.browser, // Enables browser globals (document, window, etc.)
        hljs: "readonly"     // Add highlight.js global
      }
    },
    rules: {
      "no-unused-vars": "warn" // Downgrade unused vars to warnings
    }
  },
  pluginJs.configs.recommended, // Apply ESLint's recommended rules
];