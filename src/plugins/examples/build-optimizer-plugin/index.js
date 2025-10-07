/**
 * Build Optimizer Plugin Example
 * Demonstrates build system plugin that optimizes assets and build process
 */

const BasePlugin = require('../../core/base-plugin');
const { PLUGIN_HOOKS } = require('../../core/plugin-api');
const fs = require('fs');
const path = require('path');

class BuildOptimizerPlugin extends BasePlugin {
  constructor(config = {}) {
    super({
      enabled: true,
      minifyCSS: true,
      minifyJS: true,
      optimizeImages: true,
      generateManifest: true,
      compressionLevel: 9,
      ...config
    });
    
    this.buildStats = {
      originalSize: 0,
      optimizedSize: 0,
      compressionRatio: 0,
      filesProcessed: 0,
      timeSaved: 0
    };
  }

  getName() {
    return 'build-optimizer-plugin';
  }

  getVersion() {
    return '1.0.0';
  }

  getDescription() {
    return 'Optimizes build output with minification and compression';
  }

  getAuthor() {
    return 'JS Dev Env';
  }

  async initialize(pluginManager) {
    await super.initialize(pluginManager);
    
    if (!this.isEnabled()) {
      return;
    }

    // Register build hooks
    this.registerHook(PLUGIN_HOOKS.BUILD_BEFORE_START, this.beforeBuildStart.bind(this), 5);
    this.registerHook(PLUGIN_HOOKS.BUILD_AFTER_SCSS, this.optimizeCSS.bind(this), 5);
    this.registerHook(PLUGIN_HOOKS.BUILD_AFTER_ASSETS, this.optimizeAssets.bind(this), 5);
    this.registerHook(PLUGIN_HOOKS.BUILD_AFTER_START, this.generateBuildManifest.bind(this), 5);

    this.log('info', 'Build optimizer initialized');
  }

  /**
   * Before build starts - reset stats
   */
  async beforeBuildStart(buildContext) {
    this.buildStats = {
      originalSize: 0,
      optimizedSize: 0,
      compressionRatio: 0,
      filesProcessed: 0,
      timeSaved: 0,
      startTime: Date.now()
    };

    this.log('info', 'Build optimization starting...');
    return [buildContext];
  }

  /**
   * Optimize CSS files
   */
  async optimizeCSS(buildContext) {
    if (!this.config.minifyCSS) {
      return [buildContext];
    }

    try {
      const cssFiles = this.findFiles(['public', 'docs'], '.css');
      
      for (const filePath of cssFiles) {
        await this.minifyCSS(filePath);
      }

      this.log('info', `Optimized ${cssFiles.length} CSS files`);
    } catch (error) {
      this.log('error', 'CSS optimization failed:', error.message);
    }

    return [buildContext];
  }

  /**
   * Optimize various assets
   */
  async optimizeAssets(buildContext) {
    try {
      if (this.config.minifyJS) {
        await this.optimizeJavaScript();
      }

      if (this.config.optimizeImages) {
        await this.optimizeImages();
      }

      this.log('info', 'Asset optimization completed');
    } catch (error) {
      this.log('error', 'Asset optimization failed:', error.message);
    }

    return [buildContext];
  }

  /**
   * Generate build manifest
   */
  async generateBuildManifest(buildContext) {
    if (!this.config.generateManifest) {
      return [buildContext];
    }

    try {
      const manifest = await this.createBuildManifest();
      const manifestPath = path.join(process.cwd(), 'temp', 'build-manifest.json');
      
      // Ensure temp directory exists
      const tempDir = path.dirname(manifestPath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      
      this.buildStats.endTime = Date.now();
      this.buildStats.totalTime = this.buildStats.endTime - this.buildStats.startTime;

      this.log('info', `Build manifest generated: ${manifestPath}`);
      this.logBuildStats();
    } catch (error) {
      this.log('error', 'Build manifest generation failed:', error.message);
    }

    return [buildContext];
  }

  /**
   * Find files with extension in directories
   */
  findFiles(directories, extension) {
    const files = [];
    
    for (const dir of directories) {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        const dirFiles = this.scanDirectory(dirPath, extension);
        files.push(...dirFiles);
      }
    }
    
    return files;
  }

