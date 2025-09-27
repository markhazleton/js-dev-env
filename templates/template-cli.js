/**
 * Template CLI Manager
 * Command-line interface for template generation
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const TemplateGenerator = require('./template-generator');

class TemplateCLI {
  constructor() {
    this.generator = new TemplateGenerator();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Main CLI entry point
   */
  async run(args = process.argv.slice(2)) {
    try {
      const command = args[0];

      switch (command) {
        case 'list':
          this.listTemplates();
          break;
        case 'info':
          await this.showTemplateInfo(args[1]);
          break;
        case 'generate':
          await this.generateTemplate(args[1], args[2]);
          break;
        case 'wizard':
          await this.runWizard();
          break;
        case 'help':
        default:
          this.showHelp();
          break;
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  /**
   * List available templates
   */
  listTemplates() {
    console.log('\n🎨 Available Templates\n');
    
    const templates = this.generator.getAvailableTemplates();
    
    for (const [key, template] of Object.entries(templates)) {
      console.log(`📦 ${key}`);
      console.log(`   Name: ${template.name}`);
      console.log(`   Description: ${template.description}`);
      console.log(`   Preset: ${template.preset}`);
      console.log(`   Features: ${template.featureCount}`);
      console.log('');
    }
  }

  /**
   * Show detailed template information
   */
  async showTemplateInfo(templateType) {
    if (!templateType) {
      console.log('❌ Please specify a template type');
      this.showHelp();
      return;
    }

    const template = this.generator.getTemplateInfo(templateType);
    if (!template) {
      console.log(`❌ Unknown template type: ${templateType}`);
      return;
    }

    console.log(`\n📦 ${template.name}\n`);
    console.log(`Description: ${template.description}`);
    console.log(`Preset: ${template.preset}`);
    console.log(`Features: ${template.features.length}\n`);

    console.log('🔧 Features Included:');
    template.features.forEach(feature => {
      console.log(`   ✅ ${feature}`);
    });

    if (template.excludeFiles) {
      console.log('\n🚫 Excluded Files/Directories:');
      template.excludeFiles.forEach(file => {
        console.log(`   ❌ ${file}`);
      });
    }

    if (template.additionalFiles) {
      console.log('\n➕ Additional Files/Directories:');
      template.additionalFiles.forEach(file => {
        console.log(`   📁 ${file}`);
      });
    }

    if (template.packageJsonOverrides && template.packageJsonOverrides.dependencies) {
      console.log('\n📦 Additional Dependencies:');
      Object.keys(template.packageJsonOverrides.dependencies).forEach(dep => {
        console.log(`   📋 ${dep}`);
      });
    }

    if (template.packageJsonOverrides && template.packageJsonOverrides.scripts) {
      console.log('\n⚡ Additional Scripts:');
      Object.keys(template.packageJsonOverrides.scripts).forEach(script => {
        console.log(`   🔧 npm run ${script}`);
      });
    }
  }

  /**
   * Generate template with basic options
   */
  async generateTemplate(templateType, outputPath) {
    if (!templateType) {
      console.log('❌ Please specify a template type');
      this.showHelp();
      return;
    }

    if (!outputPath) {
      console.log('❌ Please specify an output directory');
      this.showHelp();
      return;
    }

    const template = this.generator.getTemplateInfo(templateType);
    if (!template) {
      console.log(`❌ Unknown template type: ${templateType}`);
      return;
    }

    // Check if output directory exists
    if (fs.existsSync(outputPath)) {
      const answer = await this.question(`📁 Directory ${outputPath} already exists. Continue? (y/N): `);
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ Generation cancelled');
        return;
      }
    }

    console.log(`\n🎨 Generating ${template.name}...`);
    
    const result = await this.generator.generateTemplate(templateType, outputPath, {
      projectName: path.basename(outputPath),
      description: template.description
    });

    console.log(`\n✅ Template generated successfully!`);
    console.log(`📁 Location: ${result.outputDir}`);
    console.log(`🔧 Features: ${result.features.length}`);
    console.log(`\n🚀 Next steps:`);
    console.log(`   cd ${outputPath}`);
    console.log(`   npm install`);
    console.log(`   npm run dev`);
  }

  /**
   * Run interactive template generation wizard
   */
  async runWizard() {
    console.log('\n🧙‍♂️ Template Generation Wizard\n');

    // Get template type
    console.log('Available templates:');
    const templates = this.generator.getAvailableTemplates();
    Object.entries(templates).forEach(([key, template], index) => {
      console.log(`   ${index + 1}. ${key} - ${template.description}`);
    });

    const templateKeys = Object.keys(templates);
    let templateChoice;
    
    while (true) {
      const answer = await this.question('\nSelect template (1-' + templateKeys.length + '): ');
      const choice = parseInt(answer) - 1;
      
      if (choice >= 0 && choice < templateKeys.length) {
        templateChoice = templateKeys[choice];
        break;
      } else {
        console.log('❌ Invalid choice. Please try again.');
      }
    }

    const selectedTemplate = templates[templateChoice];
    console.log(`\n📦 Selected: ${selectedTemplate.name}`);
    console.log(`📝 ${selectedTemplate.description}\n`);

    // Get project details
    const projectName = await this.question('Project name: ') || 'my-project';
    const author = await this.question('Author name: ') || 'Developer';
    const description = await this.question('Project description: ') || selectedTemplate.description;
    const license = await this.question('License (MIT): ') || 'MIT';
    
    // Get output directory
    const defaultOutput = `./${projectName}`;
    const outputDir = await this.question(`Output directory (${defaultOutput}): `) || defaultOutput;

    // Check if output directory exists
    if (fs.existsSync(outputDir)) {
      const answer = await this.question(`\n📁 Directory ${outputDir} already exists. Continue? (y/N): `);
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ Generation cancelled');
        return;
      }
    }

    // Show summary
    console.log('\n📋 Generation Summary:');
    console.log(`   Template: ${selectedTemplate.name}`);
    console.log(`   Project: ${projectName}`);
    console.log(`   Author: ${author}`);
    console.log(`   Description: ${description}`);
    console.log(`   License: ${license}`);
    console.log(`   Output: ${outputDir}`);
    console.log(`   Features: ${selectedTemplate.featureCount}`);

    const confirm = await this.question('\nProceed with generation? (Y/n): ');
    if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'no') {
      console.log('❌ Generation cancelled');
      return;
    }

    // Generate template
    console.log(`\n🎨 Generating ${selectedTemplate.name}...`);
    
    const result = await this.generator.generateTemplate(templateChoice, outputDir, {
      projectName,
      author,
      description,
      license
    });

    console.log(`\n✅ Template generated successfully!`);
    console.log(`📁 Location: ${result.outputDir}`);
    console.log(`🔧 Features: ${result.features.length}`);
    console.log(`⏰ Generated: ${result.generatedAt}`);
    
    console.log(`\n🚀 Next steps:`);
    console.log(`   cd ${outputDir}`);
    console.log(`   npm install`);
    console.log(`   npm run dev`);
    
    // Show feature list
    console.log(`\n🔧 Enabled Features:`);
    result.features.slice(0, 10).forEach(feature => {
      console.log(`   ✅ ${feature}`);
    });
    
    if (result.features.length > 10) {
      console.log(`   ... and ${result.features.length - 10} more features`);
    }
  }

  /**
   * Show help information
   */
  showHelp() {
    console.log(`
🎨 Template Generator CLI

Usage:
  template-cli <command> [options]

Commands:
  list                     List all available templates
  info <template>          Show detailed template information
  generate <template> <dir> Generate template to directory
  wizard                   Interactive template generation wizard
  help                     Show this help message

Examples:
  template-cli list
  template-cli info minimal
  template-cli generate blog my-blog
  template-cli wizard

Available Templates:
  minimal     - Essential features only
  blog        - Content management focused
  ecommerce   - Shopping cart ready
  api         - Backend services focused
  spa         - Single page application
  saas        - Multi-tenant SaaS foundation
`);
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
  const cli = new TemplateCLI();
  cli.run().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = TemplateCLI;