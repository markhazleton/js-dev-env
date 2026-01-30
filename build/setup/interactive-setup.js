#!/usr/bin/env node

/**
 * Interactive Setup Wizard
 * Helps new users configure the project for their specific needs
 */

const fs = require('fs');
const path = require('path');

// Simple prompt implementation (avoiding external dependencies)
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function multipleChoice(question, choices) {
  console.log(`\n${question}`);
  choices.forEach((choice, index) => {
    console.log(`  ${index + 1}. ${choice}`);
  });
  
  const answer = await prompt('\nEnter your choice (number): ');
  const choiceIndex = parseInt(answer) - 1;
  
  if (choiceIndex >= 0 && choiceIndex < choices.length) {
    return choices[choiceIndex];
  } else {
    console.log('Invalid choice, please try again.');
    return await multipleChoice(question, choices);
  }
}

async function checkbox(question, choices) {
  console.log(`\n${question}`);
  choices.forEach((choice, index) => {
    console.log(`  ${index + 1}. ${choice}`);
  });
  console.log('Enter multiple numbers separated by commas (e.g., 1,3,4):');
  
  const answer = await prompt('Your choices: ');
  const selectedIndices = answer.split(',').map(n => parseInt(n.trim()) - 1);
  const selectedChoices = selectedIndices
    .filter(index => index >= 0 && index < choices.length)
    .map(index => choices[index]);
  
  return selectedChoices;
}