  /**
   * Recursively scan directory for files
   */
  scanDirectory(dirPath, extension) {
    const files = [];
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          files.push(...this.scanDirectory(itemPath, extension));
        } else if (path.extname(item) === extension) {
          files.push(itemPath);
        }
      }
    } catch (error) {
      this.log('warn', `Failed to scan directory ${dirPath}:`, error.message);
    }
    
    return files;
  }

  /**
   * Minify CSS file
   */
  async minifyCSS(filePath) {
    try {
      const originalContent = fs.readFileSync(filePath, 'utf-8');
      const originalSize = originalContent.length;
      
      // Simple CSS minification (remove comments, extra whitespace)
      const minified = originalContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
        .replace(/;\s*/g, ';') // Remove spaces after semicolon
        .replace(/,\s*/g, ',') // Remove spaces after comma
        .trim();
      
      const optimizedSize = minified.length;
      const savings = originalSize - optimizedSize;
      
      if (savings > 0) {
        fs.writeFileSync(filePath, minified);
        this.buildStats.originalSize += originalSize;
        this.buildStats.optimizedSize += optimizedSize;
        this.buildStats.filesProcessed++;
        
        this.log('debug', `CSS minified: ${path.basename(filePath)} (${savings} bytes saved)`);
      }
    } catch (error) {
      this.log('warn', `Failed to minify CSS ${filePath}:`, error.message);
    }
  }

  /**
   * Optimize JavaScript files
   */
  async optimizeJavaScript() {
    const jsFiles = this.findFiles(['public', 'docs'], '.js');
    
    for (const filePath of jsFiles) {
      await this.minifyJS(filePath);
    }
    
    this.log('info', `Processed ${jsFiles.length} JavaScript files`);
  }

  /**
   * Minify JavaScript file
   */
  async minifyJS(filePath) {
    try {
      const originalContent = fs.readFileSync(filePath, 'utf-8');
      const originalSize = originalContent.length;
      
      // Simple JS minification (remove comments, extra whitespace)
      const minified = originalContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
        .replace(/;\s*/g, ';') // Remove spaces after semicolon
        .replace(/,\s*/g, ',') // Remove spaces after comma
        .trim();
      
      const optimizedSize = minified.length;
      const savings = originalSize - optimizedSize;
      
      if (savings > 0) {
        fs.writeFileSync(filePath, minified);
        this.buildStats.originalSize += originalSize;
        this.buildStats.optimizedSize += optimizedSize;
        this.buildStats.filesProcessed++;
        
        this.log('debug', `JS minified: ${path.basename(filePath)} (${savings} bytes saved)`);
      }
    } catch (error) {
      this.log('warn', `Failed to minify JS ${filePath}:`, error.message);
    }
  }

  /**
   * Optimize images (placeholder - would use actual image optimization library)
   */
  async optimizeImages() {
    const imageFiles = [
      ...this.findFiles(['public', 'docs'], '.jpg'),
      ...this.findFiles(['public', 'docs'], '.jpeg'),
      ...this.findFiles(['public', 'docs'], '.png'),
      ...this.findFiles(['public', 'docs'], '.gif'),
      ...this.findFiles(['public', 'docs'], '.svg')
    ];
    
    // Placeholder for image optimization
    // In a real implementation, you would use libraries like:
    // - sharp for raster images
    // - svgo for SVG optimization
    // - imagemin for general image optimization
    
    this.log('info', `Found ${imageFiles.length} images (optimization placeholder)`);
  }

  /**
   * Create build manifest
   */
  async createBuildManifest() {
    const manifest = {
      buildTime: new Date().toISOString(),
      optimizationStats: this.buildStats,
      files: {},
      configuration: {
        minifyCSS: this.config.minifyCSS,
        minifyJS: this.config.minifyJS,
        optimizeImages: this.config.optimizeImages,
        compressionLevel: this.config.compressionLevel
      }
    };

    // Add file information
    const allFiles = [
      ...this.findFiles(['public', 'docs'], '.css'),
      ...this.findFiles(['public', 'docs'], '.js'),
      ...this.findFiles(['public', 'docs'], '.html')
    ];

    for (const filePath of allFiles) {
      try {
        const stats = fs.statSync(filePath);
        const relativePath = path.relative(process.cwd(), filePath);
        
        manifest.files[relativePath] = {
          size: stats.size,
          modified: stats.mtime.toISOString(),
          type: path.extname(filePath).substring(1)
        };
      } catch (error) {
        this.log('warn', `Failed to stat file ${filePath}:`, error.message);
      }
    }

    return manifest;
  }

  /**
   * Log build statistics
   */
  logBuildStats() {
    const stats = this.buildStats;
    const compressionRatio = stats.originalSize > 0 
      ? ((stats.originalSize - stats.optimizedSize) / stats.originalSize * 100).toFixed(2)
      : 0;

    console.log('\n📊 Build Optimization Stats:');
    console.log(`Files processed: ${stats.filesProcessed}`);
    console.log(`Original size: ${this.formatBytes(stats.originalSize)}`);
    console.log(`Optimized size: ${this.formatBytes(stats.optimizedSize)}`);
    console.log(`Space saved: ${this.formatBytes(stats.originalSize - stats.optimizedSize)} (${compressionRatio}%)`);
    console.log(`Total time: ${stats.totalTime}ms`);
  }

  /**
   * Format bytes for display
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * CLI command for build optimization
   */
  async executeCommand(commandName, _args) {
    if (commandName === 'optimize') {
      this.log('info', 'Starting manual build optimization...');
      
      await this.beforeBuildStart({});
      await this.optimizeCSS({});
      await this.optimizeAssets({});
      await this.generateBuildManifest({});
      
      this.log('info', 'Manual optimization completed');
    }
  }

  /**
   * Get optimization statistics
   */
  getStats() {
    return { ...this.buildStats };
  }

  async cleanup() {
    this.buildStats = {
      originalSize: 0,
      optimizedSize: 0,
      compressionRatio: 0,
      filesProcessed: 0,
      timeSaved: 0
    };
    this.log('info', 'Build optimizer cleaned up');
  }
}

module.exports = BuildOptimizerPlugin;