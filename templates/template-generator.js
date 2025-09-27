/**
 * Template Generator
 * Generate different starter templates based on use case
 */

const fs = require('fs');
const path = require('path');
const { getEnabledFeatures } = require('../config/features');

class TemplateGenerator {
  constructor() {
    this.templates = new Map();
    this.loadTemplateConfigurations();
  }

  /**
   * Load template configurations
   */
  loadTemplateConfigurations() {
    const templateConfigs = {
      minimal: {
        name: 'Minimal Starter',
        description: 'Essential features only - perfect for simple projects',
        preset: 'minimal',
        excludeFiles: [
          'plugins/',
          'tools/seo/',
          'tools/maintenance/',
          'tools/git/',
          'coverage/',
          'temp/',
          'artifacts/'
        ],
        packageJsonOverrides: {
          scripts: {
            "dev": "npm-run-all build-css-dev --parallel watch-css start:server",
            "build": "npm run build-css && npm run copy-icons",
            "test": "jest",
            "start": "node index.js"
          }
        },
        features: getEnabledFeatures('minimal')
      },

      blog: {
        name: 'Blog Template',
        description: 'Content management focused with markdown support',
        preset: 'standard',
        additionalFiles: [
          'content/',
          'tools/content/'
        ],
        packageJsonOverrides: {
          dependencies: {
            "marked": "^12.0.0",
            "front-matter": "^4.0.2",
            "rss": "^1.2.2"
          },
          scripts: {
            "content:build": "node tools/content/build-content.js",
            "content:new": "node tools/content/new-post.js"
          }
        },
        features: [...getEnabledFeatures('standard'), 'content.markdown', 'content.rss']
      },

      ecommerce: {
        name: 'E-commerce Template',
        description: 'Shopping cart and payment integration ready',
        preset: 'production',
        additionalFiles: [
          'store/',
          'tools/store/'
        ],
        packageJsonOverrides: {
          dependencies: {
            "stripe": "^14.0.0",
            "express-session": "^1.17.3",
            "connect-mongo": "^5.1.0"
          },
          scripts: {
            "store:setup": "node tools/store/setup.js",
            "store:migrate": "node tools/store/migrate.js"
          }
        },
        features: [...getEnabledFeatures('production'), 'store.cart', 'store.payments', 'store.inventory']
      },

      api: {
        name: 'API-First Template',
        description: 'Backend services and API development focused',
        preset: 'production',
        excludeFiles: [
          'views/',
          'scss/',
          'public/js/component-library.js',
          'public/js/theme-toggle.js'
        ],
        packageJsonOverrides: {
          dependencies: {
            "swagger-ui-express": "^5.0.0",
            "helmet": "^7.1.0",
            "express-rate-limit": "^7.1.5",
            "joi": "^17.12.0"
          },
          scripts: {
            "docs:generate": "node tools/api/generate-docs.js",
            "api:validate": "node tools/api/validate-schemas.js"
          }
        },
        features: [...getEnabledFeatures('production'), 'api.swagger', 'api.validation', 'api.versioning']
      },

      spa: {
        name: 'Single Page Application',
        description: 'Client-side focused with modern JavaScript',
        preset: 'standard',
        additionalFiles: [
          'src/',
          'webpack.config.js'
        ],
        packageJsonOverrides: {
          dependencies: {
            "webpack": "^5.89.0",
            "webpack-cli": "^5.1.4",
            "babel-loader": "^9.1.3",
            "@babel/core": "^7.23.6"
          },
          scripts: {
            "build:webpack": "webpack --mode=production",
            "dev:webpack": "webpack --mode=development --watch"
          }
        },
        features: [...getEnabledFeatures('standard'), 'spa.routing', 'spa.state', 'spa.bundling']
      },

      saas: {
        name: 'Multi-tenant SaaS',
        description: 'Enterprise SaaS application foundation',
        preset: 'production',
        additionalFiles: [
          'tenant/',
          'auth/',
          'billing/',
          'tools/tenant/'
        ],
        packageJsonOverrides: {
          dependencies: {
            "passport": "^0.7.0",
            "passport-local": "^1.0.0",
            "bcryptjs": "^2.4.3",
            "jsonwebtoken": "^9.0.2"
          },
          scripts: {
            "tenant:create": "node tools/tenant/create.js",
            "auth:setup": "node tools/auth/setup.js",
            "billing:sync": "node tools/billing/sync.js"
          }
        },
        features: [...getEnabledFeatures('production'), 'auth.multiTenant', 'billing.subscriptions', 'admin.dashboard']
      }
    };

    for (const [key, config] of Object.entries(templateConfigs)) {
      this.templates.set(key, config);
    }
  }

  /**
   * Get available templates
   */
  getAvailableTemplates() {
    const result = {};
    for (const [key, template] of this.templates) {
      result[key] = {
        name: template.name,
        description: template.description,
        preset: template.preset,
        featureCount: template.features.length
      };
    }
    return result;
  }

