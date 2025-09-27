/**
 * Plugin Configuration
 * Configure which plugins to load and their settings
 */

module.exports = {
  // Plugin system configuration
  pluginDirectory: './plugins',
  autoLoad: true,
  
  // Individual plugin configurations
  plugins: {
    // Analytics Plugin - tracks page views and performance
    'analytics-plugin': {
      enabled: true,
      trackPageViews: true,
      trackPerformance: true,
      trackErrors: true,
      analyticsId: null, // Set your analytics ID here
      debug: false
    },

    // Build Optimizer Plugin - optimizes build output
    'build-optimizer-plugin': {
      enabled: true,
      minifyCSS: true,
      minifyJS: true,
      optimizeImages: false, // Set to true when image optimization is implemented
      generateManifest: true,
      compressionLevel: 9,
      debug: false
    }
  }
};