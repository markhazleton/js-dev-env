#!/usr/bin/env node

/**
 * Project Configuration Wizard
 * Interactive setup for different use cases
 */

const fs = require('fs');
const readline = require('readline');
const { getFeatures, generatePackageJson, generateScripts } = require('../../src/config/features');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function runWizard() {
  console.log('🚀 JsBootSpark Configuration Wizard\n');
  console.log('This wizard will help you configure the project based on your needs.\n');

  // Step 1: Determine use case
  console.log('📋 What type of project are you building?');
  console.log('1. Simple website (minimal setup)');
  console.log('2. Standard web application');
  console.log('3. Production application (all features)');
  console.log('4. Learning project (with extra docs)');
  console.log('5. Custom configuration');

  const useCase = await question('\nEnter your choice (1-5): ');

  let preset = 'standard';
  let customFeatures = null;

  switch (useCase) {
    case '1':
      preset = 'minimal';
      break;
    case '2':
      preset = 'standard';
      break;
    case '3':
      preset = 'production';
      break;
    case '4':
      preset = 'learning';
      break;
    case '5':
      customFeatures = await getCustomConfiguration();
      break;
    default:
      console.log('Invalid choice, using standard configuration.');
      preset = 'standard';
  }

  // Step 2: Show configuration summary
  console.log('\n📊 Configuration Summary:');
  
  if (customFeatures) {
    console.log('Custom configuration selected');
    console.log('Enabled features:');
    Object.entries(customFeatures).forEach(([category, features]) => {
      Object.entries(features).forEach(([feature, enabled]) => {
        if (enabled) {
          console.log(`  ✅ ${category}.${feature}`);
        }
      });
    });
  } else {
    const features = getFeatures(preset);
    console.log(`Preset: ${preset}`);
    console.log('Enabled features:');
    Object.entries(features).forEach(([category, categoryFeatures]) => {
      Object.entries(categoryFeatures).forEach(([feature, enabled]) => {
        if (enabled) {
          console.log(`  ✅ ${category}.${feature}`);
        }
      });
    });
  }

  // Step 3: Confirm and apply
  const confirm = await question('\nApply this configuration? (y/n): ');
  
  if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
    await applyConfiguration(preset, customFeatures);
  } else {
    console.log('Configuration cancelled.');
  }

  rl.close();
}

async function getCustomConfiguration() {
  console.log('\n🔧 Custom Configuration\n');
  
  const features = getFeatures('standard');
  const customFeatures = JSON.parse(JSON.stringify(features));

  for (const [category, categoryFeatures] of Object.entries(features)) {
    console.log(`\n📁 ${category.toUpperCase()} Features:`);
    
    for (const [feature] of Object.entries(categoryFeatures)) {
      const current = customFeatures[category][feature];
      const answer = await question(`  ${feature} (currently ${current ? 'enabled' : 'disabled'}) [y/n]: `);
      customFeatures[category][feature] = answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
    }
  }

  return customFeatures;
}

async function applyConfiguration(preset, customFeatures) {
  console.log('\n🔧 Applying configuration...');

  try {
    // Generate package.json
    const packageConfig = customFeatures ? 
      generatePackageJsonFromCustom(customFeatures) : 
      generatePackageJson(preset);
    
    const scripts = customFeatures ? 
      generateScriptsFromCustom(customFeatures) : 
      generateScripts(preset);

    // Read current package.json
    const currentPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Update package.json
    const updatedPackage = {
      ...currentPackage,
      dependencies: packageConfig.dependencies,
      devDependencies: packageConfig.devDependencies,
      scripts: { ...currentPackage.scripts, ...scripts }
    };

    // Backup original package.json
    fs.writeFileSync('package.json.backup', JSON.stringify(currentPackage, null, 2));
    console.log('✅ Backed up original package.json');

    // Write updated package.json
    fs.writeFileSync('package.json', JSON.stringify(updatedPackage, null, 2));
    console.log('✅ Updated package.json');

    // Create configuration file
    const configData = {
      preset: preset,
      customFeatures: customFeatures,
      appliedAt: new Date().toISOString()
    };
    
    fs.writeFileSync('config/project-config.json', JSON.stringify(configData, null, 2));
    console.log('✅ Created project configuration file');

    // Generate setup instructions
    await generateSetupInstructions(preset, customFeatures);

    console.log('\n🎉 Configuration applied successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm run start:dev');
    console.log('3. Open: http://localhost:3000');

  } catch (error) {
    console.error('❌ Error applying configuration:', error.message);
  }
}

