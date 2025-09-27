/**
 * Feature Flag Middleware
 * Express middleware for exposing feature flags to templates
 */

const { isFeatureEnabled, getEnabledFeatures, features } = require('../config/features');

/**
 * Feature flag middleware for Express
 * Adds feature flags to res.locals for template access
 */
function featureMiddleware(preset = 'standard') {
  return (req, res, next) => {
    // Add feature checking functions to res.locals
    res.locals.isFeatureEnabled = isFeatureEnabled;
    res.locals.features = features;
    res.locals.enabledFeatures = getEnabledFeatures(preset);
    
    // Add preset-specific feature status
    res.locals.featureFlags = {
      // UI Features
      darkMode: isFeatureEnabled('ui.darkMode', preset),
      bootstrap: isFeatureEnabled('ui.bootstrap', preset),
      customCss: isFeatureEnabled('ui.customCss', preset),
      responsiveDesign: isFeatureEnabled('ui.responsiveDesign', preset),
      
      // Security Features
      helmet: isFeatureEnabled('security.helmet', preset),
      cors: isFeatureEnabled('security.cors', preset),
      rateLimit: isFeatureEnabled('security.rateLimit', preset),
      csp: isFeatureEnabled('security.csp', preset),
      
      // Development Features
      linting: isFeatureEnabled('development.linting', preset),
      testing: isFeatureEnabled('testing.jest', preset),
      hotReload: isFeatureEnabled('development.hotReload', preset),
      sourceMap: isFeatureEnabled('development.sourceMap', preset),
      
      // Advanced Features
      pwa: isFeatureEnabled('advanced.pwa', preset),
      docker: isFeatureEnabled('advanced.docker', preset),
      cicd: isFeatureEnabled('advanced.cicd', preset),
      monitoring: isFeatureEnabled('advanced.monitoring', preset),
      
      // API Features
      restApi: isFeatureEnabled('api.rest', preset),
      graphql: isFeatureEnabled('api.graphql', preset),
      websockets: isFeatureEnabled('api.websockets', preset),
      
      // Database Features
      mongodb: isFeatureEnabled('database.mongodb', preset),
      postgresql: isFeatureEnabled('database.postgresql', preset),
      redis: isFeatureEnabled('database.redis', preset),
      sqlite: isFeatureEnabled('database.sqlite', preset),
      
      // Build Features
      webpack: isFeatureEnabled('build.webpack', preset),
      sass: isFeatureEnabled('build.sass', preset),
      typescript: isFeatureEnabled('build.typescript', preset),
      minification: isFeatureEnabled('build.minification', preset)
    };
    
    next();
  };
}

/**
 * Check if a feature is enabled (helper function)
 */
function checkFeature(featurePath, preset = 'standard') {
  return isFeatureEnabled(featurePath, preset);
}

/**
 * Get feature-based configuration
 */
function getFeatureConfig(preset = 'standard') {
  const config = {
    preset,
    enabledFeatures: getEnabledFeatures(preset),
    ui: {
      darkMode: checkFeature('ui.darkMode', preset),
      bootstrap: checkFeature('ui.bootstrap', preset),
      customCss: checkFeature('ui.customCss', preset),
      responsiveDesign: checkFeature('ui.responsiveDesign', preset)
    },
    security: {
      helmet: checkFeature('security.helmet', preset),
      cors: checkFeature('security.cors', preset),
      rateLimit: checkFeature('security.rateLimit', preset),
      csp: checkFeature('security.csp', preset)
    },
    development: {
      linting: checkFeature('development.linting', preset),
      testing: checkFeature('development.testing', preset),
      hotReload: checkFeature('development.hotReload', preset),
      sourceMap: checkFeature('development.sourceMap', preset)
    },
    advanced: {
      pwa: checkFeature('advanced.pwa', preset),
      docker: checkFeature('advanced.docker', preset),
      cicd: checkFeature('advanced.cicd', preset),
      monitoring: checkFeature('advanced.monitoring', preset)
    }
  };
  
  return config;
}

module.exports = {
  featureMiddleware,
  checkFeature,
  getFeatureConfig
};