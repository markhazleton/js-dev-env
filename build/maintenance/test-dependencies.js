#!/usr/bin/env node

/**
 * Dependency Testing Script
 * Helps safely test and remove dependencies one by one
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🧪 Dependency Testing Tool\n');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Define dependency priorities and testing strategies
const dependencyAnalysis = {
  'npm-run-all': {
    priority: 'LOW',
    description: 'Build tool for running multiple npm scripts in parallel',
    testStrategy: 'Check if you use parallel script execution (npm-run-all)',
    safeToRemove: true,
    testCommands: ['npm run start:dev', 'npm run build'],
    checkFiles: ['package.json'],
    checkPatterns: ['npm-run-all']
  },
  '@parcel/watcher': {
    priority: 'LOW', 
    description: 'File watching for build processes',
    testStrategy: 'Check if you use file watching in build scripts',
    safeToRemove: true,
    testCommands: ['npm run build'],
    checkFiles: ['package.json'],
    checkPatterns: ['@parcel/watcher']
  },
  'uuid': {
    priority: 'MEDIUM',
    description: 'Generate unique identifiers',
    testStrategy: 'Search codebase for uuid usage',
    safeToRemove: true,
    testCommands: ['npm test'],
    checkFiles: ['**/*.js', '**/*.ejs'],
    checkPatterns: ['require.*uuid', 'import.*uuid', 'uuid\\.']
  },
  'dotenv': {
    priority: 'HIGH',
    description: 'Environment variable management',
    testStrategy: 'Check if you use .env files',
    safeToRemove: false,
    testCommands: ['npm start'],
    checkFiles: ['.env', '.env.example'],
    checkPatterns: ['process\\.env', 'dotenv']
  },
  'morgan': {
    priority: 'MEDIUM',
    description: 'HTTP request logger middleware',
    testStrategy: 'Check if you use morgan in your Express app',
    safeToRemove: true,
    testCommands: ['npm start'],
    checkFiles: ['index.js', 'app.js'],
    checkPatterns: ['require.*morgan', 'import.*morgan', 'morgan\\.']
  }
};

// Function to check if a dependency is actually used
function checkDependencyUsage(depName, analysis) {
  console.log(`\n🔍 Checking usage of ${depName}...`);
  
  let isUsed = false;
  
  // Check files for patterns
  if (analysis.checkFiles) {
    for (const filePattern of analysis.checkFiles) {
      try {
        if (filePattern === 'package.json') {
          const content = fs.readFileSync('package.json', 'utf8');
          if (content.includes(depName)) {
            console.log(`  📄 Found in package.json`);
            isUsed = true;
          }
        } else if (filePattern.startsWith('**/')) {
          // Simple glob-like pattern matching
          const pattern = filePattern.replace('**/', '');
          if (fs.existsSync(pattern)) {
            const content = fs.readFileSync(pattern, 'utf8');
            if (analysis.checkPatterns.some(p => content.includes(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))) {
              console.log(`  📄 Found usage in ${pattern}`);
              isUsed = true;
            }
          }
        } else if (fs.existsSync(filePattern)) {
          const content = fs.readFileSync(filePattern, 'utf8');
          if (analysis.checkPatterns.some(p => content.includes(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))) {
            console.log(`  📄 Found usage in ${filePattern}`);
            isUsed = true;
          }
        }
      } catch {
        // File doesn't exist or can't be read
      }
    }
  }
  
  return isUsed;
}

// Function to test commands
function testCommands(commands) {
  console.log('  🧪 Testing commands...');
  for (const command of commands) {
    try {
      console.log(`    Running: ${command}`);
      execSync(command, { stdio: 'pipe', timeout: 30000 });
      console.log(`    ✅ ${command} passed`);
    } catch {
      console.log(`    ❌ ${command} failed`);
      return false;
    }
  }
  return true;
}

