#!/usr/bin/env node

/**
 * Plugin Manager CLI
 * Command-line interface for managing plugins
 */

const path = require('path');
const fs = require('fs');
const { pluginManager } = require('./core/plugin-manager');
const { PluginAPI } = require('./core/plugin-api');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const pluginName = args[1];
const additionalArgs = args.slice(2);

function showHelp() {
  console.log(`
🔌 Plugin Manager CLI

Usage:
  node plugins/plugin-cli.js <command> [options]

Commands:
  list                    List all available plugins
  info <plugin>          Show detailed plugin information
  enable <plugin>        Enable a plugin
  disable <plugin>       Disable a plugin
  reload <plugin>        Reload a plugin
  install <path>         Install plugin from path
  uninstall <plugin>     Uninstall a plugin
  create <name>          Create a new plugin template
  
Plugin Commands:
  run <plugin> <cmd>     Run a plugin-specific command
  
System Commands:
  init                   Initialize plugin system
  cleanup                Clean up plugin system
  validate <plugin>      Validate plugin configuration
  
Examples:
  node plugins/plugin-cli.js list
  node plugins/plugin-cli.js info analytics-plugin
  node plugins/plugin-cli.js run analytics-plugin analytics
  node plugins/plugin-cli.js create my-custom-plugin
`);
}

