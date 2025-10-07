/**
 * Feature Configuration
 * Enable/disable features based on project needs
 */

const features = {
  // Core features (always enabled)
  core: {
    express: true,
    ejs: true,
    staticFiles: true,
    basicRouting: true
  },

  // UI/UX features
  ui: {
    bootstrap: true,
    icons: true,
    darkMode: true,
    responsive: true,
    components: true
  },

  // Development features
  development: {
    hotReload: true,
    sassCompilation: true,
    linting: true,
    formatting: true,
    gitHooks: false // Disabled by default
  },

  // Testing features
  testing: {
    jest: true,
    coverage: true,
    apiTests: true
  },

  // Security features
  security: {
    helmet: true,
    rateLimiting: true,
    compression: true,
    csp: true,
    inputValidation: true
  },

  // Build features
  build: {
    staticGeneration: true,
    assetOptimization: true,
    githubPages: true
  },

  // DevOps features
  devops: {
    docker: true,
    ci: true,
    healthChecks: true,
    monitoring: true
  },

  // Advanced features (disabled by default)
  advanced: {
    pwa: false,
    serviceWorker: false,
    database: false,
    api: false,
    caching: false
  }
};

// Feature presets for different use cases
const presets = {
  minimal: {
    description: 'Minimal setup for simple projects',
    features: {
      ...features,
      ui: { ...features.ui, components: false, icons: false },
      development: { ...features.development, linting: false, formatting: false },
      testing: { ...features.testing, coverage: false },
      security: { ...features.security, rateLimiting: false, csp: false },
      build: { ...features.build, staticGeneration: false },
      devops: { ...features.devops, docker: false, ci: false }
    }
  },

  standard: {
    description: 'Standard setup for most projects',
    features: features
  },

  production: {
    description: 'Production-ready with all features',
    features: {
      ...features,
      advanced: { ...features.advanced, pwa: true, serviceWorker: true, caching: true },
      development: { ...features.development, gitHooks: true }
    }
  },

  learning: {
    description: 'Learning-focused with extra documentation',
    features: {
      ...features,
      development: { ...features.development, gitHooks: false },
      testing: { ...features.testing, coverage: true },
      advanced: { ...features.advanced, api: true }
    }
  }
};

// Function to get current feature configuration
function getFeatures(preset = 'standard') {
  return presets[preset]?.features || features;
}

// Function to check if a feature is enabled
function isFeatureEnabled(featurePath, preset = 'standard') {
  const config = getFeatures(preset);
  const path = featurePath.split('.');
  let current = config;
  
  for (const key of path) {
    if (current[key] === undefined) {
      return false;
    }
    current = current[key];
  }
  
  return current === true;
}

// Function to get enabled features
function getEnabledFeatures(preset = 'standard') {
  const config = getFeatures(preset);
  const enabled = [];
  
  function traverse(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        traverse(value, currentPath);
      } else if (value === true) {
        enabled.push(currentPath);
      }
    }
  }
  
  traverse(config);
  return enabled;
}

// Function to generate package.json based on features
function generatePackageJson(preset = 'standard') {
  const config = getFeatures(preset);
  
  const dependencies = {
    // Core dependencies (always included)
    express: "^5.1.0",
    ejs: "^3.1.10",
    "express-ejs-layouts": "^2.5.1"
  };
  
  const devDependencies = {
    nodemon: "^3.1.10",
    sass: "^1.89.2"
  };
  
  // Add conditional dependencies based on features
  if (config.ui.bootstrap) {
    dependencies.bootstrap = "^5.3.7";
  }
  
  if (config.ui.icons) {
    dependencies["bootstrap-icons"] = "^1.13.1";
  }
  
  if (config.security.helmet) {
    dependencies.helmet = "^8.1.0";
  }
  
  if (config.security.rateLimiting) {
    dependencies["express-rate-limit"] = "^8.0.1";
  }
  
  if (config.security.compression) {
    dependencies.compression = "^1.8.1";
  }
  
  if (config.development.linting) {
    devDependencies.eslint = "^9.32.0";
    devDependencies["@eslint/js"] = "^9.32.0";
    devDependencies.globals = "^16.3.0";
  }
  
  if (config.development.formatting) {
    devDependencies.prettier = "^3.6.2";
  }
  
  if (config.testing.jest) {
    devDependencies.jest = "^30.0.5";
    devDependencies["@types/jest"] = "^30.0.0";
  }
  
  if (config.build.staticGeneration) {
    devDependencies["npm-run-all"] = "^4.1.5";
  }
  
  if (config.devops.docker) {
    // Docker doesn't require additional dependencies
  }
  
  return { dependencies, devDependencies };
}

// Function to generate scripts based on features
function generateScripts(preset = 'standard') {
  const config = getFeatures(preset);
  
  const scripts = {
    start: "node index.js",
    dev: "nodemon index.js"
  };
  
  if (config.development.sassCompilation) {
    scripts["build-css"] = "sass --load-path=node_modules scss/main.scss public/css/styles.css";
    scripts["watch-css"] = "sass --watch --load-path=node_modules scss/main.scss:public/css/styles.css";
  }
  
  if (config.development.hotReload) {
    scripts["start:dev"] = "npm-run-all --parallel watch-css dev";
  }
  
  if (config.testing.jest) {
    scripts.test = "jest";
    scripts["test:watch"] = "jest --watch";
    if (config.testing.coverage) {
      scripts["test:coverage"] = "jest --coverage";
    }
  }
  
  if (config.development.linting) {
    scripts.lint = "eslint .";
    scripts["lint:fix"] = "eslint . --fix";
  }
  
  if (config.build.staticGeneration) {
    scripts.build = "npm-run-all build-css";
  }
  
  return scripts;
}

module.exports = {
  features,
  presets,
  getFeatures,
  isFeatureEnabled,
  getEnabledFeatures,
  generatePackageJson,
  generateScripts
}; 