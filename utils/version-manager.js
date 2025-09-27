/**
 * Version Management Utility
 * Handles automatic version incrementing for builds
 */

const fs = require('fs');
const path = require('path');

class VersionManager {
  constructor() {
    this.packagePath = path.join(__dirname, '..', 'package.json');
    this.buildCountPath = path.join(__dirname, '..', 'temp', 'build-count.json');
  }

  /**
   * Read current package.json
   */
  readPackageJson() {
    try {
      return JSON.parse(fs.readFileSync(this.packagePath, 'utf-8'));
    } catch (error) {
      throw new Error(`Could not read package.json: ${error.message}`);
    }
  }

  /**
   * Write updated package.json
   */
  writePackageJson(packageData) {
    try {
      fs.writeFileSync(this.packagePath, JSON.stringify(packageData, null, 2) + '\n');
    } catch (error) {
      throw new Error(`Could not write package.json: ${error.message}`);
    }
  }

  /**
   * Parse version string into components
   */
  parseVersion(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
    if (!match) {
      throw new Error(`Invalid version format: ${version}`);
    }

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      prerelease: match[4] || null
    };
  }

  /**
   * Format version components back to string
   */
  formatVersion({ major, minor, patch, prerelease }) {
    let version = `${major}.${minor}.${patch}`;
    if (prerelease) {
      version += `-${prerelease}`;
    }
    return version;
  }

  /**
   * Get or initialize build count
   */
  getBuildCount() {
    try {
      if (fs.existsSync(this.buildCountPath)) {
        const buildData = JSON.parse(fs.readFileSync(this.buildCountPath, 'utf-8'));
        return buildData.count || 0;
      }
    } catch {
      console.warn('Could not read build count, starting from 0');
    }
    return 0;
  }

  /**
   * Update build count
   */
  updateBuildCount() {
    const count = this.getBuildCount() + 1;
    
    // Ensure temp directory exists
    const tempDir = path.dirname(this.buildCountPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const buildData = {
      count,
      lastBuild: new Date().toISOString(),
      lastBuildTimestamp: Date.now()
    };

    fs.writeFileSync(this.buildCountPath, JSON.stringify(buildData, null, 2));
    return count;
  }

  /**
   * Increment version based on type
   * @param {string} type - 'major', 'minor', 'patch', or 'build'
   * @param {boolean} updatePackage - Whether to update package.json
   */
  incrementVersion(type = 'build', updatePackage = true) {
    const packageData = this.readPackageJson();
    const currentVersion = packageData.version;
    const parsed = this.parseVersion(currentVersion);
    
    let newVersion;
    
    switch (type) {
      case 'major':
        newVersion = this.formatVersion({
          major: parsed.major + 1,
          minor: 0,
          patch: 0,
          prerelease: null
        });
        break;
        
      case 'minor':
        newVersion = this.formatVersion({
          major: parsed.major,
          minor: parsed.minor + 1,
          patch: 0,
          prerelease: null
        });
        break;
        
      case 'patch':
        newVersion = this.formatVersion({
          major: parsed.major,
          minor: parsed.minor,
          patch: parsed.patch + 1,
          prerelease: null
        });
        break;
        
      case 'build': {
        // For build increments, we'll use a build number suffix
        const buildCount = this.updateBuildCount();
        newVersion = this.formatVersion({
          major: parsed.major,
          minor: parsed.minor,
          patch: parsed.patch,
          prerelease: `build.${buildCount}`
        });
        break;
      }
        
      default:
        throw new Error(`Invalid version increment type: ${type}`);
    }

    console.log(`📈 Version: ${currentVersion} → ${newVersion}`);

    if (updatePackage) {
      packageData.version = newVersion;
      this.writePackageJson(packageData);
      console.log('✅ package.json updated');
    }

    return {
      oldVersion: currentVersion,
      newVersion,
      buildCount: this.getBuildCount()
    };
  }

  /**
   * Get version info for display
   */
  getVersionInfo() {
    const packageData = this.readPackageJson();
    const buildCount = this.getBuildCount();
    
    return {
      version: packageData.version,
      buildCount,
      parsed: this.parseVersion(packageData.version)
    };
  }

  /**
   * Reset to a clean version (remove build suffix)
   * Useful for releases
   */
  cleanVersion() {
    const packageData = this.readPackageJson();
    const parsed = this.parseVersion(packageData.version);
    
    if (parsed.prerelease) {
      const cleanVersion = this.formatVersion({
        major: parsed.major,
        minor: parsed.minor,
        patch: parsed.patch,
        prerelease: null
      });
      
      packageData.version = cleanVersion;
      this.writePackageJson(packageData);
      
      console.log(`🧹 Cleaned version: ${packageData.version} → ${cleanVersion}`);
      return cleanVersion;
    }
    
    return packageData.version;
  }
}

module.exports = new VersionManager();