async function listPlugins() {
  try {
    await pluginManager.initialize();
    const plugins = pluginManager.getAllPluginInfo();
    
    if (plugins.length === 0) {
      console.log('📦 No plugins found');
      return;
    }

    console.log('\n🔌 Available Plugins:\n');
    
    plugins.forEach(plugin => {
      const status = plugin.config.enabled !== false ? '✅' : '❌';
      console.log(`${status} ${plugin.name} v${plugin.version}`);
      console.log(`   ${plugin.description}`);
      if (plugin.config.type) {
        console.log(`   Type: ${plugin.config.type}`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to list plugins:', error.message);
  }
}

async function showPluginInfo(pluginName) {
  try {
    await pluginManager.initialize();
    const info = pluginManager.getPluginInfo(pluginName);
    
    if (!info) {
      console.error(`❌ Plugin not found: ${pluginName}`);
      return;
    }

    console.log(`\n📋 Plugin Information: ${info.name}\n`);
    console.log(`Name: ${info.name}`);
    console.log(`Version: ${info.version}`);
    console.log(`Description: ${info.description}`);
    console.log(`Path: ${info.path}`);
    console.log(`Enabled: ${info.config.enabled !== false ? 'Yes' : 'No'}`);
    
    if (info.config.type) {
      console.log(`Type: ${info.config.type}`);
    }
    
    if (Object.keys(info.config).length > 0) {
      console.log('\nConfiguration:');
      Object.entries(info.config).forEach(([key, value]) => {
        console.log(`  ${key}: ${JSON.stringify(value)}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to show plugin info:', error.message);
  }
}

async function enablePlugin(pluginName) {
  try {
    await pluginManager.initialize();
    const plugin = pluginManager.getPlugin(pluginName);
    
    if (!plugin) {
      console.error(`❌ Plugin not found: ${pluginName}`);
      return;
    }

    plugin.enable();
    console.log(`✅ Plugin enabled: ${pluginName}`);
  } catch (error) {
    console.error('❌ Failed to enable plugin:', error.message);
  }
}

async function disablePlugin(pluginName) {
  try {
    await pluginManager.initialize();
    const plugin = pluginManager.getPlugin(pluginName);
    
    if (!plugin) {
      console.error(`❌ Plugin not found: ${pluginName}`);
      return;
    }

    plugin.disable();
    console.log(`❌ Plugin disabled: ${pluginName}`);
  } catch (error) {
    console.error('❌ Failed to disable plugin:', error.message);
  }
}

async function reloadPlugin(pluginName) {
  try {
    await pluginManager.initialize();
    const success = await pluginManager.reloadPlugin(pluginName);
    
    if (success) {
      console.log(`🔄 Plugin reloaded: ${pluginName}`);
    } else {
      console.error(`❌ Failed to reload plugin: ${pluginName}`);
    }
  } catch (error) {
    console.error('❌ Plugin reload failed:', error.message);
  }
}

async function runPluginCommand(pluginName, commandName, commandArgs) {
  try {
    await pluginManager.initialize();
    const plugin = pluginManager.getPlugin(pluginName);
    
    if (!plugin) {
      console.error(`❌ Plugin not found: ${pluginName}`);
      return;
    }

    if (typeof plugin.executeCommand !== 'function') {
      console.error(`❌ Plugin ${pluginName} does not support commands`);
      return;
    }

    await plugin.executeCommand(commandName, commandArgs);
  } catch (error) {
    console.error('❌ Plugin command failed:', error.message);
  }
}

async function createPlugin(pluginName) {
  try {
    const pluginDir = path.join(process.cwd(), 'src', 'plugins', 'custom', pluginName);
    
    if (fs.existsSync(pluginDir)) {
      console.error(`❌ Plugin directory already exists: ${pluginDir}`);
      return;
    }

    // Create plugin directory
    fs.mkdirSync(pluginDir, { recursive: true });

    // Create plugin template
    const pluginTemplate = createPluginTemplate(pluginName);
    const indexPath = path.join(pluginDir, 'index.js');
    fs.writeFileSync(indexPath, pluginTemplate);

    // Create package.json
    const packageJson = {
      name: pluginName,
      version: '1.0.0',
      description: `Custom plugin: ${pluginName}`,
      main: 'index.js',
      author: 'Developer',
      license: 'MIT'
    };
    const packagePath = path.join(pluginDir, 'package.json');
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

    // Create README
    const readme = createPluginReadme(pluginName);
    const readmePath = path.join(pluginDir, 'README.md');
    fs.writeFileSync(readmePath, readme);

    console.log(`✅ Plugin template created: ${pluginDir}`);
    console.log('📝 Edit the files to customize your plugin');
  } catch (error) {
    console.error('❌ Failed to create plugin:', error.message);
  }
}

function createPluginTemplate(pluginName) {
  return `/**
 * ${pluginName} Plugin
 * Custom plugin generated from template
 */

const BasePlugin = require('../../core/base-plugin');
const { PLUGIN_HOOKS } = require('../../core/plugin-api');

class ${toPascalCase(pluginName)}Plugin extends BasePlugin {
  constructor(config = {}) {
    super({
      enabled: true,
      ...config
    });
  }

  getName() {
    return '${pluginName}';
  }

  getVersion() {
    return '1.0.0';
  }

  getDescription() {
    return 'Custom plugin: ${pluginName}';
  }

  getAuthor() {
    return 'Developer';
  }

  async initialize(pluginManager) {
    await super.initialize(pluginManager);
    
    if (!this.isEnabled()) {
      return;
    }

    // Register hooks here
    // Example: this.registerHook(PLUGIN_HOOKS.REQUEST_BEFORE_PROCESS, this.handleRequest.bind(this), 10);

    this.log('info', '${pluginName} plugin initialized');
  }

  /**
   * Example hook handler
   */
  async handleRequest(req, res, next) {
    // Your custom logic here
    this.log('debug', 'Processing request:', req.path);
    return [req, res, next];
  }

  /**
   * Express middleware (optional)
   */
  middleware(req, res, next) {
    if (!this.isEnabled()) {
      return next();
    }

    // Your middleware logic here
    next();
  }

  /**
   * CLI command handler (optional)
   */
  async executeCommand(commandName, args) {
    if (commandName === 'hello') {
      console.log('Hello from ${pluginName} plugin!');
      return;
    }

    console.log(\`Unknown command: \${commandName}\`);
  }

  async cleanup() {
    // Cleanup resources here
    this.log('info', '${pluginName} plugin cleaned up');
  }
}

module.exports = ${toPascalCase(pluginName)}Plugin;
`;
}

function createPluginReadme(pluginName) {
  return `# ${pluginName} Plugin

Custom plugin generated from template.

## Description

This plugin provides custom functionality for the JsBootSpark starter kit.

## Configuration

Add configuration to your \`plugins.config.js\`:

\`\`\`javascript
module.exports = {
  plugins: {
    '${pluginName}': {
      enabled: true,
      // Add your configuration options here
    }
  }
};
\`\`\`

## Usage

### As Middleware

The plugin automatically registers Express middleware when enabled.

### CLI Commands

Run plugin commands using:

\`\`\`bash
node plugins/plugin-cli.js run ${pluginName} <command>
\`\`\`

Available commands:
- \`hello\` - Test command

## Development

To modify this plugin:

1. Edit \`index.js\` to add your functionality
2. Use the BasePlugin methods for logging and configuration
3. Register hooks using \`this.registerHook()\`
4. Test using the plugin CLI

## Hooks

This plugin can register handlers for various system hooks. See \`plugins/core/plugin-api.js\` for available hooks.

## License

MIT
`;
}

function toPascalCase(str) {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

async function validatePlugin(pluginName) {
  try {
    await pluginManager.initialize();
    const plugin = pluginManager.getPlugin(pluginName);
    
    if (!plugin) {
      console.error(`❌ Plugin not found: ${pluginName}`);
      return;
    }

    const api = new PluginAPI(pluginManager);
    const config = {
      name: plugin.getName(),
      version: plugin.getVersion(),
      description: plugin.getDescription ? plugin.getDescription() : 'No description'
    };

    const validation = api.validatePluginConfig(config);
    
    if (validation.valid) {
      console.log(`✅ Plugin ${pluginName} is valid`);
    } else {
      console.log(`❌ Plugin ${pluginName} validation failed:`);
      validation.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
    }
  } catch (error) {
    console.error('❌ Plugin validation failed:', error.message);
  }
}

async function initPluginSystem() {
  try {
    await pluginManager.initialize();
    console.log('✅ Plugin system initialized');
  } catch (error) {
    console.error('❌ Plugin system initialization failed:', error.message);
  }
}

async function cleanupPluginSystem() {
  try {
    await pluginManager.cleanup();
    console.log('✅ Plugin system cleaned up');
  } catch (error) {
    console.error('❌ Plugin system cleanup failed:', error.message);
  }
}

// Main command handling
async function main() {
  switch (command) {
    case 'list':
      await listPlugins();
      break;
      
    case 'info':
      if (!pluginName) {
        console.error('❌ Plugin name required');
        showHelp();
        break;
      }
      await showPluginInfo(pluginName);
      break;
      
    case 'enable':
      if (!pluginName) {
        console.error('❌ Plugin name required');
        showHelp();
        break;
      }
      await enablePlugin(pluginName);
      break;
      
    case 'disable':
      if (!pluginName) {
        console.error('❌ Plugin name required');
        showHelp();
        break;
      }
      await disablePlugin(pluginName);
      break;
      
    case 'reload':
      if (!pluginName) {
        console.error('❌ Plugin name required');
        showHelp();
        break;
      }
      await reloadPlugin(pluginName);
      break;
      
    case 'run':
      if (!pluginName || !additionalArgs[0]) {
        console.error('❌ Plugin name and command required');
        showHelp();
        break;
      }
      await runPluginCommand(pluginName, additionalArgs[0], additionalArgs.slice(1));
      break;
      
    case 'create':
      if (!pluginName) {
        console.error('❌ Plugin name required');
        showHelp();
        break;
      }
      await createPlugin(pluginName);
      break;
      
    case 'validate':
      if (!pluginName) {
        console.error('❌ Plugin name required');
        showHelp();
        break;
      }
      await validatePlugin(pluginName);
      break;
      
    case 'init':
      await initPluginSystem();
      break;
      
    case 'cleanup':
      await cleanupPluginSystem();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
      
    default:
      console.error(`❌ Unknown command: ${command || 'none'}`);
      showHelp();
      process.exit(1);
  }
}

// Run CLI
main().catch(error => {
  console.error('❌ CLI Error:', error.message);
  process.exit(1);
});