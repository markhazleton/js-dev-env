/**
 * Template Schema Definitions
 * Define the structure and validation for template configurations
 */

const templateSchemas = {
  /**
   * Base template configuration schema
   */
  template: {
    type: 'object',
    required: ['name', 'description', 'preset', 'features'],
    properties: {
      name: {
        type: 'string',
        description: 'Display name of the template'
      },
      description: {
        type: 'string',
        description: 'Brief description of the template purpose'
      },
      preset: {
        type: 'string',
        enum: ['minimal', 'standard', 'production'],
        description: 'Base feature preset to use'
      },
      features: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of enabled features'
      },
      excludeFiles: {
        type: 'array',
        items: { type: 'string' },
        description: 'Files/directories to exclude from base template'
      },
      additionalFiles: {
        type: 'array',
        items: { type: 'string' },
        description: 'Additional files/directories to include'
      },
      packageJsonOverrides: {
        type: 'object',
        description: 'Overrides for package.json',
        properties: {
          dependencies: {
            type: 'object',
            description: 'Additional dependencies'
          },
          devDependencies: {
            type: 'object',
            description: 'Additional dev dependencies'
          },
          scripts: {
            type: 'object',
            description: 'Additional npm scripts'
          }
        }
      },
      postGeneration: {
        type: 'object',
        description: 'Post-generation configuration',
        properties: {
          commands: {
            type: 'array',
            items: { type: 'string' },
            description: 'Commands to run after generation'
          },
          instructions: {
            type: 'array',
            items: { type: 'string' },
            description: 'Manual instructions for the user'
          }
        }
      }
    }
  },

  /**
   * Project metadata schema
   */
  projectMetadata: {
    type: 'object',
    required: ['projectName'],
    properties: {
      projectName: {
        type: 'string',
        pattern: '^[a-z0-9-_]+$',
        description: 'Project name (lowercase, hyphens, underscores only)'
      },
      author: {
        type: 'string',
        description: 'Project author'
      },
      description: {
        type: 'string',
        description: 'Project description'
      },
      license: {
        type: 'string',
        enum: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC'],
        default: 'MIT',
        description: 'Project license'
      },
      version: {
        type: 'string',
        pattern: '^\\d+\\.\\d+\\.\\d+$',
        default: '1.0.0',
        description: 'Initial version'
      },
      repository: {
        type: 'object',
        properties: {
          type: { type: 'string', default: 'git' },
          url: { type: 'string' }
        }
      },
      keywords: {
        type: 'array',
        items: { type: 'string' },
        description: 'Project keywords'
      }
    }
  },

  /**
   * Feature definitions schema
   */
  features: {
    type: 'object',
    properties: {
      // Core features
      'core.express': { type: 'boolean', description: 'Express.js server' },
      'core.ejs': { type: 'boolean', description: 'EJS templating' },
      'core.staticFiles': { type: 'boolean', description: 'Static file serving' },
      'core.basicRouting': { type: 'boolean', description: 'Basic routing' },

      // UI/UX features
      'ui.bootstrap': { type: 'boolean', description: 'Bootstrap CSS framework' },
      'ui.icons': { type: 'boolean', description: 'Bootstrap Icons' },
      'ui.darkMode': { type: 'boolean', description: 'Dark/light mode toggle' },
      'ui.responsive': { type: 'boolean', description: 'Responsive design' },
      'ui.components': { type: 'boolean', description: 'Component library' },

      // Development features
      'development.hotReload': { type: 'boolean', description: 'Hot reload development' },
      'development.sassCompilation': { type: 'boolean', description: 'SASS compilation' },
      'development.linting': { type: 'boolean', description: 'ESLint configuration' },
      'development.formatting': { type: 'boolean', description: 'Prettier formatting' },
      'development.gitHooks': { type: 'boolean', description: 'Git hooks setup' },

      // Testing features
      'testing.jest': { type: 'boolean', description: 'Jest testing framework' },
      'testing.coverage': { type: 'boolean', description: 'Code coverage reporting' },
      'testing.apiTests': { type: 'boolean', description: 'API endpoint testing' },
      'testing.e2e': { type: 'boolean', description: 'End-to-end testing' },

      // Security features
      'security.helmet': { type: 'boolean', description: 'Helmet.js security headers' },
      'security.rateLimiting': { type: 'boolean', description: 'Rate limiting middleware' },
      'security.compression': { type: 'boolean', description: 'Response compression' },
      'security.csp': { type: 'boolean', description: 'Content Security Policy' },
      'security.inputValidation': { type: 'boolean', description: 'Input validation' },

      // Build features
      'build.staticGeneration': { type: 'boolean', description: 'Static site generation' },
      'build.assetOptimization': { type: 'boolean', description: 'Asset optimization' },
      'build.githubPages': { type: 'boolean', description: 'GitHub Pages deployment' },
      'build.bundling': { type: 'boolean', description: 'Asset bundling' },

      // DevOps features
      'devops.docker': { type: 'boolean', description: 'Docker containerization' },
      'devops.ci': { type: 'boolean', description: 'CI/CD pipeline' },
      'devops.healthChecks': { type: 'boolean', description: 'Health check endpoints' },
      'devops.monitoring': { type: 'boolean', description: 'Application monitoring' },

      // Advanced features
      'advanced.pwa': { type: 'boolean', description: 'Progressive Web App' },
      'advanced.serviceWorker': { type: 'boolean', description: 'Service Worker' },
      'advanced.database': { type: 'boolean', description: 'Database integration' },
      'advanced.api': { type: 'boolean', description: 'REST API endpoints' },
      'advanced.caching': { type: 'boolean', description: 'Caching layer' },

      // Content features
      'content.markdown': { type: 'boolean', description: 'Markdown processing' },
      'content.rss': { type: 'boolean', description: 'RSS feed generation' },
      'content.cms': { type: 'boolean', description: 'Content management system' },
      'content.blog': { type: 'boolean', description: 'Blog functionality' },

      // E-commerce features
      'store.cart': { type: 'boolean', description: 'Shopping cart' },
      'store.payments': { type: 'boolean', description: 'Payment integration' },
      'store.inventory': { type: 'boolean', description: 'Inventory management' },
      'store.orders': { type: 'boolean', description: 'Order management' },

      // API features
      'api.swagger': { type: 'boolean', description: 'Swagger/OpenAPI documentation' },
      'api.validation': { type: 'boolean', description: 'Request validation' },
      'api.versioning': { type: 'boolean', description: 'API versioning' },
      'api.authentication': { type: 'boolean', description: 'API authentication' },

      // SPA features
      'spa.routing': { type: 'boolean', description: 'Client-side routing' },
      'spa.state': { type: 'boolean', description: 'State management' },
      'spa.bundling': { type: 'boolean', description: 'Module bundling' },

      // Authentication features
      'auth.local': { type: 'boolean', description: 'Local authentication' },
      'auth.oauth': { type: 'boolean', description: 'OAuth integration' },
      'auth.multiTenant': { type: 'boolean', description: 'Multi-tenant authentication' },
      'auth.rbac': { type: 'boolean', description: 'Role-based access control' },

      // Billing features
      'billing.subscriptions': { type: 'boolean', description: 'Subscription billing' },
      'billing.invoicing': { type: 'boolean', description: 'Invoice generation' },
      'billing.analytics': { type: 'boolean', description: 'Billing analytics' },

      // Admin features
      'admin.dashboard': { type: 'boolean', description: 'Admin dashboard' },
      'admin.userManagement': { type: 'boolean', description: 'User management' },
      'admin.analytics': { type: 'boolean', description: 'Analytics dashboard' }
    }
  },

  /**
   * Template customization options schema
   */
  customization: {
    type: 'object',
    properties: {
      theme: {
        type: 'object',
        properties: {
          primaryColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
          secondaryColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
          fontFamily: { type: 'string' },
          borderRadius: { type: 'string' }
        }
      },
      branding: {
        type: 'object',
        properties: {
          logo: { type: 'string', description: 'Path to logo file' },
          favicon: { type: 'string', description: 'Path to favicon file' },
          siteName: { type: 'string' },
          tagline: { type: 'string' }
        }
      },
      layout: {
        type: 'object',
        properties: {
          navigation: {
            type: 'string',
            enum: ['horizontal', 'vertical', 'sidebar'],
            default: 'horizontal'
          },
          footer: { type: 'boolean', default: true },
          breadcrumbs: { type: 'boolean', default: false }
        }
      }
    }
  }
};

