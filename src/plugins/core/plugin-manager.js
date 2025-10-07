/**
 * Plugin System Core
 * Main plugin manager and registry for extensible functionality
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class PluginManager extends EventEmitter {
  constructor() {
    super();
    this.plugins = new Map();
    this.hooks = new Map();
    this.pluginConfigs = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize the plugin system
   */
  async initialize(options = {}) {
    if (this.isInitialized) {
      return;
    }

    const {
      pluginDirectory = path.join(process.cwd(), 'plugins'),
      configFile = path.join(process.cwd(), 'src', 'config', 'plugins.config.js')
    } = options;

    this.pluginDirectory = pluginDirectory;
    this.configFile = configFile;

    // Load plugin configuration
    await this.loadPluginConfig();

    // Discover and load plugins
    await this.discoverPlugins();

    // Initialize all plugins
    await this.initializePlugins();

    this.isInitialized = true;
    this.emit('initialized');
    
    console.log(`🔌 Plugin system initialized with ${this.plugins.size} plugins`);
  }

  /**
   * Load plugin configuration
   */
  async loadPluginConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        const config = require(this.configFile);
        Object.entries(config.plugins || {}).forEach(([name, pluginConfig]) => {
          this.pluginConfigs.set(name, pluginConfig);
        });
      }
    } catch (error) {
      console.warn('Failed to load plugin config:', error.message);
    }
  }

  /**
   * Discover plugins in the plugin directory only
   */
  async discoverPlugins() {
    // Only scan the designated plugins directory to avoid loading npm packages as plugins
    if (fs.existsSync(this.pluginDirectory)) {
      await this.scanDirectory(this.pluginDirectory);
    }
  }

  /**
   * Scan directory for plugins
   */
  async scanDirectory(directory) {
    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        // Skip system directories and files
        if (item.startsWith('.') || item === 'core') {
          continue;
        }

        const itemPath = path.join(directory, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          // Check if it's a legitimate plugin directory with index.js
          const indexPath = path.join(itemPath, 'index.js');
          
          if (fs.existsSync(indexPath)) {
            await this.loadPlugin(item, itemPath);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to scan plugin directory ${directory}:`, error.message);
    }
  }

  /**
   * Load a single plugin
   */
  async loadPlugin(name, pluginPath) {
    try {
      // Skip if plugin is disabled in config
      const config = this.pluginConfigs.get(name);
      if (config && config.enabled === false) {
        console.log(`⏭️  Skipping disabled plugin: ${name}`);
        return;
      }

      // Try to load the plugin
      let PluginClass;
      const indexPath = path.join(pluginPath, 'index.js');
      
      if (fs.existsSync(indexPath)) {
        PluginClass = require(indexPath);
      } else {
        // Try to load from package.json main field
        const packageJsonPath = path.join(pluginPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
          const mainFile = packageJson.main || 'index.js';
          PluginClass = require(path.join(pluginPath, mainFile));
        }
      }

      if (PluginClass) {
        // Create plugin instance
        const pluginInstance = new PluginClass(config || {});
        
        // Validate plugin interface
        if (!this.validatePlugin(pluginInstance)) {
          console.warn(`❌ Invalid plugin interface: ${name}`);
          return;
        }

        // Store plugin
        this.plugins.set(name, {
          instance: pluginInstance,
          path: pluginPath,
          config: config || {},
          name: name
        });

        console.log(`✅ Loaded plugin: ${name}`);
      }
    } catch (error) {
      console.error(`❌ Failed to load plugin ${name}:`, error.message);
    }
  }

  /**
   * Validate plugin interface
   */
  validatePlugin(plugin) {
    // Check required methods
    const requiredMethods = ['getName', 'getVersion', 'initialize'];
    for (const method of requiredMethods) {
      if (typeof plugin[method] !== 'function') {
        return false;
      }
    }
    return true;
  }

  /**
   * Initialize all loaded plugins
   */
  async initializePlugins() {
    const initPromises = [];

    for (const [name, pluginData] of this.plugins) {
      initPromises.push(this.initializePlugin(name, pluginData));
    }

    await Promise.allSettled(initPromises);
  }

  /**
   * Initialize a single plugin
   */
  async initializePlugin(name, pluginData) {
    try {
      await pluginData.instance.initialize(this);
      this.emit('pluginInitialized', name, pluginData.instance);
      console.log(`🚀 Initialized plugin: ${name}`);
    } catch (error) {
      console.error(`❌ Failed to initialize plugin ${name}:`, error.message);
    }
  }

  /**
   * Register a hook
   */
  registerHook(hookName, callback, priority = 10) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }

    const hooks = this.hooks.get(hookName);
    hooks.push({ callback, priority });
    
    // Sort by priority (lower number = higher priority)
    hooks.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Execute a hook
   */
  async executeHook(hookName, ...args) {
    const hooks = this.hooks.get(hookName);
    if (!hooks || hooks.length === 0) {
      return args;
    }

    let result = args;
    for (const hook of hooks) {
      try {
        const hookResult = await hook.callback(...result);
        if (hookResult !== undefined) {
          result = Array.isArray(hookResult) ? hookResult : [hookResult];
        }
      } catch (error) {
        console.error(`Hook ${hookName} failed:`, error.message);
      }
    }

    return result;
  }

  /**
   * Get plugin by name
   */
  getPlugin(name) {
    const pluginData = this.plugins.get(name);
    return pluginData ? pluginData.instance : null;
  }

  /**
   * Get all plugins
   */
  getAllPlugins() {
    const result = {};
    for (const [name, pluginData] of this.plugins) {
      result[name] = pluginData.instance;
    }
    return result;
  }

  /**
   * Get plugin information
   */
  getPluginInfo(name) {
    const pluginData = this.plugins.get(name);
    if (!pluginData) {
      return null;
    }

    return {
      name: pluginData.name,
      version: pluginData.instance.getVersion(),
      description: pluginData.instance.getDescription ? pluginData.instance.getDescription() : 'No description',
      config: pluginData.config,
      path: pluginData.path
    };
  }

  /**
   * Get all plugin information
   */
  getAllPluginInfo() {
    const result = [];
    for (const [name] of this.plugins) {
      result.push(this.getPluginInfo(name));
    }
    return result;
  }

  /**
   * Unload a plugin
   */
  async unloadPlugin(name) {
    const pluginData = this.plugins.get(name);
    if (!pluginData) {
      return false;
    }

    try {
      // Call cleanup if available
      if (typeof pluginData.instance.cleanup === 'function') {
        await pluginData.instance.cleanup();
      }

      this.plugins.delete(name);
      this.emit('pluginUnloaded', name);
      console.log(`🗑️  Unloaded plugin: ${name}`);
      return true;
    } catch (error) {
      console.error(`Failed to unload plugin ${name}:`, error.message);
      return false;
    }
  }

  /**
   * Reload a plugin
   */
  async reloadPlugin(name) {
    const pluginData = this.plugins.get(name);
    if (!pluginData) {
      return false;
    }

    const pluginPath = pluginData.path;
    await this.unloadPlugin(name);
    
    // Clear require cache
    const indexPath = path.join(pluginPath, 'index.js');
    delete require.cache[require.resolve(indexPath)];
    
    await this.loadPlugin(name, pluginPath);
    
    const newPluginData = this.plugins.get(name);
    if (newPluginData) {
      await this.initializePlugin(name, newPluginData);
      return true;
    }
    
    return false;
  }

  /**
   * Cleanup all plugins
   */
  async cleanup() {
    const cleanupPromises = [];
    
    for (const [name, pluginData] of this.plugins) {
      if (typeof pluginData.instance.cleanup === 'function') {
        cleanupPromises.push(
          pluginData.instance.cleanup().catch(error => 
            console.error(`Plugin ${name} cleanup failed:`, error.message)
          )
        );
      }
    }

    await Promise.allSettled(cleanupPromises);
    this.plugins.clear();
    this.hooks.clear();
    this.isInitialized = false;
    
    console.log('🧹 Plugin system cleaned up');
  }
}

// Create singleton instance
const pluginManager = new PluginManager();

module.exports = {
  PluginManager,
  pluginManager
};