function generatePackageJsonFromCustom(customFeatures) {
  const dependencies = {
    express: "^5.1.0",
    ejs: "^3.1.10",
    "express-ejs-layouts": "^2.5.1"
  };
  
  const devDependencies = {
    nodemon: "^3.1.10",
    sass: "^1.89.2"
  };

  // Add dependencies based on custom features
  if (customFeatures.ui.bootstrap) {
    dependencies.bootstrap = "^5.3.7";
  }
  
  if (customFeatures.ui.icons) {
    dependencies["bootstrap-icons"] = "^1.13.1";
  }
  
  if (customFeatures.security.helmet) {
    dependencies.helmet = "^8.1.0";
  }
  
  if (customFeatures.security.rateLimiting) {
    dependencies["express-rate-limit"] = "^8.0.1";
  }
  
  if (customFeatures.security.compression) {
    dependencies.compression = "^1.8.1";
  }
  
  if (customFeatures.development.linting) {
    devDependencies.eslint = "^9.32.0";
    devDependencies["@eslint/js"] = "^9.32.0";
    devDependencies.globals = "^16.3.0";
  }
  
  if (customFeatures.development.formatting) {
    devDependencies.prettier = "^3.6.2";
  }
  
  if (customFeatures.testing.jest) {
    devDependencies.jest = "^30.0.5";
    devDependencies["@types/jest"] = "^30.0.0";
  }
  
  if (customFeatures.build.staticGeneration) {
    devDependencies["npm-run-all"] = "^4.1.5";
  }

  return { dependencies, devDependencies };
}

function generateScriptsFromCustom(customFeatures) {
  const scripts = {
    start: "node index.js",
    dev: "nodemon index.js"
  };

  if (customFeatures.development.sassCompilation) {
    scripts["build-css"] = "sass --load-path=node_modules scss/main.scss public/css/styles.css";
    scripts["watch-css"] = "sass --watch --load-path=node_modules scss/main.scss:public/css/styles.css";
  }
  
  if (customFeatures.development.hotReload) {
    scripts["start:dev"] = "npm-run-all --parallel watch-css dev";
  }
  
  if (customFeatures.testing.jest) {
    scripts.test = "jest";
    scripts["test:watch"] = "jest --watch";
    if (customFeatures.testing.coverage) {
      scripts["test:coverage"] = "jest --coverage";
    }
  }
  
  if (customFeatures.development.linting) {
    scripts.lint = "eslint .";
    scripts["lint:fix"] = "eslint . --fix";
  }
  
  if (customFeatures.build.staticGeneration) {
    scripts.build = "npm-run-all build-css";
  }

  return scripts;
}

async function generateSetupInstructions(preset, customFeatures) {
  const instructions = {
    minimal: `
# Minimal Setup Instructions

## Quick Start
1. \`npm install\`
2. \`npm run start:dev\`
3. Open http://localhost:3000

## Key Files to Edit
- \`data/pages.json\` - Page content
- \`scss/main.scss\` - Styles
- \`views/layout.ejs\` - Layout

## Available Commands
- \`npm run start:dev\` - Development server
- \`npm run build\` - Build CSS
- \`npm run watch-css\` - Watch SASS files
`,

    standard: `
# Standard Setup Instructions

## Quick Start
1. \`npm install\`
2. \`npm run start:dev\`
3. Open http://localhost:3000

## Key Features Enabled
- Bootstrap 5 with icons
- SASS compilation
- Security headers
- Testing framework
- Build process

## Available Commands
- \`npm run start:dev\` - Development server
- \`npm run build\` - Build for production
- \`npm run test\` - Run tests
- \`npm run lint\` - Check code quality
`,

    production: `
# Production Setup Instructions

## Quick Start
1. \`npm install\`
2. \`npm run start:dev\`
3. Open http://localhost:3000

## Production Features
- All security features enabled
- PWA capabilities
- Service worker
- Caching
- Git hooks for code quality

## Deployment
- \`npm run build\` - Build for production
- \`npm run docker:dev\` - Run with Docker
- \`npm run test:ci\` - CI testing
`,

    learning: `
# Learning Setup Instructions

## Quick Start
1. \`npm install\`
2. \`npm run start:dev\`
3. Open http://localhost:3000

## Learning Features
- Comprehensive testing with coverage
- API endpoints for learning
- Extra documentation
- Code quality tools

## Learning Path
1. Explore the component library
2. Study the build process
3. Learn about testing
4. Understand security features
`
  };

  const content = customFeatures ? 
    `# Custom Configuration Instructions

## Quick Start
1. \`npm install\`
2. \`npm run start:dev\`
3. Open http://localhost:3000

## Your Custom Features
${Object.entries(customFeatures).map(([category, features]) => 
  Object.entries(features).filter(([, enabled]) => enabled)
    .map(([feature]) => `- ${category}.${feature}`).join('\n')
).join('\n')}

## Available Commands
- \`npm run start:dev\` - Development server
- \`npm run build\` - Build for production
- \`npm run test\` - Run tests (if enabled)
- \`npm run lint\` - Check code quality (if enabled)
` : 
    instructions[preset] || instructions.standard;

  fs.writeFileSync('SETUP_INSTRUCTIONS.md', content);
  console.log('✅ Created setup instructions');
}

// Run the wizard if this script is executed directly
if (require.main === module) {
  runWizard().catch(console.error);
}

module.exports = { runWizard }; 