/**
 * Validation functions
 */
const validators = {
  /**
   * Validate template configuration
   */
  validateTemplate(template) {
    const errors = [];
    
    if (!template.name || typeof template.name !== 'string') {
      errors.push('Template name is required and must be a string');
    }
    
    if (!template.description || typeof template.description !== 'string') {
      errors.push('Template description is required and must be a string');
    }
    
    if (!['minimal', 'standard', 'production'].includes(template.preset)) {
      errors.push('Template preset must be one of: minimal, standard, production');
    }
    
    if (!Array.isArray(template.features)) {
      errors.push('Template features must be an array');
    }
    
    return errors;
  },

  /**
   * Validate project metadata
   */
  validateProjectMetadata(metadata) {
    const errors = [];
    
    if (!metadata.projectName || typeof metadata.projectName !== 'string') {
      errors.push('Project name is required and must be a string');
    } else if (!/^[a-z0-9-_]+$/.test(metadata.projectName)) {
      errors.push('Project name must contain only lowercase letters, numbers, hyphens, and underscores');
    }
    
    if (metadata.version && !/^\d+\.\d+\.\d+$/.test(metadata.version)) {
      errors.push('Version must be in semantic version format (x.y.z)');
    }
    
    return errors;
  },

  /**
   * Validate feature configuration
   */
  validateFeatures(features) {
    const errors = [];
    const validFeatures = Object.keys(templateSchemas.features.properties);
    
    if (Array.isArray(features)) {
      features.forEach(feature => {
        if (!validFeatures.includes(feature)) {
          errors.push(`Unknown feature: ${feature}`);
        }
      });
    } else {
      errors.push('Features must be an array of feature names');
    }
    
    return errors;
  }
};

