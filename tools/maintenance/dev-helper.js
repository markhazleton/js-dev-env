#!/usr/bin/env node

/**
 * Development helper script
 * Provides useful commands for development workflow
 */

const { execSync } = require('child_process');
const fs = require('fs');
// const path = require('path'); // Reserved for future path operations

const commands = {
  setup: () => {
    console.log('🚀 Setting up development environment...');
    
    // Copy .env.example to .env if it doesn't exist
    if (!fs.existsSync('.env') && fs.existsSync('.env.example')) {
      fs.copyFileSync('.env.example', '.env');
      console.log('✅ Created .env from .env.example');
    }
    
    // Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Run initial build
    console.log('🔨 Running initial build...');
    execSync('npm run build-css-dev', { stdio: 'inherit' });
    execSync('npm run copy-icons', { stdio: 'inherit' });
    
    console.log('✅ Development environment ready!');
    console.log('Run "npm run start:dev" to start development server');
  },

  clean: () => {
    console.log('🧹 Cleaning build artifacts...');
    
    const dirsToClean = ['docs', 'coverage', 'node_modules/.cache'];
    // const filesToClean = ['*.log', '.eslintcache']; // Reserved for future file cleaning
    
    dirsToClean.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✅ Cleaned ${dir}`);
      }
    });
    
    console.log('✅ Clean complete');
  },

  test: () => {
    console.log('🧪 Running comprehensive tests...');
    
    // Run linting
    console.log('📝 Running ESLint...');
    execSync('npm run lint', { stdio: 'inherit' });
    
    // Run tests with coverage
    console.log('🧪 Running Jest tests...');
    execSync('npm test', { stdio: 'inherit' });
    
    // Run security audit
    console.log('🔒 Running security audit...');
    execSync('npm run security-audit', { stdio: 'inherit' });
    
    console.log('✅ All tests passed!');
  },

  deploy: () => {
    console.log('🚀 Preparing for deployment...');
    
    // Run tests first
    console.log('🧪 Running tests...');
    execSync('npm test', { stdio: 'inherit' });
    
    // Build for production
    console.log('🔨 Building for production...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('✅ Ready for deployment!');
    console.log('📁 Static files are in the "docs" directory');
  },

  help: () => {
    console.log(`
🛠️  Development Helper

Available commands:
  setup   - Set up development environment
  clean   - Clean build artifacts
  test    - Run comprehensive tests
  deploy  - Prepare for deployment
  help    - Show this help message

Usage:
  node scripts/dev-helper.js <command>
  npm run dev:setup
  npm run dev:clean
  npm run dev:test
  npm run dev:deploy
    `);
  }
};

const command = process.argv[2];

if (!command || !commands[command]) {
  commands.help();
  process.exit(1);
}

try {
  commands[command]();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
