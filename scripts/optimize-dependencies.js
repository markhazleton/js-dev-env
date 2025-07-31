#!/usr/bin/env node

/**
 * Dependency Optimization Script
 * Helps identify and remove unnecessary dependencies
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing dependencies...\n');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Define dependency categories
const dependencyCategories = {
  essential: {
    description: 'Core functionality - keep these',
    dependencies: ['express', 'ejs', 'express-ejs-layouts'],
    devDependencies: ['nodemon', 'sass']
  },
  security: {
    description: 'Security features - recommended for production',
    dependencies: ['helmet', 'express-rate-limit', 'compression'],
    devDependencies: []
  },
  testing: {
    description: 'Testing framework - remove if not testing',
    dependencies: [],
    devDependencies: ['jest', '@types/jest', 'supertest']
  },
  development: {
    description: 'Development tools - remove for production',
    dependencies: [],
    devDependencies: ['eslint', '@eslint/js', 'globals', 'prettier', 'husky', 'lint-staged']
  },
  build: {
    description: 'Build tools - keep for static generation',
    dependencies: [],
    devDependencies: ['npm-run-all', '@parcel/watcher']
  },
  optional: {
    description: 'Optional features - remove if not using',
    dependencies: ['bootstrap', 'bootstrap-icons', 'uuid', 'validator', 'dotenv', 'morgan'],
    devDependencies: ['cross-env']
  }
};

// Function to check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Function to check if a directory has files
function hasFiles(dir) {
  if (!fs.existsSync(dir)) return false;
  const files = fs.readdirSync(dir);
  return files.length > 0;
}

// Function to check if SCSS files contain Bootstrap imports
function hasBootstrapImports() {
  if (!hasFiles('scss')) return false;
  
  const scssFiles = fs.readdirSync('scss').filter(f => f.endsWith('.scss'));
  
  for (const file of scssFiles) {
    try {
      const content = fs.readFileSync(`scss/${file}`, 'utf8');
      // Check for various Bootstrap import patterns
      if (content.includes('@use \'bootstrap/') || 
          content.includes('@import \'bootstrap/') ||
          content.includes('@import "bootstrap/') ||
          content.includes('bootstrap/scss/bootstrap')) {
        return true;
      }
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }
  
  return false;
}

// Analyze project usage
const usage = {
  usesDocker: fileExists('Dockerfile') || fileExists('docker-compose.yml'),
  usesTesting: hasFiles('tests'),
  usesCI: hasFiles('.github/workflows'),
  usesSecurity: fileExists('scripts/security-audit.js'),
  usesBuild: hasFiles('scripts') && fs.readdirSync('scripts').some(f => f.includes('build')),
  usesLinting: fileExists('eslint.config.mjs'),
  usesBootstrap: hasBootstrapImports(),
  usesIcons: hasFiles('public/fonts') || hasFiles('public/js') && fs.readdirSync('public/js').some(f => f.includes('icon'))
};

console.log('📊 Project Analysis:');
console.log(`- Docker: ${usage.usesDocker ? '✅' : '❌'}`);
console.log(`- Testing: ${usage.usesTesting ? '✅' : '❌'}`);
console.log(`- CI/CD: ${usage.usesCI ? '✅' : '❌'}`);
console.log(`- Security: ${usage.usesSecurity ? '✅' : '❌'}`);
console.log(`- Build Process: ${usage.usesBuild ? '✅' : '❌'}`);
console.log(`- Linting: ${usage.usesLinting ? '✅' : '❌'}`);
console.log(`- Bootstrap: ${usage.usesBootstrap ? '✅' : '❌'}`);
console.log(`- Icons: ${usage.usesIcons ? '✅' : '❌'}\n`);

// Generate recommendations
const recommendations = {
  keep: [],
  consider: [],
  remove: []
};

// Essential dependencies - always keep
recommendations.keep.push(...dependencyCategories.essential.dependencies);
recommendations.keep.push(...dependencyCategories.essential.devDependencies);

// Conditional recommendations
if (usage.usesTesting) {
  recommendations.keep.push(...dependencyCategories.testing.devDependencies);
} else {
  recommendations.remove.push(...dependencyCategories.testing.devDependencies);
}

if (usage.usesCI || usage.usesLinting) {
  recommendations.keep.push(...dependencyCategories.development.devDependencies);
} else {
  recommendations.consider.push(...dependencyCategories.development.devDependencies);
}

if (usage.usesSecurity) {
  recommendations.keep.push(...dependencyCategories.security.dependencies);
} else {
  recommendations.consider.push(...dependencyCategories.security.dependencies);
}

if (usage.usesBuild) {
  recommendations.keep.push(...dependencyCategories.build.devDependencies);
} else {
  recommendations.consider.push(...dependencyCategories.build.devDependencies);
}

if (usage.usesBootstrap) {
  recommendations.keep.push('bootstrap');
} else {
  recommendations.remove.push('bootstrap');
}

if (usage.usesIcons) {
  recommendations.keep.push('bootstrap-icons');
} else {
  recommendations.remove.push('bootstrap-icons');
}

// Optional dependencies
dependencyCategories.optional.dependencies.forEach(dep => {
  if (recommendations.keep.includes(dep) || recommendations.remove.includes(dep)) {
    return; // Already categorized
  }
  recommendations.consider.push(dep);
});

dependencyCategories.optional.devDependencies.forEach(dep => {
  if (recommendations.keep.includes(dep) || recommendations.remove.includes(dep)) {
    return; // Already categorized
  }
  recommendations.consider.push(dep);
});

// Display recommendations
console.log('🎯 Dependency Recommendations:\n');

console.log('✅ Keep these (essential):');
recommendations.keep.forEach(dep => {
  console.log(`  - ${dep}`);
});

if (recommendations.consider.length > 0) {
  console.log('\n🤔 Consider these (optional):');
  recommendations.consider.forEach(dep => {
    console.log(`  - ${dep}`);
  });
}

if (recommendations.remove.length > 0) {
  console.log('\n🗑️  Remove these (unused):');
  recommendations.remove.forEach(dep => {
    console.log(`  - ${dep}`);
  });
}

// Calculate savings
const currentDeps = Object.keys(packageJson.dependencies || {}).length;
const currentDevDeps = Object.keys(packageJson.devDependencies || {}).length;
const recommendedDeps = recommendations.keep.filter(dep => 
  (packageJson.dependencies && packageJson.dependencies[dep]) ||
  (packageJson.devDependencies && packageJson.devDependencies[dep])
).length;

console.log(`\n📈 Summary:`);
console.log(`- Current dependencies: ${currentDeps} + ${currentDevDeps} dev`);
console.log(`- Recommended dependencies: ${recommendedDeps}`);
console.log(`- Potential savings: ${currentDeps + currentDevDeps - recommendedDeps} packages`);

// Generate minimal package.json
if (process.argv.includes('--generate-minimal')) {
  console.log('\n📝 Generating minimal package.json...');
  
  const minimalPackage = {
    name: packageJson.name,
    version: packageJson.version,
    main: packageJson.main,
    scripts: {
      "start": "node index.js",
      "dev": "nodemon index.js",
      "build": "npm run build-css",
      "build-css": "sass scss/main.scss public/css/styles.css",
      "watch-css": "sass --watch scss/main.scss:public/css/styles.css",
      "start:dev": "npm-run-all --parallel watch-css dev"
    },
    dependencies: {},
    devDependencies: {}
  };

  // Add recommended dependencies
  recommendations.keep.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      minimalPackage.dependencies[dep] = packageJson.dependencies[dep];
    }
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      minimalPackage.devDependencies[dep] = packageJson.devDependencies[dep];
    }
  });

  fs.writeFileSync('package-minimal.json', JSON.stringify(minimalPackage, null, 2));
  console.log('✅ Generated package-minimal.json');
  console.log('💡 To use: cp package-minimal.json package.json && npm install');
}

console.log('\n💡 Tips:');
console.log('- Run with --generate-minimal to create a minimal package.json');
console.log('- Use npm prune to remove unused packages');
console.log('- Consider using npm-check-updates to update dependencies');
console.log('- Test thoroughly after removing dependencies'); 