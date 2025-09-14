#!/usr/bin/env node

/**
 * Build Configuration
 * Environment-specific settings, path configuration, and optimization settings
 */

const path = require('path');

const config = {
  // Environment detection
  environment: process.env.NODE_ENV || 'development',
  
  // Cache configuration
  cache: {
    enabled: process.env.NODE_ENV !== 'test',
    directory: '.build-cache',
    ttl: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    cleanOnStart: false
  },
  
  // Performance tracking
  performance: {
    tracking: true,
    reportPath: 'temp/reports/build-performance.json',
    showTrends: true
  },
  
  // Optimization settings
  optimization: {
    parallel: true,
    maxConcurrency: require('os').cpus().length,
    minifyHtml: process.env.NODE_ENV === 'production',
    sourceMap: process.env.NODE_ENV !== 'production'
  },
  
  // Path configuration
  paths: {
    root: process.cwd(),
    src: 'src',
    build: 'docs',
    output: 'docs',
    cache: '.build-cache',
    scripts: 'tools/build',
    assets: 'public',
    temp: 'temp',
    reports: 'temp/reports'
  },
  
  // File patterns
  patterns: {
    pug: '**/*.pug',
    scss: 'scss/**/*.scss',
    scripts: 'tools/**/*.js',
    assets: 'public/**/*',
    ignore: ['node_modules/**', '.git/**', 'temp/**', 'artifacts/**']
  },
  
  // Task dependencies
  dependencies: {
    'generate-static-site': ['copy-icons', 'copy-static-assets', 'build-css'],
    'build-css': [],
    'copy-icons': [],
    'copy-static-assets': []
  },
  
  // Parallel execution groups
  parallelGroups: [
    ['copy-icons', 'build-css'],
    ['copy-static-assets'],
    ['generate-static-site']
  ],
  
  // Error handling
  errorHandling: {
    retryCount: 2,
    retryDelay: 1000,
    continueOnError: false
  },
  
  // Environment-specific overrides
  environments: {
    development: {
      optimization: {
        minifyHtml: false,
        sourceMap: true
      },
      cache: {
        ttl: 5 * 60 * 1000 // 5 minutes
      }
    },
    production: {
      optimization: {
        minifyHtml: true,
        sourceMap: false
      },
      cache: {
        enabled: true,
        ttl: 24 * 60 * 60 * 1000 // 24 hours
      }
    },
    ci: {
      cache: {
        enabled: false
      },
      errorHandling: {
        continueOnError: false
      }
    }
  }
};

// Apply environment-specific overrides
const envConfig = config.environments[config.environment];
if (envConfig) {
  Object.assign(config, envConfig);
}

module.exports = config;
