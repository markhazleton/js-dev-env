#!/usr/bin/env node

/**
 * Feature Management CLI
 * Manage feature flags and project configuration
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const { features, presets, isFeatureEnabled, getEnabledFeatures } = require('../../src/config/features');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const featureName = args[1];

function showHelp() {
  console.log(`
🎛️  Feature Management CLI

Usage:
  node tools/setup/feature-manager.js <command> [options]

Commands:
  list                    List all available features
  enabled                 Show currently enabled features
  status <feature>        Check if a feature is enabled
  enable <feature>        Enable a feature
  disable <feature>       Disable a feature
  preset <name>           Apply a feature preset
  presets                 List available presets
  generate                Generate package.json based on current features
  
Feature Paths:
  Use dot notation for nested features:
  - ui.darkMode
  - security.helmet
  - development.linting
  - advanced.pwa

Presets:
  minimal     Minimal setup for simple projects
  standard    Standard setup (default)
  production  Production-ready with all features
  learning    Learning-focused setup

Examples:
  node tools/setup/feature-manager.js list
  node tools/setup/feature-manager.js enable ui.darkMode
  node tools/setup/feature-manager.js preset production
  node tools/setup/feature-manager.js generate
`);
}

function listFeatures() {
  console.log('\n🎛️  Available Features:\n');
  
  function displayFeatures(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        console.log(`📁 ${fullPath}/`);
        displayFeatures(value, fullPath);
      } else if (typeof value === 'boolean') {
        const status = value ? '✅' : '❌';
        console.log(`   ${status} ${fullPath}`);
      }
    }
  }
  
  displayFeatures(features);
}

function showEnabledFeatures(preset = 'standard') {
  console.log(`\n✅ Enabled Features (${preset} preset):\n`);
  
  const enabled = getEnabledFeatures(preset);
  if (enabled.length === 0) {
    console.log('No features enabled.');
    return;
  }
  
  // Group by category
  const grouped = {};
  enabled.forEach(feature => {
    const parts = feature.split('.');
    const category = parts[0];
    const featureName = parts.slice(1).join('.');
    
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(featureName);
  });
  
  for (const [category, features] of Object.entries(grouped)) {
    console.log(`📁 ${category}:`);
    features.forEach(feature => {
      console.log(`   ✅ ${feature}`);
    });
    console.log('');
  }
}

function checkFeatureStatus(featurePath) {
  const enabled = isFeatureEnabled(featurePath);
  const status = enabled ? '✅ Enabled' : '❌ Disabled';
  console.log(`\n${status}: ${featurePath}\n`);
}

function updateFeature(featurePath, enable) {
  try {
    // This is a simplified implementation
    // In a real scenario, you'd want to parse and modify the JS object properly
    console.log(`\n${enable ? '✅ Enabling' : '❌ Disabling'} feature: ${featurePath}`);
    console.log('⚠️  Note: Feature modification requires manual editing of config/features.js');
    console.log(`Please set ${featurePath} to ${enable} in the configuration file.\n`);
    
  } catch (error) {
    console.error('❌ Error updating feature:', error.message);
  }
}

function listPresets() {
  console.log('\n🎯 Available Presets:\n');
  
  for (const [name, preset] of Object.entries(presets)) {
    console.log(`📋 ${name}`);
    console.log(`   ${preset.description}`);
    
    const enabledCount = getEnabledFeatures(name).length;
    console.log(`   Features enabled: ${enabledCount}`);
    console.log('');
  }
}

function applyPreset(presetName) {
  if (!presets[presetName]) {
    console.error(`❌ Unknown preset: ${presetName}`);
    console.log('Available presets:', Object.keys(presets).join(', '));
    return;
  }
  
  console.log(`\n🎯 Applying preset: ${presetName}`);
  console.log(`Description: ${presets[presetName].description}\n`);
  
  const enabledFeatures = getEnabledFeatures(presetName);
  console.log(`This preset enables ${enabledFeatures.length} features:`);
  
  enabledFeatures.forEach(feature => {
    console.log(`   ✅ ${feature}`);
  });
  
  console.log('\n⚠️  Note: Preset application requires manual configuration update.');
  console.log('This command shows what would be enabled. To apply, update config/features.js');
}

function generatePackageJson() {
  console.log('\n📦 Generating package.json recommendations based on enabled features...\n');
  
  try {
    const { generatePackageJson: genPkg, generateScripts } = require('../../src/config/features');
    const { dependencies, devDependencies } = genPkg();
    const scripts = generateScripts();
    
    console.log('📋 Recommended Dependencies:');
    Object.entries(dependencies).forEach(([pkg, version]) => {
      console.log(`   ${pkg}: ${version}`);
    });
    
    console.log('\n📋 Recommended Dev Dependencies:');
    Object.entries(devDependencies).forEach(([pkg, version]) => {
      console.log(`   ${pkg}: ${version}`);
    });
    
    console.log('\n📋 Recommended Scripts:');
    Object.entries(scripts).forEach(([name, command]) => {
      console.log(`   ${name}: ${command}`);
    });
    
    console.log('\n💡 You can add these to your package.json as needed.');
    
  } catch (error) {
    console.error('❌ Error generating package.json:', error.message);
  }
}

// Main command handling
switch (command) {
  case 'list':
    listFeatures();
    break;
    
  case 'enabled':
    showEnabledFeatures(featureName || 'standard');
    break;
    
  case 'status':
    if (!featureName) {
      console.error('❌ Feature path required');
      showHelp();
      break;
    }
    checkFeatureStatus(featureName);
    break;
    
  case 'enable':
    if (!featureName) {
      console.error('❌ Feature path required');
      showHelp();
      break;
    }
    updateFeature(featureName, true);
    break;
    
  case 'disable':
    if (!featureName) {
      console.error('❌ Feature path required');
      showHelp();
      break;
    }
    updateFeature(featureName, false);
    break;
    
  case 'preset':
    if (!featureName) {
      console.error('❌ Preset name required');
      showHelp();
      break;
    }
    applyPreset(featureName);
    break;
    
  case 'presets':
    listPresets();
    break;
    
  case 'generate':
    generatePackageJson();
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