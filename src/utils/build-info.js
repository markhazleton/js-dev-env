/**
 * Build Information Utility
 * Generates build metadata for the application
 */

const fs = require('fs');
const path = require('path');
const versionManager = require('./version-manager');

class BuildInfo {
  constructor() {
    this.packagePath = path.join(__dirname, '..', '..', 'package.json');
    this.buildInfoPath = path.join(__dirname, '..', '..', 'temp', 'build-info.json');
  }

  /**
   * Get version from version manager
   */
  getVersion() {
    try {
      const versionInfo = versionManager.getVersionInfo();
      return versionInfo.version || '1.0.0';
    } catch {
      console.warn('Could not read version info, using default version');
      return '1.0.0';
    }
  }

  /**
   * Get build date from build-info.json or return current date
   */
  getBuildDate() {
    try {
      if (fs.existsSync(this.buildInfoPath)) {
        const buildInfo = JSON.parse(fs.readFileSync(this.buildInfoPath, 'utf-8'));
        return new Date(buildInfo.buildDate);
      }
    } catch {
      console.warn('Could not read build info, using current date');
    }
    return new Date();
  }

  /**
   * Generate build info for static site generation
   */
  generateBuildInfo() {
    const buildInfo = {
      version: this.getVersion(),
      buildDate: new Date().toISOString(),
      buildTimestamp: Date.now(),
      environment: process.env.NODE_ENV || 'development'
    };

    // Ensure temp directory exists
    const tempDir = path.dirname(this.buildInfoPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Write build info
    fs.writeFileSync(this.buildInfoPath, JSON.stringify(buildInfo, null, 2));
    return buildInfo;
  }

  /**
   * Get formatted build information for templates
   */
  getBuildInfo() {
    const version = this.getVersion();
    const buildDate = this.getBuildDate();
    
    return {
      version,
      buildDate: buildDate.toLocaleDateString(),
      buildDateTime: buildDate.toLocaleString(),
      buildISODate: buildDate.toISOString().split('T')[0]
    };
  }

  /**
   * Get build info as middleware for Express
   */
  middleware() {
    return (req, res, next) => {
      res.locals.buildInfo = this.getBuildInfo();
      next();
    };
  }
}

module.exports = new BuildInfo();