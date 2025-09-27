/**
 * Base Plugin Class
 * Abstract base class that all plugins should extend
 */

class BasePlugin {
  constructor(config = {}) {
    this.config = config;
    this.pluginManager = null;
  }

  /**
   * Get plugin name (required)
   */
  getName() {
    throw new Error('Plugin must implement getName() method');
  }

  /**
   * Get plugin version (required)
   */
  getVersion() {
    throw new Error('Plugin must implement getVersion() method');
  }

  /**
   * Get plugin description (optional)
   */
  getDescription() {
    return 'No description provided';
  }

  /**
   * Get plugin author (optional)
   */
  getAuthor() {
    return 'Unknown';
  }

  /**
   * Get plugin dependencies (optional)
   */
  getDependencies() {
    return [];
  }

  /**
   * Initialize plugin (required)
   */
  async initialize(pluginManager) {
    this.pluginManager = pluginManager;
    // Override in subclass
  }

  /**
   * Cleanup plugin resources (optional)
   */
  async cleanup() {
    // Override in subclass if needed
  }

  /**
   * Get plugin configuration
   */
  getConfig(key = null) {
    if (key) {
      return this.config[key];
    }
    return this.config;
  }

  /**
   * Set plugin configuration
   */
  setConfig(key, value) {
    if (typeof key === 'object') {
      Object.assign(this.config, key);
    } else {
      this.config[key] = value;
    }
  }

  /**
   * Register a hook with the plugin manager
   */
  registerHook(hookName, callback, priority = 10) {
    if (!this.pluginManager) {
      throw new Error('Plugin not initialized - cannot register hooks');
    }
    this.pluginManager.registerHook(hookName, callback, priority);
  }

  /**
   * Execute a hook
   */
  async executeHook(hookName, ...args) {
    if (!this.pluginManager) {
      throw new Error('Plugin not initialized - cannot execute hooks');
    }
    return await this.pluginManager.executeHook(hookName, ...args);
  }

  /**
   * Get another plugin instance
   */
  getPlugin(name) {
    if (!this.pluginManager) {
      throw new Error('Plugin not initialized - cannot access other plugins');
    }
    return this.pluginManager.getPlugin(name);
  }

  /**
   * Log message with plugin name prefix
   */
  log(level, message, ...args) {
    const prefix = `[${this.getName()}]`;
    switch (level) {
      case 'error':
        console.error(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'debug':
        if (this.config.debug) {
          console.log(prefix, message, ...args);
        }
        break;
      default:
        console.log(prefix, message, ...args);
    }
  }

  /**
   * Check if plugin is enabled
   */
  isEnabled() {
    return this.config.enabled !== false;
  }

  /**
   * Enable plugin
   */
  enable() {
    this.config.enabled = true;
  }

  /**
   * Disable plugin
   */
  disable() {
    this.config.enabled = false;
  }
}

module.exports = BasePlugin;