async function runSetup() {
  console.log(`
🚀 Welcome to the JsBootSpark Interactive Setup!

Let's configure your project based on your specific needs.
This will help you get started quickly with the right features enabled.
`);

  try {
    // Project type selection
    const projectType = await multipleChoice(
      '📋 What type of project are you building?',
      [
        'Landing Page / Marketing Site',
        'Documentation Site',
        'Web Application / Dashboard',
        'Portfolio / Resume Site',
        'E-commerce Frontend',
        'Blog / Content Site',
        'Custom Project'
      ]
    );

    // Feature selection
    const features = await checkbox(
      '🎛️  Which features do you need? (Select multiple)',
      [
        'Dark Mode Toggle',
        'Progressive Web App (PWA)',
        'SEO Optimization Tools',
        'Google Analytics',
        'Contact Forms',
        'Component Library',
        'Docker Support',
        'Advanced Security Headers'
      ]
    );

    // Development preferences
    const devPrefs = await checkbox(
      '🛠️  Development preferences? (Select multiple)',
      [
        'Hot Reload (recommended)',
        'Automatic Linting',
        'Code Formatting (Prettier)',
        'Git Hooks (Husky)',
        'Advanced Build Tools',
        'Performance Monitoring'
      ]
    );

    // Deployment target
    const deployment = await multipleChoice(
      '🚀 Where will you deploy this project?',
      [
        'GitHub Pages (Free)',
        'Vercel',
        'Netlify',
        'Heroku',
        'AWS',
        'Custom Server',
        'Not sure yet'
      ]
    );

    // Generate configuration
    const config = {
      projectType,
      features,
      devPrefs,
      deployment,
      timestamp: new Date().toISOString()
    };

    // Save configuration
    const configPath = path.join(process.cwd(), 'project-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log(`
✅ Configuration saved to project-config.json

📋 Your Project Configuration:
   Type: ${projectType}
   Features: ${features.join(', ') || 'None selected'}
   Dev Preferences: ${devPrefs.join(', ') || 'None selected'}
   Deployment: ${deployment}

🎯 Recommended Next Steps:
`);

    // Generate recommendations based on selections
    generateRecommendations(config);

    // Ask if they want to apply optimizations
    const applyOptimizations = await prompt('\n🔧 Apply recommended optimizations now? (y/n): ');
    
    if (applyOptimizations.toLowerCase() === 'y') {
      await applyConfigurationOptimizations(config);
    } else {
      console.log('\n💡 You can apply optimizations later by running: npm run configure:apply');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

function generateRecommendations(config) {
  const { projectType, features, deployment } = config;

  // Project-specific recommendations
  if (projectType.includes('Landing Page')) {
    console.log('   📄 Focus on: SEO optimization, fast loading, conversion elements');
    console.log('   🎨 Templates: Use minimal template with marketing components');
  }

  if (projectType.includes('Documentation')) {
    console.log('   📚 Focus on: Clear navigation, search functionality, responsive design');
    console.log('   🔧 Tools: Enable advanced component library for docs');
  }

  if (projectType.includes('Web Application')) {
    console.log('   💻 Focus on: User authentication, data management, responsive layout');
    console.log('   🛡️  Security: Enable advanced security headers');
  }

  // Feature-specific recommendations
  if (features.includes('PWA')) {
    console.log('   📱 PWA: Service worker and manifest already configured');
  }

  if (features.includes('SEO Optimization Tools')) {
    console.log('   🔍 SEO: Run npm run audit:seo to check optimization');
  }

  // Deployment-specific recommendations
  if (deployment === 'GitHub Pages (Free)') {
    console.log('   🌐 Deployment: Run npm run build for GitHub Pages deployment');
    console.log('   📝 Setup: Enable GitHub Actions for automatic deployment');
  }

  if (deployment === 'Vercel' || deployment === 'Netlify') {
    console.log('   ⚡ JAMstack: Your setup is perfect for modern static deployment');
  }
}

async function applyConfigurationOptimizations(config) {
  console.log('\n🔧 Applying configuration optimizations...\n');

  try {
    // Create optimized feature configuration
    const featuresConfig = {
      darkMode: config.features.includes('Dark Mode Toggle'),
      pwa: config.features.includes('Progressive Web App (PWA)'),
      seo: config.features.includes('SEO Optimization Tools'),
      analytics: config.features.includes('Google Analytics'),
      forms: config.features.includes('Contact Forms'),
      componentLibrary: config.features.includes('Component Library'),
      docker: config.features.includes('Docker Support'),
      security: config.features.includes('Advanced Security Headers')
    };

    // Save features configuration
    const featuresPath = path.join(process.cwd(), 'config', 'features.js');
    const featuresContent = `/**
 * Project Features Configuration
 * Generated by Interactive Setup Wizard
 */

module.exports = {
  features: ${JSON.stringify(featuresConfig, null, 4)},
  
  // Project type optimizations
  projectType: "${config.projectType}",
  
  // Deployment target
  deployment: "${config.deployment}",
  
  // Generated on: ${new Date().toLocaleDateString()}
};`;

    // Ensure config directory exists
    const configDir = path.dirname(featuresPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(featuresPath, featuresContent);
    console.log('✅ Features configuration updated');

    // Create README with project-specific instructions
    await generateProjectReadme(config);
    console.log('✅ Project-specific README created');

    console.log(`
🎉 Setup Complete!

Your project is now optimized for: ${config.projectType}

🚀 Quick Start:
   1. npm run dev      # Start development server
   2. npm run test     # Run tests
   3. npm run build    # Build for production

📚 Learn More:
   - Check README-PROJECT.md for project-specific guidance
   - Run 'npm run help' to see all available commands
   - Visit the component library at http://localhost:3000/components

Happy coding! 🎯
`);

  } catch (error) {
    console.error('❌ Failed to apply optimizations:', error.message);
  }
}

async function generateProjectReadme(config) {
  const readmePath = path.join(process.cwd(), 'README-PROJECT.md');
  
  const readmeContent = `# ${config.projectType} Project

Generated by JsBootSpark Interactive Setup on ${new Date().toLocaleDateString()}

## 🎯 Project Overview

**Type**: ${config.projectType}  
**Deployment**: ${config.deployment}  
**Features**: ${config.features.join(', ') || 'Basic setup'}

## 🚀 Quick Start

\`\`\`bash
# Start development
npm run dev

# Build for production  
npm run build

# Run tests
npm run test
\`\`\`

## 📋 Project-Specific Notes

${generateProjectNotes(config)}

## 🔧 Configuration

Your project configuration is saved in:
- \`project-config.json\` - Setup wizard results
- \`config/features.js\` - Feature flags and settings

## 📚 Next Steps

${generateNextSteps(config)}

---

*This README was generated by the Interactive Setup Wizard. You can regenerate it by running \`npm run configure\`.*
`;

  fs.writeFileSync(readmePath, readmeContent);
}

function generateProjectNotes(config) {
  const notes = [];
  
  if (config.projectType.includes('Landing Page')) {
    notes.push('- Focus on performance and SEO optimization');
    notes.push('- Use the marketing-focused components in the library');
    notes.push('- Test conversion elements regularly');
  }
  
  if (config.projectType.includes('Documentation')) {
    notes.push('- Organize content in `data/pages.json`');
    notes.push('- Use clear headings and navigation structure');
    notes.push('- Test accessibility with `npm run audit:seo`');
  }
  
  if (config.features.includes('PWA')) {
    notes.push('- PWA features are pre-configured in `public/manifest.json`');
    notes.push('- Service worker handles offline functionality');
  }
  
  return notes.length > 0 ? notes.join('\n') : 'No specific notes for your configuration.';
}

function generateNextSteps(config) {
  const steps = ['1. Customize `data/pages.json` with your content'];
  
  if (config.features.includes('Dark Mode Toggle')) {
    steps.push('2. Test dark mode functionality');
  }
  
  if (config.deployment === 'GitHub Pages (Free)') {
    steps.push('3. Set up GitHub Actions for automatic deployment');
    steps.push('4. Configure custom domain if needed');
  }
  
  steps.push(`${steps.length + 1}. Explore the component library at /components`);
  steps.push(`${steps.length + 1}. Run \`npm run audit:all\` to check quality metrics`);
  
  return steps.join('\n');
}

// Run the setup if this file is executed directly
if (require.main === module) {
  runSetup().catch(console.error);
}

module.exports = { runSetup, generateRecommendations };