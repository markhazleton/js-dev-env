import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  // Node.js files configuration (default for server-side code)
  {
    files: ["**/*.js"],
    ignores: ["docs/**/*.js", "public/**/*.js", "**/service-worker.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2021,
      globals: globals.node, // Enables Node.js globals (e.g., process, __dirname)
    },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_|^next$" }]
    }
  },
  // Node.js ES modules configuration
  {
    files: ["**/*.mjs", "tools/**/*.mjs"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2021,
      globals: {
        ...globals.node, // Enables Node.js globals (console, process, URL, etc.)
      }
    },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
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
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    }
  },
  // Browser environment configuration for client-side JavaScript files
  {
    files: ["public/js/**/*.js", "docs/js/**/*.js"],
    languageOptions: {
      sourceType: "script",
      ecmaVersion: 2021,
      globals: {
        ...globals.browser, // Enables browser globals (document, window, etc.)
        hljs: "readonly"     // Add highlight.js global
      }
    },
    rules: {
      "no-unused-vars": "warn" // Downgrade unused vars to warnings for client-side code
    }
  },
  // Service Worker configuration
  {
    files: ["**/service-worker.js"],
    languageOptions: {
      sourceType: "script",
      ecmaVersion: 2021,
      globals: {
        ...globals.serviceworker, // Enables service worker globals (self, caches, etc.)
      }
    },
    rules: {
      "no-unused-vars": "warn"
    }
  },
  pluginJs.configs.recommended, // Apply ESLint's recommended rules
];