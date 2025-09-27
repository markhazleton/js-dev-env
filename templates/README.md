# Template Generation System

The template generation system allows you to create customized starter templates for different project types and requirements.

## Available Templates

### 1. Minimal Starter

- **Description**: Essential features only - perfect for simple projects
- **Preset**: Minimal
- **Features**: 7 core features
- **Best for**: Simple websites, prototypes, learning projects

### 2. Blog Template

- **Description**: Content management focused with markdown support
- **Preset**: Standard + Content features
- **Features**: Standard features + markdown processing, RSS feeds
- **Best for**: Personal blogs, content sites, documentation

### 3. E-commerce Template

- **Description**: Shopping cart and payment integration ready
- **Preset**: Production + Store features
- **Features**: Full production features + cart, payments, inventory
- **Best for**: Online stores, marketplace platforms

### 4. API-First Template

- **Description**: Backend services and API development focused
- **Preset**: Production (backend focused)
- **Features**: API documentation, validation, versioning, authentication
- **Best for**: REST APIs, microservices, backend applications

### 5. Single Page Application (SPA)

- **Description**: Client-side focused with modern JavaScript
- **Preset**: Standard + SPA features
- **Features**: Client routing, state management, module bundling
- **Best for**: Interactive web applications, dashboards

### 6. Multi-tenant SaaS

- **Description**: Enterprise SaaS application foundation
- **Preset**: Production + SaaS features
- **Features**: Multi-tenancy, authentication, billing, admin dashboard
- **Best for**: SaaS platforms, enterprise applications

## Usage

### Command Line Interface

#### List Available Templates

```bash
npm run templates:list
```

#### Get Template Information

```bash
npm run templates:info <template-name>
# Example: npm run templates:info blog
```

#### Generate Template (Quick)

```bash
npm run templates:generate <template-name> <output-directory>
# Example: npm run templates:generate blog my-blog-site
```

#### Interactive Wizard

```bash
npm run templates:wizard
```

The wizard provides an interactive experience for:

- Template selection with descriptions
- Project configuration
- Custom output directory
- Step-by-step guidance

#### Advanced Customization Wizard

```bash
npm run templates:customize
```

The customization wizard offers:

- Custom feature selection
- Theme customization (colors, fonts)
- Branding configuration (logo, site name)
- Layout options
- Advanced configuration

### Programmatic Usage

```javascript
const TemplateGenerator = require('./templates/template-generator');

const generator = new TemplateGenerator();

// List available templates
const templates = generator.getAvailableTemplates();
console.log(templates);

// Generate a template
const result = await generator.generateTemplate('blog', './my-blog', {
  projectName: 'my-blog',
  author: 'John Doe',
  description: 'My awesome blog',
  license: 'MIT'
});

console.log('Generated:', result);
```

## Template Structure

Each generated template includes:

### Core Files

- `package.json` - Customized with template-specific dependencies
- `index.js` - Main Express.js application
- `README.md` - Template-specific documentation
- `config/features.js` - Feature configuration for the template
- `template.config.js` - Template metadata and generation info

### Directory Structure

```
generated-project/
├── config/          # Configuration files
├── data/           # JSON data files  
├── public/         # Static assets
├── scss/           # SASS source files
├── utils/          # Utility functions
├── views/          # EJS templates
├── tests/          # Test files
└── index.js        # Main application
```

### Template-Specific Additions

#### Blog Template

- `content/` - Markdown content directory
- `tools/content/` - Content management scripts
- Sample blog post with front matter

#### E-commerce Template

- `store/` - Store-specific modules
- `tools/store/` - Store management scripts
- Shopping cart and payment integration

#### API Template

- Swagger/OpenAPI documentation
- Request validation schemas
- API versioning structure

#### SPA Template

- `src/` - Client-side source code
- `webpack.config.js` - Module bundling configuration
- Client-side routing setup

#### SaaS Template

- `tenant/` - Multi-tenant functionality
- `auth/` - Authentication system
- `billing/` - Subscription billing
- Admin dashboard components

## Feature System