  /**
   * Generate template
   */
  async generateTemplate(templateType, outputDir, options = {}) {
    const template = this.templates.get(templateType);
    if (!template) {
      throw new Error(`Unknown template type: ${templateType}`);
    }

    const {
      projectName = 'my-project',
      author = 'Developer',
      description = template.description,
      license = 'MIT'
    } = options;

    console.log(`🎨 Generating ${template.name} template...`);

    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Copy base files
    await this.copyBaseFiles(outputDir, template);

    // Generate package.json
    await this.generatePackageJson(outputDir, template, {
      projectName,
      author,
      description,
      license
    });

    // Generate configuration files
    await this.generateConfigFiles(outputDir, template);

    // Generate README
    await this.generateReadme(outputDir, template, { projectName, description });

    // Generate feature-specific files
    await this.generateFeatureFiles(outputDir, template);

    console.log(`✅ Template generated successfully: ${outputDir}`);
    console.log(`📝 Features included: ${template.features.length}`);
    
    return {
      templateType,
      outputDir,
      features: template.features,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Copy base files from current project
   */
  async copyBaseFiles(outputDir, template) {
    const baseDir = process.cwd();
    const filesToCopy = [
      'index.js',
      'data/',
      'views/',
      'scss/',
      'public/',
      'utils/',
      'config/',
      'tests/',
      '.env.example',
      '.gitignore',
      'eslint.config.mjs',
      'jest.config.js'
    ];

    for (const file of filesToCopy) {
      const sourcePath = path.join(baseDir, file);
      const destPath = path.join(outputDir, file);

      // Skip excluded files
      if (template.excludeFiles && template.excludeFiles.some(excluded => file.startsWith(excluded))) {
        continue;
      }

      if (fs.existsSync(sourcePath)) {
        await this.copyRecursive(sourcePath, destPath);
      }
    }

    // Copy additional files if specified
    if (template.additionalFiles) {
      for (const file of template.additionalFiles) {
        // These would be copied from template-specific directories
        // For now, we'll create placeholder directories
        const destPath = path.join(outputDir, file);
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
          
          // Add placeholder file
          const placeholderPath = path.join(destPath, '.gitkeep');
          fs.writeFileSync(placeholderPath, `# ${file}\n\nThis directory is for ${template.name} specific files.\n`);
        }
      }
    }
  }

  /**
   * Copy files/directories recursively
   */
  async copyRecursive(source, destination) {
    const stats = fs.statSync(source);

    if (stats.isDirectory()) {
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }

      const items = fs.readdirSync(source);
      for (const item of items) {
        const sourcePath = path.join(source, item);
        const destPath = path.join(destination, item);
        await this.copyRecursive(sourcePath, destPath);
      }
    } else {
      // Copy file
      const destDir = path.dirname(destination);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(source, destination);
    }
  }

  /**
   * Generate customized package.json
   */
  async generatePackageJson(outputDir, template, projectInfo) {
    const basePackagePath = path.join(process.cwd(), 'package.json');
    const basePackage = JSON.parse(fs.readFileSync(basePackagePath, 'utf-8'));

    const customPackage = {
      ...basePackage,
      name: projectInfo.projectName,
      version: '1.0.0',
      description: projectInfo.description,
      author: projectInfo.author,
      license: projectInfo.license,
      // Apply template-specific overrides
      ...template.packageJsonOverrides
    };

    // Merge scripts if provided
    if (template.packageJsonOverrides && template.packageJsonOverrides.scripts) {
      customPackage.scripts = {
        ...basePackage.scripts,
        ...template.packageJsonOverrides.scripts
      };
    }

    // Merge dependencies if provided
    if (template.packageJsonOverrides && template.packageJsonOverrides.dependencies) {
      customPackage.dependencies = {
        ...basePackage.dependencies,
        ...template.packageJsonOverrides.dependencies
      };
    }

    const packagePath = path.join(outputDir, 'package.json');
    fs.writeFileSync(packagePath, JSON.stringify(customPackage, null, 2));
  }

