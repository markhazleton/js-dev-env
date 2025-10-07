/**
 * Plugin API Interface
 * Defines the standard hooks and interfaces for plugin integration
 */

/**
 * Standard Plugin Hooks
 * These hooks are available for plugins to register callbacks
 */
const PLUGIN_HOOKS = {
  // Application lifecycle hooks
  APP_BEFORE_START: 'app:before-start',
  APP_AFTER_START: 'app:after-start',
  APP_BEFORE_SHUTDOWN: 'app:before-shutdown',
  APP_AFTER_SHUTDOWN: 'app:after-shutdown',

  // Build system hooks
  BUILD_BEFORE_START: 'build:before-start',
  BUILD_AFTER_START: 'build:after-start',
  BUILD_BEFORE_SCSS: 'build:before-scss',
  BUILD_AFTER_SCSS: 'build:after-scss',
  BUILD_BEFORE_ASSETS: 'build:before-assets',
  BUILD_AFTER_ASSETS: 'build:after-assets',
  BUILD_BEFORE_STATIC: 'build:before-static',
  BUILD_AFTER_STATIC: 'build:after-static',

  // Express middleware hooks
  MIDDLEWARE_BEFORE_SECURITY: 'middleware:before-security',
  MIDDLEWARE_AFTER_SECURITY: 'middleware:after-security',
  MIDDLEWARE_BEFORE_ROUTES: 'middleware:before-routes',
  MIDDLEWARE_AFTER_ROUTES: 'middleware:after-routes',

  // Request/Response hooks
  REQUEST_BEFORE_PROCESS: 'request:before-process',
  REQUEST_AFTER_PROCESS: 'request:after-process',
  RESPONSE_BEFORE_SEND: 'response:before-send',
  RESPONSE_AFTER_SEND: 'response:after-send',

  // Template rendering hooks
  TEMPLATE_BEFORE_RENDER: 'template:before-render',
  TEMPLATE_AFTER_RENDER: 'template:after-render',
  TEMPLATE_DATA_MODIFY: 'template:data-modify',

  // Asset processing hooks
  ASSET_BEFORE_PROCESS: 'asset:before-process',
  ASSET_AFTER_PROCESS: 'asset:after-process',
  ASSET_OPTIMIZE: 'asset:optimize',

  // Cache hooks
  CACHE_BEFORE_SET: 'cache:before-set',
  CACHE_AFTER_SET: 'cache:after-set',
  CACHE_BEFORE_GET: 'cache:before-get',
  CACHE_AFTER_GET: 'cache:after-get',
  CACHE_INVALIDATE: 'cache:invalidate',

  // Performance monitoring hooks
  PERFORMANCE_METRIC: 'performance:metric',
  PERFORMANCE_REPORT: 'performance:report',

  // Feature flag hooks
  FEATURE_CHECK: 'feature:check',
  FEATURE_MODIFY: 'feature:modify',

  // CLI hooks
  CLI_BEFORE_COMMAND: 'cli:before-command',
  CLI_AFTER_COMMAND: 'cli:after-command',
  CLI_REGISTER_COMMANDS: 'cli:register-commands',

  // Testing hooks
  TEST_BEFORE_RUN: 'test:before-run',
  TEST_AFTER_RUN: 'test:after-run',
  TEST_SETUP: 'test:setup',
  TEST_TEARDOWN: 'test:teardown'
};

/**
 * Plugin Interface Requirements
 */
const PLUGIN_INTERFACE = {
  // Required methods
  REQUIRED_METHODS: [
    'getName',
    'getVersion',
    'initialize'
  ],

  // Optional methods
  OPTIONAL_METHODS: [
    'getDescription',
    'getAuthor',
    'getDependencies',
    'cleanup',
    'configure',
    'validate'
  ],

  // Plugin types
  PLUGIN_TYPES: {
    MIDDLEWARE: 'middleware',
    BUILD: 'build',
    CLI: 'cli',
    TEMPLATE: 'template',
    ASSET: 'asset',
    CACHE: 'cache',
    PERFORMANCE: 'performance',
    FEATURE: 'feature',
    UTILITY: 'utility'
  }
};

/**
 * Plugin Configuration Schema
 */
const PLUGIN_CONFIG_SCHEMA = {
  // Plugin identification
  name: 'string',
  version: 'string',
  description: 'string',
  author: 'string',
  
  // Plugin behavior
  enabled: 'boolean',
  priority: 'number',
  type: 'string',
  
  // Plugin dependencies
  dependencies: 'array',
  peerDependencies: 'array',
  
  // Plugin configuration
  config: 'object',
  
  // Plugin metadata
  tags: 'array',
  category: 'string',
  license: 'string',
  repository: 'string'
};

/**
 * Plugin Helper Functions
 */
class PluginAPI {
  constructor(pluginManager) {
    this.pluginManager = pluginManager;
  }

  /**
   * Create Express middleware from plugin
   */
  createMiddleware(plugin, options = {}) {
    return (req, res, next) => {
      if (typeof plugin.middleware === 'function') {
        return plugin.middleware(req, res, next, options);
      }
      next();
    };
  }

  /**
   * Create CLI command from plugin
   */
  createCommand(plugin, commandName, options = {}) {
    if (typeof plugin.executeCommand === 'function') {
      return {
        name: commandName,
        description: plugin.getDescription ? plugin.getDescription() : 'Plugin command',
        options: options,
        handler: (args) => plugin.executeCommand(commandName, args)
      };
    }
    return null;
  }

  /**
   * Create build task from plugin
   */
  createBuildTask(plugin, taskName, options = {}) {
    if (typeof plugin.executeBuildTask === 'function') {
      return {
        name: taskName,
        description: plugin.getDescription ? plugin.getDescription() : 'Plugin build task',
        priority: options.priority || 10,
        handler: (buildContext) => plugin.executeBuildTask(taskName, buildContext)
      };
    }
    return null;
  }

  /**
   * Validate plugin configuration
   */
  validatePluginConfig(config) {
    const errors = [];
    
    // Check required fields
    if (!config.name || typeof config.name !== 'string') {
      errors.push('Plugin name is required and must be a string');
    }
    
    if (!config.version || typeof config.version !== 'string') {
      errors.push('Plugin version is required and must be a string');
    }
    
    // Validate plugin type
    if (config.type && !Object.values(PLUGIN_INTERFACE.PLUGIN_TYPES).includes(config.type)) {
      errors.push(`Invalid plugin type: ${config.type}`);
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Get available hooks
   */
  getAvailableHooks() {
    return Object.values(PLUGIN_HOOKS);
  }

  /**
   * Get plugin interface requirements
   */
  getPluginInterface() {
    return PLUGIN_INTERFACE;
  }

  /**
   * Get configuration schema
   */
  getConfigSchema() {
    return PLUGIN_CONFIG_SCHEMA;
  }
}

module.exports = {
  PLUGIN_HOOKS,
  PLUGIN_INTERFACE,
  PLUGIN_CONFIG_SCHEMA,
  PluginAPI
};