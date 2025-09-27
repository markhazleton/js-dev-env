/**
 * Template Customization Wizard
 * Interactive wizard for advanced template customization
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { templateSchemas, featurePresets } = require('./template-schema');
const TemplateGenerator = require('./template-generator');

class CustomizationWizard {
  constructor() {
    this.generator = new TemplateGenerator();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Run the customization wizard
   */
  async run() {
    try {
      console.log('\n🎨 Advanced Template Customization Wizard\n');
      console.log('Create a fully customized template with your preferred features and settings.\n');

      // Step 1: Basic Information
      const basicInfo = await this.gatherBasicInfo();
      
      // Step 2: Feature Selection
      const features = await this.selectFeatures();
      
      // Step 3: Theme Customization
      const theme = await this.customizeTheme();
      
      // Step 4: Branding Options
      const branding = await this.configureBranding();
      
      // Step 5: Advanced Configuration
      const advanced = await this.advancedConfiguration();
      
      // Step 6: Summary and Confirmation
      const config = {
        ...basicInfo,
        features,
        customization: {
          theme,
          branding,
          ...advanced
        }
      };

      await this.showSummary(config);
      
      const confirm = await this.question('\nProceed with generation? (Y/n): ');
      if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'no') {
        console.log('❌ Generation cancelled');
        return;
      }

      // Generate custom template
      await this.generateCustomTemplate(config);
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Gather basic project information
   */
  async gatherBasicInfo() {
    console.log('📝 Basic Information\n');
    
    const projectName = await this.question('Project name: ');
    const author = await this.question('Author name: ') || 'Developer';
    const description = await this.question('Project description: ');
    const license = await this.question('License (MIT): ') || 'MIT';
    const version = await this.question('Initial version (1.0.0): ') || '1.0.0';
    
    const addRepository = await this.question('Add repository information? (y/N): ');
    let repository = null;
    
    if (addRepository.toLowerCase() === 'y' || addRepository.toLowerCase() === 'yes') {
      const repoUrl = await this.question('Repository URL: ');
      repository = {
        type: 'git',
        url: repoUrl
      };
    }

    const keywordsInput = await this.question('Keywords (comma-separated): ');
    const keywords = keywordsInput ? keywordsInput.split(',').map(k => k.trim()) : [];

    const outputDir = await this.question(`Output directory (./${projectName}): `) || `./${projectName}`;

    return {
      projectName,
      author,
      description,
      license,
      version,
      repository,
      keywords,
      outputDir
    };
  }

  /**
   * Interactive feature selection
   */
  async selectFeatures() {
    console.log('\n🔧 Feature Selection\n');
    
    // Start with preset selection
    console.log('Choose a base preset:');
    console.log('1. Minimal - Essential features only');
    console.log('2. Standard - Balanced feature set');
    console.log('3. Production - Full feature set');
    console.log('4. Custom - Select features manually');
    
    let basePreset = [];
    let customSelection = false;
    
    while (true) {
      const choice = await this.question('\nSelect preset (1-4): ');
      
      switch (choice) {
        case '1':
          basePreset = [...featurePresets.minimal];
          break;
        case '2':
          basePreset = [...featurePresets.standard];
          break;
        case '3':
          basePreset = [...featurePresets.production];
          break;
        case '4':
          customSelection = true;
          break;
        default:
          console.log('❌ Invalid choice. Please try again.');
          continue;
      }
      break;
    }

    if (customSelection) {
      return await this.customFeatureSelection();
    }

    // Allow modification of preset
    console.log(`\n📦 Base preset selected with ${basePreset.length} features`);
    console.log('Features included:');
    basePreset.slice(0, 10).forEach(feature => {
      console.log(`   ✅ ${feature}`);
    });
    
    if (basePreset.length > 10) {
      console.log(`   ... and ${basePreset.length - 10} more features`);
    }

    const modify = await this.question('\nModify feature selection? (y/N): ');
    if (modify.toLowerCase() === 'y' || modify.toLowerCase() === 'yes') {
      return await this.modifyFeatureSelection(basePreset);
    }

    return basePreset;
  }

  /**
   * Custom feature selection from scratch
   */
  async customFeatureSelection() {
    console.log('\n🛠️ Custom Feature Selection\n');
    
    const selectedFeatures = [];
    const featureCategories = {
      'Core Features': ['core.express', 'core.ejs', 'core.staticFiles', 'core.basicRouting'],
      'UI/UX Features': ['ui.bootstrap', 'ui.icons', 'ui.darkMode', 'ui.responsive', 'ui.components'],
      'Development Features': ['development.hotReload', 'development.sassCompilation', 'development.linting', 'development.formatting'],
      'Testing Features': ['testing.jest', 'testing.coverage', 'testing.apiTests', 'testing.e2e'],
      'Security Features': ['security.helmet', 'security.rateLimiting', 'security.compression', 'security.csp'],
      'Build Features': ['build.staticGeneration', 'build.assetOptimization', 'build.githubPages'],
      'DevOps Features': ['devops.docker', 'devops.ci', 'devops.healthChecks', 'devops.monitoring'],
      'Advanced Features': ['advanced.pwa', 'advanced.serviceWorker', 'advanced.database', 'advanced.api', 'advanced.caching']
    };

    for (const [category, features] of Object.entries(featureCategories)) {
      console.log(`\n${category}:`);
      
      for (const feature of features) {
        const include = await this.question(`  Include ${feature}? (y/N): `);
        if (include.toLowerCase() === 'y' || include.toLowerCase() === 'yes') {
          selectedFeatures.push(feature);
        }
      }
    }

    return selectedFeatures;
  }

  /**
   * Modify existing feature selection
   */
  async modifyFeatureSelection(baseFeatures) {
    console.log('\n✏️ Modify Feature Selection\n');
    console.log('1. Add features');
    console.log('2. Remove features');
    console.log('3. Both');
    
    const choice = await this.question('What would you like to do? (1-3): ');
    let features = [...baseFeatures];

    if (choice === '1' || choice === '3') {
      // Add features
      const availableFeatures = Object.keys(templateSchemas.features.properties)
        .filter(f => !features.includes(f));
      
      if (availableFeatures.length > 0) {
        console.log('\nAvailable features to add:');
        availableFeatures.forEach((feature, index) => {
          console.log(`   ${index + 1}. ${feature}`);
        });
        
        const addInput = await this.question('Enter feature numbers to add (comma-separated): ');
        if (addInput.trim()) {
          const indices = addInput.split(',').map(i => parseInt(i.trim()) - 1);
          indices.forEach(index => {
            if (index >= 0 && index < availableFeatures.length) {
              features.push(availableFeatures[index]);
            }
          });
        }
      }
    }

    if (choice === '2' || choice === '3') {
      // Remove features
      if (features.length > 0) {
        console.log('\nCurrent features:');
        features.forEach((feature, index) => {
          console.log(`   ${index + 1}. ${feature}`);
        });
        
        const removeInput = await this.question('Enter feature numbers to remove (comma-separated): ');
        if (removeInput.trim()) {
          const indices = removeInput.split(',').map(i => parseInt(i.trim()) - 1);
          // Remove in reverse order to maintain indices
          indices.sort((a, b) => b - a).forEach(index => {
            if (index >= 0 && index < features.length) {
              features.splice(index, 1);
            }
          });
        }
      }
    }

    return features;
  }

  /**
   * Theme customization
   */
  async customizeTheme() {
    console.log('\n🎨 Theme Customization\n');
    
    const customize = await this.question('Customize theme colors and styling? (y/N): ');
    if (customize.toLowerCase() !== 'y' && customize.toLowerCase() !== 'yes') {
      return {};
    }

    const theme = {};
    
    const primaryColor = await this.question('Primary color (hex, e.g., #007bff): ');
    if (primaryColor && /^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
      theme.primaryColor = primaryColor;
    }
    
    const secondaryColor = await this.question('Secondary color (hex, e.g., #6c757d): ');
    if (secondaryColor && /^#[0-9A-Fa-f]{6}$/.test(secondaryColor)) {
      theme.secondaryColor = secondaryColor;
    }
    
    const fontFamily = await this.question('Font family (e.g., "Inter", sans-serif): ');
    if (fontFamily) {
      theme.fontFamily = fontFamily;
    }
    
    const borderRadius = await this.question('Border radius (e.g., 8px): ');
    if (borderRadius) {
      theme.borderRadius = borderRadius;
    }

    return theme;
  }

  /**
   * Branding configuration
   */
  async configureBranding() {
    console.log('\n🏷️ Branding Configuration\n');
    
    const addBranding = await this.question('Configure branding elements? (y/N): ');
    if (addBranding.toLowerCase() !== 'y' && addBranding.toLowerCase() !== 'yes') {
      return {};
    }

    const branding = {};
    
    const siteName = await this.question('Site name: ');
    if (siteName) {
      branding.siteName = siteName;
    }
    
    const tagline = await this.question('Tagline: ');
    if (tagline) {
      branding.tagline = tagline;
    }
    
    const logo = await this.question('Logo file path (relative to public/images/): ');
    if (logo) {
      branding.logo = logo;
    }
    
    const favicon = await this.question('Favicon file path (relative to public/): ');
    if (favicon) {
      branding.favicon = favicon;
    }

    return branding;
  }

  /**
   * Advanced configuration options
   */
  async advancedConfiguration() {
    console.log('\n⚙️ Advanced Configuration\n');
    
    const configure = await this.question('Configure advanced options? (y/N): ');
    if (configure.toLowerCase() !== 'y' && configure.toLowerCase() !== 'yes') {
      return {};
    }

    const config = {};
    
    // Layout configuration
    console.log('\nLayout options:');
    console.log('1. Horizontal navigation');
    console.log('2. Vertical navigation');
    console.log('3. Sidebar navigation');
    
    const navChoice = await this.question('Navigation style (1-3): ');
    const navStyles = ['horizontal', 'vertical', 'sidebar'];
    if (navChoice >= '1' && navChoice <= '3') {
      config.layout = {
        navigation: navStyles[parseInt(navChoice) - 1]
      };
    }
    
    const includeFooter = await this.question('Include footer? (Y/n): ');
    if (includeFooter.toLowerCase() === 'n' || includeFooter.toLowerCase() === 'no') {
      config.layout = { ...config.layout, footer: false };
    }
    
    const includeBreadcrumbs = await this.question('Include breadcrumbs? (y/N): ');
    if (includeBreadcrumbs.toLowerCase() === 'y' || includeBreadcrumbs.toLowerCase() === 'yes') {
      config.layout = { ...config.layout, breadcrumbs: true };
    }

    return config;
  }

  /**
   * Show configuration summary
   */
  async showSummary(config) {
    console.log('\n📋 Configuration Summary\n');
    
    console.log(`Project: ${config.projectName}`);
    console.log(`Author: ${config.author}`);
    console.log(`Description: ${config.description}`);
    console.log(`License: ${config.license}`);
    console.log(`Version: ${config.version}`);
    
    if (config.repository) {
      console.log(`Repository: ${config.repository.url}`);
    }
    
    if (config.keywords && config.keywords.length > 0) {
      console.log(`Keywords: ${config.keywords.join(', ')}`);
    }
    
    console.log(`Output: ${config.outputDir}`);
    console.log(`Features: ${config.features.length}`);
    
    if (config.customization.theme && Object.keys(config.customization.theme).length > 0) {
      console.log('\nTheme Customization:');
      Object.entries(config.customization.theme).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }
    
    if (config.customization.branding && Object.keys(config.customization.branding).length > 0) {
      console.log('\nBranding:');
      Object.entries(config.customization.branding).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }
    
    console.log('\nFeatures:');
    config.features.slice(0, 15).forEach(feature => {
      console.log(`   ✅ ${feature}`);
    });
    
    if (config.features.length > 15) {
      console.log(`   ... and ${config.features.length - 15} more features`);
    }
  }

  /**
   * Generate custom template
   */
  async generateCustomTemplate(config) {
    console.log(`\n🎨 Generating custom template...`);
    
    // Create custom template configuration
    const templateConfig = {
      name: `Custom ${config.projectName}`,
      description: config.description,
      preset: 'custom',
      features: config.features,
      packageJsonOverrides: {
        scripts: {
          // Add custom scripts based on features
        }
      }
    };
    
    // Add dependencies based on features
    if (config.features.includes('content.markdown')) {
      templateConfig.packageJsonOverrides.dependencies = {
        ...templateConfig.packageJsonOverrides.dependencies,
        "marked": "^12.0.0",
        "front-matter": "^4.0.2"
      };
    }
    
    if (config.features.includes('advanced.database')) {
      templateConfig.packageJsonOverrides.dependencies = {
        ...templateConfig.packageJsonOverrides.dependencies,
        "sqlite3": "^5.1.6"
      };
    }

    // Generate using the template generator
    const result = await this.generator.generateTemplate('custom', config.outputDir, {
      projectName: config.projectName,
      author: config.author,
      description: config.description,
      license: config.license
    });

    // Apply customizations
    await this.applyCustomizations(config);

    console.log(`\n✅ Custom template generated successfully!`);
    console.log(`📁 Location: ${result.outputDir}`);
    console.log(`🔧 Features: ${result.features.length}`);
    console.log(`🎨 Customizations applied`);
    
    console.log(`\n🚀 Next steps:`);
    console.log(`   cd ${config.outputDir}`);
    console.log(`   npm install`);
    console.log(`   npm run dev`);
  }

  /**
   * Apply customizations to generated template
   */
  async applyCustomizations(config) {
    const { outputDir, customization } = config;
    
    // Apply theme customizations
    if (customization.theme && Object.keys(customization.theme).length > 0) {
      await this.applyThemeCustomizations(outputDir, customization.theme);
    }
    
    // Apply branding customizations
    if (customization.branding && Object.keys(customization.branding).length > 0) {
      await this.applyBrandingCustomizations(outputDir, customization.branding);
    }
  }

  /**
   * Apply theme customizations to SCSS files
   */
  async applyThemeCustomizations(outputDir, theme) {
    const variablesPath = path.join(outputDir, 'scss', '_variables.scss');
    
    if (!fs.existsSync(variablesPath)) {
      return;
    }
    
    let variables = fs.readFileSync(variablesPath, 'utf-8');
    
    if (theme.primaryColor) {
      variables = variables.replace(
        /\$primary:\s*#[0-9A-Fa-f]{6};?/,
        `$primary: ${theme.primaryColor};`
      );
    }
    
    if (theme.secondaryColor) {
      variables = variables.replace(
        /\$secondary:\s*#[0-9A-Fa-f]{6};?/,
        `$secondary: ${theme.secondaryColor};`
      );
    }
    
    if (theme.fontFamily) {
      variables += `\n$font-family-sans-serif: ${theme.fontFamily};\n`;
    }
    
    if (theme.borderRadius) {
      variables += `\n$border-radius: ${theme.borderRadius};\n`;
    }
    
    fs.writeFileSync(variablesPath, variables);
  }

  /**
   * Apply branding customizations
   */
  async applyBrandingCustomizations(outputDir, branding) {
    // Update site configuration or data files with branding information
    const dataPath = path.join(outputDir, 'data', 'pages.json');
    
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      
      if (branding.siteName) {
        data.site = data.site || {};
        data.site.name = branding.siteName;
      }
      
      if (branding.tagline) {
        data.site = data.site || {};
        data.site.tagline = branding.tagline;
      }
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    }
  }

  /**
   * Helper to prompt user for input
   */
  question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }
}

// CLI entry point
if (require.main === module) {
  const wizard = new CustomizationWizard();
  wizard.run().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = CustomizationWizard;