  /**
   * Generate configuration files
   */
  async generateConfigFiles(outputDir, template) {
    // Generate features configuration for template
    const featuresConfig = this.generateFeaturesConfig(template);
    const featuresPath = path.join(outputDir, 'config', 'features.js');
    
    const configDir = path.dirname(featuresPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(featuresPath, featuresConfig);

    // Generate template-specific configuration
    const templateConfig = {
      template: {
        type: template.name,
        preset: template.preset,
        features: template.features,
        generatedAt: new Date().toISOString()
      }
    };

    const templateConfigPath = path.join(outputDir, 'template.config.js');
    fs.writeFileSync(templateConfigPath, `module.exports = ${JSON.stringify(templateConfig, null, 2)};`);
  }

  /**
   * Generate features configuration for template
   */
  generateFeaturesConfig(template) {
    return `/**
 * Feature Configuration - ${template.name}
 * Generated template with ${template.features.length} features
 */

const features = {
  // Template: ${template.name}
  // Preset: ${template.preset}
  // Generated: ${new Date().toISOString()}
  
  // Core features (always enabled)
  core: {
    express: true,
    ejs: ${template.features.includes('core.ejs')},
    staticFiles: true,
    basicRouting: true
  },

  // UI/UX features
  ui: {
    bootstrap: ${template.features.includes('ui.bootstrap')},
    icons: ${template.features.includes('ui.icons')},
    darkMode: ${template.features.includes('ui.darkMode')},
    responsive: ${template.features.includes('ui.responsive')},
    components: ${template.features.includes('ui.components')}
  },

  // Development features
  development: {
    hotReload: ${template.features.includes('development.hotReload')},
    sassCompilation: ${template.features.includes('development.sassCompilation')},
    linting: ${template.features.includes('development.linting')},
    formatting: ${template.features.includes('development.formatting')},
    gitHooks: false
  },

  // Testing features
  testing: {
    jest: ${template.features.includes('testing.jest')},
    coverage: ${template.features.includes('testing.coverage')},
    apiTests: ${template.features.includes('testing.apiTests')}
  },

  // Security features
  security: {
    helmet: ${template.features.includes('security.helmet')},
    rateLimiting: ${template.features.includes('security.rateLimiting')},
    compression: ${template.features.includes('security.compression')},
    csp: ${template.features.includes('security.csp')},
    inputValidation: ${template.features.includes('security.inputValidation')}
  },

  // Build features
  build: {
    staticGeneration: ${template.features.includes('build.staticGeneration')},
    assetOptimization: ${template.features.includes('build.assetOptimization')},
    githubPages: ${template.features.includes('build.githubPages')}
  },

  // DevOps features
  devops: {
    docker: ${template.features.includes('devops.docker')},
    ci: ${template.features.includes('devops.ci')},
    healthChecks: ${template.features.includes('devops.healthChecks')},
    monitoring: ${template.features.includes('devops.monitoring')}
  },

  // Advanced features
  advanced: {
    pwa: ${template.features.includes('advanced.pwa')},
    serviceWorker: ${template.features.includes('advanced.serviceWorker')},
    database: ${template.features.includes('advanced.database')},
    api: ${template.features.includes('advanced.api')},
    caching: ${template.features.includes('advanced.caching')}
  }
};

// Template-specific feature presets
const presets = {
  ${template.preset}: {
    description: '${template.description}',
    features: ${JSON.stringify(template.features, null, 4)}
  }
};

module.exports = {
  features,
  presets,
  isFeatureEnabled: (featurePath, preset = '${template.preset}') => {
    // Implementation matches original features.js
    const parts = featurePath.split('.');
    let current = features;
    
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return false;
      }
    }
    
    return current === true;
  },
  getEnabledFeatures: (preset = '${template.preset}') => {
    return presets[preset]?.features || [];
  }
};
`;
  }

  /**
   * Generate README for template
   */
  async generateReadme(outputDir, template, projectInfo) {
    const readme = `# ${projectInfo.projectName}

${projectInfo.description}

## Template Information

- **Template**: ${template.name}
- **Preset**: ${template.preset}
- **Features**: ${template.features.length} enabled

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
\`\`\`

## Features Included

${template.features.map(feature => `- ✅ ${feature}`).join('\n')}

## Template Features

### ${template.name}

${template.description}

This template includes:

${template.features.slice(0, 10).map(feature => `- ${feature}`).join('\n')}
${template.features.length > 10 ? `\n...and ${template.features.length - 10} more features` : ''}

## Development

### Available Scripts

- \`npm run dev\` - Start development server with hot reload
- \`npm run build\` - Build for production
- \`npm run test\` - Run test suite
- \`npm run lint\` - Lint code
- \`npm start\` - Start production server

### Project Structure

\`\`\`
${projectInfo.projectName}/
├── config/          # Configuration files
├── data/           # JSON data files
├── public/         # Static assets
├── scss/           # SASS source files
├── utils/          # Utility functions
├── views/          # EJS templates
├── tests/          # Test files
└── index.js        # Main application file
\`\`\`

## Customization

This project uses a feature flag system. You can customize features by editing \`config/features.js\`.

## License

${projectInfo.license}

---

Generated from **${template.name}** template on ${new Date().toISOString()}
`;

    const readmePath = path.join(outputDir, 'README.md');
    fs.writeFileSync(readmePath, readme);
  }

  /**
   * Generate feature-specific files
   */
  async generateFeatureFiles(outputDir, template) {
    // This would generate template-specific files based on features
    // For now, we'll create basic structure files
    
    if (template.features.includes('content.markdown')) {
      const contentDir = path.join(outputDir, 'content');
      if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
      }
      
      // Create sample blog post
      const samplePost = `---
title: "Welcome to your new blog"
date: "${new Date().toISOString()}"
author: "Author"
tags: ["welcome", "blog"]
---

# Welcome to your new blog

This is a sample blog post. You can create new posts in the \`content/\` directory.

## Features

- Markdown support
- Front matter
- Tag system
- RSS feed generation

Happy blogging!
`;
      
      fs.writeFileSync(path.join(contentDir, 'welcome.md'), samplePost);
    }

    // Add more feature-specific file generation here
  }

  /**
   * Get template information
   */
  getTemplateInfo(templateType) {
    return this.templates.get(templateType);
  }
}

module.exports = TemplateGenerator;