/**
 * Feature presets with predefined feature combinations
 */
const featurePresets = {
  minimal: [
    'core.express',
    'core.staticFiles',
    'core.basicRouting',
    'ui.bootstrap',
    'development.sassCompilation',
    'testing.jest',
    'build.staticGeneration'
  ],
  
  standard: [
    'core.express',
    'core.ejs',
    'core.staticFiles',
    'core.basicRouting',
    'ui.bootstrap',
    'ui.icons',
    'ui.responsive',
    'ui.components',
    'development.hotReload',
    'development.sassCompilation',
    'development.linting',
    'testing.jest',
    'testing.coverage',
    'security.helmet',
    'security.compression',
    'build.staticGeneration',
    'build.assetOptimization',
    'devops.healthChecks',
    'advanced.pwa',
    'advanced.serviceWorker'
  ],
  
  production: [
    'core.express',
    'core.ejs',
    'core.staticFiles',
    'core.basicRouting',
    'ui.bootstrap',
    'ui.icons',
    'ui.darkMode',
    'ui.responsive',
    'ui.components',
    'development.hotReload',
    'development.sassCompilation',
    'development.linting',
    'development.formatting',
    'testing.jest',
    'testing.coverage',
    'testing.apiTests',
    'security.helmet',
    'security.rateLimiting',
    'security.compression',
    'security.csp',
    'security.inputValidation',
    'build.staticGeneration',
    'build.assetOptimization',
    'build.githubPages',
    'devops.docker',
    'devops.ci',
    'devops.healthChecks',
    'devops.monitoring',
    'advanced.pwa',
    'advanced.serviceWorker',
    'advanced.api',
    'advanced.caching'
  ]
};

module.exports = {
  templateSchemas,
  validators,
  featurePresets
};