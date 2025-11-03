import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  // Ignore built/bundled files and artifacts
  {
    ignores: [
      "docs/**/*",           // GitHub Pages output
      "coverage/**/*",       // Test coverage reports
      "artifacts/**/*",      // CI/CD artifacts
      "temp/**/*",           // Temporary files
      "**/node_modules/**",  // Dependencies
      "**/*.min.js",         // Minified files
      "**/dependencies.js",  // Bundled dependencies
      "**/dependencies.min.js"
    ]
  },
  // Node.js files configuration (default for server-side code)
  {
    files: ["**/*.js"],
    ignores: ["src/public/**/*.js", "src/tests/**/*.js", "**/service-worker.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2021,
      globals: globals.node, // Enables Node.js globals (e.g., process, __dirname)
    },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_|^next$", "varsIgnorePattern": "^_" }]
    }
  },
  // Node.js ES modules configuration
  {
    files: ["**/*.mjs", "build/**/*.mjs"],
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
    files: ["src/tests/**/*.js", "**/tests/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2021,
      globals: {
        ...globals.node,
        ...globals.jest, // Enables Jest globals (describe, test, expect, etc.)
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }]
    }
  },
  // Browser environment configuration for client-side JavaScript files
  {
    files: ["src/public/js/**/*.js"],
    ignores: ["**/dependencies.js", "**/*.min.js"],
    languageOptions: {
      sourceType: "script",
      ecmaVersion: 2021,
      globals: {
        ...globals.browser, // Enables browser globals (document, window, etc.)
        hljs: "readonly",   // highlight.js global
        jQuery: "readonly", // jQuery global
        pdfMake: "readonly", // pdfMake global
        jspdf: "readonly"   // jsPDF global
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }]
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
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }]
    }
  },
  pluginJs.configs.recommended, // Apply ESLint's recommended rules
];