// Function to remove a dependency and test
function testRemoveDependency(depName) {
  console.log(`\n🗑️  Testing removal of ${depName}...`);
  
  // Backup package.json
  const backupPath = `package.json.backup.${Date.now()}`;
  fs.copyFileSync('package.json', backupPath);
  console.log(`  📋 Created backup: ${backupPath}`);
  
  try {
    // Remove the dependency
    console.log(`  🗑️  Removing ${depName}...`);
    const { spawnSync } = require('child_process');
    spawnSync('npm', ['uninstall', depName], { stdio: 'pipe' });
    
    // Test the application
    const analysis = dependencyAnalysis[depName];
    if (analysis && analysis.testCommands) {
      const testPassed = testCommands(analysis.testCommands);
      if (testPassed) {
        console.log(`  ✅ ${depName} can be safely removed!`);
        console.log(`  💡 To keep it removed, the package.json has been updated.`);
        console.log(`  💡 To restore: npm install ${depName}`);
        return true;
      } else {
        console.log(`  ❌ ${depName} is needed - restoring...`);
        const { spawnSync } = require('child_process');
        spawnSync('npm', ['install', depName], { stdio: 'pipe' });
        fs.copyFileSync(backupPath, 'package.json');
        return false;
      }
    }
  } catch (error) {
    console.log(`  ❌ Error during testing: ${error.message}`);
    // Restore backup
    fs.copyFileSync(backupPath, 'package.json');
    return false;
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--list') || args.includes('list')) {
    console.log('📋 Dependency Analysis:\n');
    
    // Sort by priority
    const priorities = ['HIGH', 'MEDIUM', 'LOW'];
    for (const priority of priorities) {
      const deps = Object.entries(dependencyAnalysis)
        .filter(([_name, analysis]) => analysis.priority === priority)
        .filter(([name]) => packageJson.dependencies?.[name] || packageJson.devDependencies?.[name]);
      
      if (deps.length > 0) {
        console.log(`${priority} Priority:`);
        deps.forEach(([name, analysis]) => {
          const isUsed = checkDependencyUsage(name, analysis);
          const status = isUsed ? '✅ Used' : '❌ Unused';
          console.log(`  ${name}: ${status} - ${analysis.description}`);
        });
        console.log('');
      }
    }
    
    console.log('💡 Usage:');
    console.log('  npm run test:deps --list          # List all dependencies with analysis');
    console.log('  npm run test:deps --test uuid     # Test removing a specific dependency');
    console.log('  npm run test:deps --test-all      # Test removing all unused dependencies');
    
  } else if ((args.includes('--test') || args.includes('test')) && args[1]) {
    const depName = args[1];
    if (dependencyAnalysis[depName]) {
      testRemoveDependency(depName);
    } else {
      console.log(`❌ No analysis available for ${depName}`);
    }
    
  } else if (args.includes('--test-all') || args.includes('test-all')) {
    console.log('🧪 Testing all unused dependencies...\n');
    
    for (const [name, analysis] of Object.entries(dependencyAnalysis)) {
      if (packageJson.dependencies?.[name] || packageJson.devDependencies?.[name]) {
        const isUsed = checkDependencyUsage(name, analysis);
        if (!isUsed && analysis.safeToRemove) {
          console.log(`\n${'='.repeat(50)}`);
          testRemoveDependency(name);
        }
      }
    }
    
  } else {
    console.log('🧪 Dependency Testing Tool\n');
    console.log('Usage:');
    console.log('  npm run test:deps --list          # List all dependencies with analysis');
    console.log('  npm run test:deps --test uuid     # Test removing a specific dependency');
    console.log('  npm run test:deps --test-all      # Test removing all unused dependencies');
    console.log('\n💡 Tips:');
    console.log('- Always test in a clean environment');
    console.log('- Check your application thoroughly after each removal');
    console.log('- Keep backups of your package.json');
    console.log('- HIGH priority dependencies should be tested very carefully');
  }
}

main(); 