Templates use a feature flag system that allows selective enabling/disabling of functionality:

### Feature Categories

- **Core**: Express.js, routing, static files
- **UI/UX**: Bootstrap, icons, dark mode, responsive design
- **Development**: Hot reload, SASS compilation, linting
- **Testing**: Jest, coverage, API tests
- **Security**: Helmet, rate limiting, CSP, input validation
- **Build**: Static generation, asset optimization, GitHub Pages
- **DevOps**: Docker, CI/CD, health checks, monitoring
- **Advanced**: PWA, service worker, database, API, caching

### Feature Presets

- **Minimal**: 7 essential features
- **Standard**: 21 balanced features
- **Production**: 33 comprehensive features

## Customization Options

### Theme Customization

```javascript
theme: {
  primaryColor: '#007bff',
  secondaryColor: '#6c757d', 
  fontFamily: '"Inter", sans-serif',
  borderRadius: '8px'
}
```

### Branding Configuration

```javascript
branding: {
  siteName: 'My Awesome Site',
  tagline: 'Building the future',
  logo: 'logo.svg',
  favicon: 'favicon.ico'
}
```

### Layout Options

```javascript
layout: {
  navigation: 'horizontal', // horizontal, vertical, sidebar
  footer: true,
  breadcrumbs: false
}
```

## Examples

### Generate a Blog Template

```bash
# Using the wizard (recommended)
npm run templates:wizard

# Direct generation
npm run templates:generate blog my-blog-site
cd my-blog-site
npm install
npm run dev
```

### Create a Custom E-commerce Site

```bash
# Use customization wizard for full control
npm run templates:customize

# Follow the prompts to:
# 1. Select e-commerce template
# 2. Configure branding
# 3. Customize theme colors
# 4. Set up payment options
```

### API-First Backend

```bash
npm run templates:generate api my-api-server
cd my-api-server
npm install

# API will be available with:
# - Swagger documentation at /api-docs
# - Health check at /health
# - Request validation
# - Rate limiting
```

## Development

### Adding New Templates

1. **Define Template Configuration**

```javascript
// In template-generator.js
newTemplate: {
  name: 'My Custom Template',
  description: 'Template for specific use case',
  preset: 'standard',
  features: [...requiredFeatures],
  packageJsonOverrides: {
    dependencies: { /* additional deps */ }
  }
}
```

2. **Update Feature Lists**

```javascript
// In template-schema.js - add new features
'myFeature.newCapability': { 
  type: 'boolean', 
  description: 'New capability description' 
}
```

3. **Add Template-Specific Files**

- Create template-specific directory structures
- Add sample content and configuration
- Update generation logic

### Testing Templates

```bash
# Generate template for testing
npm run templates:generate minimal test-minimal

# Verify generated template
cd test-minimal
npm install
npm test
npm run build
npm start
```

## Best Practices

### Template Design

- Keep templates focused on specific use cases
- Include comprehensive documentation
- Provide working examples and sample content
- Follow established project structure patterns

### Feature Selection

- Start with minimal features and add as needed
- Consider the target audience and skill level
- Balance functionality with simplicity
- Test feature combinations thoroughly

### Customization

- Use the customization wizard for complex projects
- Apply consistent branding across all components
- Test theme customizations across different screen sizes
- Validate color contrast for accessibility

## Troubleshooting

### Common Issues

1. **Template Generation Fails**
   - Check output directory permissions
   - Verify template name is valid
   - Ensure sufficient disk space

2. **Missing Features**
   - Check feature configuration in generated template
   - Verify all required dependencies are installed
   - Review template-specific documentation

3. **Customization Not Applied**
   - Verify theme files exist (scss/_variables.scss)
   - Check branding configuration in data files
   - Rebuild CSS after theme changes

### Getting Help

- Use `npm run templates:info <template>` for detailed template information
- Check generated `README.md` for template-specific guidance
- Review `template.config.js` for generation metadata
- Refer to feature documentation in `config/features.js`

---

The template generation system provides a powerful foundation for creating customized starter projects with the exact features and configuration needed for your specific use case.
