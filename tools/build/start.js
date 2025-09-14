#!/usr/bin/env node

/**
 * Development Server Starter
 * Starts development server with build integration
 */

const { execSync } = require('child_process');
const buildConfig = require('./build-config.js');

async function start() {
  console.log('🚀 Starting development server...');
  
  try {
    // Start the main application
    execSync('node index.js', { stdio: 'inherit', cwd: process.cwd() });
  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  start().catch(console.error);
}

module.exports = { start };