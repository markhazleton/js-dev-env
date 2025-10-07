#!/usr/bin/env node

/**
 * Version Management CLI Tool
 * Command-line interface for version management
 */

const versionManager = require('../../utils/version-manager');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const type = args[1] || 'patch';

function showHelp() {
  console.log(`
📈 Version Management Tool

Usage:
  node tools/maintenance/version.js <command> [type]

Commands:
  info        Show current version information
  increment   Increment version (default: patch)
  clean       Remove build suffix for release
  
Version Types (for increment):
  major       Increment major version (1.0.0 → 2.0.0)
  minor       Increment minor version (1.0.0 → 1.1.0)
  patch       Increment patch version (1.0.0 → 1.0.1)
  build       Add/increment build number (1.0.0 → 1.0.0-build.1)

Examples:
  node tools/maintenance/version.js info
  node tools/maintenance/version.js increment patch
  node tools/maintenance/version.js increment minor
  node tools/maintenance/version.js clean
`);
}

function showVersionInfo() {
  try {
    const info = versionManager.getVersionInfo();
    console.log(`
📊 Current Version Information:
   Version: ${info.version}
   Build Count: ${info.buildCount}
   Components: ${info.parsed.major}.${info.parsed.minor}.${info.parsed.patch}${info.parsed.prerelease ? `-${info.parsed.prerelease}` : ''}
`);
  } catch (error) {
    console.error('❌ Error getting version info:', error.message);
    process.exit(1);
  }
}

function incrementVersion(versionType) {
  try {
    const result = versionManager.incrementVersion(versionType);
    console.log(`✅ Version incremented successfully!`);
    console.log(`   ${result.oldVersion} → ${result.newVersion}`);
    if (result.buildCount) {
      console.log(`   Build count: ${result.buildCount}`);
    }
  } catch (error) {
    console.error('❌ Error incrementing version:', error.message);
    process.exit(1);
  }
}

function cleanVersion() {
  try {
    const cleanedVersion = versionManager.cleanVersion();
    console.log(`✅ Version cleaned: ${cleanedVersion}`);
  } catch (error) {
    console.error('❌ Error cleaning version:', error.message);
    process.exit(1);
  }
}

// Main command handling
switch (command) {
  case 'info':
    showVersionInfo();
    break;
    
  case 'increment':
    if (!['major', 'minor', 'patch', 'build'].includes(type)) {
      console.error(`❌ Invalid version type: ${type}`);
      console.error('Valid types: major, minor, patch, build');
      process.exit(1);
    }
    incrementVersion(type);
    break;
    
  case 'clean':
    cleanVersion();
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