# Bootstrap 5 + Express.js Starter Kit

A modern, feature-rich starter kit for building responsive web applications with Bootstrap 5, Express.js, EJS templates, and seamless GitHub Pages deployment.

🌐 **Live Demo**: [https://markhazleton.github.io/js-dev-env/](https://markhazleton.github.io/js-dev-env/)

## ✨ Features

### Core Technologies

- 🚀 **Express.js Backend** - Fast, unopinionated web framework for Node.js
- 📝 **EJS Templates** - Simple templating language with dynamic content support
- 🎨 **Bootstrap 5** - Modern, responsive front-end framework with utility classes
- 💅 **SASS/SCSS** - Advanced CSS preprocessing with modular architecture
- 🖌️ **Bootstrap Icons** - Over 1,800 high-quality scalable vector icons

### Development Experience

- 🔄 **Live Reload** - Automatic browser refresh on code changes
- 🛠️ **Hot Reloading** - SASS compilation with watch mode
- 📁 **Modular Architecture** - Clean separation of concerns and reusable components
- 🧪 **Testing Suite** - Jest integration for unit and integration tests
- 📊 **Code Coverage** - Built-in coverage reports with lcov

### User Experience

- 📱 **Mobile-First Design** - Responsive layouts that work on all devices
- � **Dark Mode Support** - Persistent theme switching with system preference detection
- ⚡ **Performance Optimized** - Compression, caching, and optimized asset delivery
- 🔍 **SEO Ready** - Structured data, meta tags, and search engine optimization
- 📱 **PWA Support** - Progressive Web App with offline functionality and installation

### Content Management

- 🎛️ **JSON-Based CMS** - Simple content management through `pages.json`
- 🧩 **Dynamic Routing** - Automatic route generation for pages
- 📄 **Template System** - Flexible EJS templates with partials and layouts
- 🎨 **Component Library** - Comprehensive Bootstrap 5 component showcase

### Security & Deployment

- 🔒 **Enhanced Security** - Helmet.js integration with security headers
- 🌐 **GitHub Pages Ready** - Complete static site generation for deployment
- 🚀 **CI/CD Pipeline** - Automated deployment with GitHub Actions
- � **Docker Support** - Containerization for consistent development environments

## 📖 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🏗️ Project Structure](#️-project-structure)
- [🌐 GitHub Pages Deployment](#-github-pages-deployment)
- [🔧 Configuration](#-configuration)
- [📄 Content Management](#-content-management)
- [🎨 Customization](#-customization)
- [� Deployment Options](#-deployment-options)
- [📚 API Reference](#-api-reference)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)

## 🌐 GitHub Pages Deployment

This project includes a sophisticated build system that converts the dynamic Express.js application into a static site compatible with GitHub Pages.

### 🔄 Build Process Overview

The build system solves the fundamental challenge of deploying dynamic Node.js applications to GitHub Pages (which only serves static files) by:

1. **Static Site Generation**: Converting EJS templates to HTML files
2. **Path Resolution**: Converting absolute paths to relative paths for subdirectory hosting
3. **Asset Optimization**: Compiling SASS, copying icons, and optimizing resources
4. **Clean Deployment**: Automated cleanup and deployment process

### 🛠️ Build Scripts

```json
{
  "scripts": {
    "clean": "node scripts/clean-docs.js",
    "copy-icons-docs": "node scripts/copy-icons.js --target=docs",
    "copy-static-assets": "node scripts/copy-static-assets.js",
    "generate-static-site": "node scripts/generate-static-site.js",
    "build-css": "sass --load-path=node_modules scss/main.scss docs/css/styles.css",
    "prebuild": "npm run clean",
    "build": "npm-run-all copy-icons-docs copy-static-assets build-css generate-static-site"
  }
}
```

### 📂 Build Script Functionality

#### `scripts/clean-docs.js`

- Cleans the `/docs` directory before each build
- Preserves the `.nojekyll` file (required for GitHub Pages)
- Removes old HTML, CSS, JS, and asset files

#### `scripts/copy-icons.js`

- Copies Bootstrap Icons from node_modules to the output directory
- Supports both development (`public/fonts`) and production (`docs/fonts`) targets
- Maintains proper directory structure for icon assets

#### `scripts/copy-static-assets.js`

- Copies JavaScript files, manifest.json, and service worker to `/docs`
- Skips CSS and fonts (handled by other scripts)
- Maintains proper file structure for static assets

#### `scripts/generate-static-site.js`

- **Core functionality**: Converts dynamic EJS templates to static HTML
- **Path conversion**: Transforms absolute paths to relative paths
- **Route generation**: Creates HTML files for each page in `pages.json`
- **Navigation handling**: Updates navigation links based on page depth

### 🔧 Path Conversion System

The most critical feature is the path conversion system that makes GitHub Pages subdirectory hosting work:

```javascript
// Before (absolute paths - breaks on GitHub Pages):
<link href="/css/styles.css" rel="stylesheet" />
<a href="/community">Community</a>

// After (relative paths - works on GitHub Pages):
<link href="../css/styles.css" rel="stylesheet" />
<a href="../community/index.html">Community</a>
```

The conversion logic:

- **Root pages** (`/`): Use `./` prefix for same-level resources
- **Nested pages** (`/community/`): Use `../` prefix to navigate up one level
- **Navigation links**: Convert to `index.html` format for static hosting

### 🚀 Automated Deployment

#### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: Build for GitHub Pages
        run: npm run build

      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
          force_orphan: true
```

#### Deployment Process

1. **Trigger**: Push to `main` branch
2. **Build**: Generate static site in `/docs` directory
3. **Deploy**: Publish to `gh-pages` branch
4. **Live**: Site available at `https://username.github.io/repository-name`

### ⚙️ GitHub Pages Configuration

To enable GitHub Pages for your repository:

1. **Repository Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main`
4. **Folder**: `/docs`
5. **Save** and wait for deployment

### 🔍 Troubleshooting GitHub Pages

#### Common Issues

**404 Errors for Assets**

- **Problem**: CSS, JS, or images not loading
- **Solution**: Build process automatically converts absolute to relative paths
- **Check**: Generated HTML should use `./css/styles.css` not `/css/styles.css`

**Page Not Found**

- **Problem**: Individual pages return 404
- **Solution**: Ensure `npm run build` generates all page directories
- **Check**: Verify `docs/page-name/index.html` exists

**Build Failures**

- **Problem**: GitHub Actions build fails
- **Solution**: Check Actions tab for detailed error logs
- **Common fixes**: Verify Node.js version, check package.json dependencies

#### Verification Steps

```bash
# Local build test
npm run build

# Check generated structure
ls -la docs/
ls -la docs/*/

# Verify relative paths in HTML
grep -r "href=" docs/
grep -r "src=" docs/
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or newer) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

### Installation

```bash
# Clone the repository
git clone https://github.com/markhazleton/js-dev-env.git
cd js-dev-env

# Install dependencies
npm install

# Start the development server (includes live reload and SASS compilation)
npm run start:dev

# Open your browser and navigate to http://localhost:3000
```

### Development Commands

```bash
# Development with live reload and SASS watching
npm run start:dev

# Build for production (GitHub Pages)
npm run build

# Run tests
npm test

# Check code coverage
npm run test:coverage

# Lint code
npm run lint
```

## 🏗️ Project Structure

```text
js-dev-env/
├── 📁 .github/                    # GitHub-specific configurations
│   └── workflows/
│       └── deploy.yml             # GitHub Actions deployment workflow
├── 📁 coverage/                   # Test coverage reports (generated)
├── 📁 data/                       # Content management
│   └── pages.json                 # Page definitions and content
├── 📁 docs/                       # Built static site for GitHub Pages (generated)
├── 📁 logs/                       # Application logs (development)
├── 📁 mobile/                     # Mobile app configuration
│   └── package.json               # Mobile-specific dependencies
├── 📁 public/                     # Static assets (development server)
│   ├── css/                       # Compiled CSS (generated)
│   ├── fonts/                     # Font files and Bootstrap Icons
│   ├── js/                        # Client-side JavaScript
│   │   ├── component-library.js   # Component showcase functionality
│   │   ├── form-validation.js     # Form validation utilities
│   │   ├── script.js              # Main application JavaScript
│   │   └── theme-toggle.js        # Dark mode toggle functionality
│   ├── manifest.json              # PWA manifest
│   └── service-worker.js          # Service worker for offline support
├── 📁 scripts/                    # Build and utility scripts
│   ├── clean-docs.js              # Cleans docs directory before build
│   ├── copy-icons.js              # Copies Bootstrap Icons to output
│   ├── copy-static-assets.js      # Copies static files to docs
│   └── generate-static-site.js    # Main static site generation script
├── 📁 scss/                       # SASS source files
│   ├── _components-pages.scss     # Component-specific styles
│   ├── _custom.scss               # Custom styles and utilities
│   ├── _variables.scss            # Bootstrap variable overrides
│   └── main.scss                  # Main SASS entry point
├── 📁 tests/                      # Test suite
│   └── app.test.js                # Application tests
├── 📁 utils/                      # Utility functions
│   ├── cache.js                   # Simple caching system
│   ├── config.js                  # Configuration management
│   ├── database.js                # Database abstraction layer
│   ├── enhanced-database.js       # Enhanced database features
│   ├── logger.js                  # Logging utilities
│   ├── performance.js             # Performance monitoring
│   ├── security.js                # Security utilities
│   ├── test-helpers.js            # Testing utilities
│   └── validation.js              # Input validation
├── 📁 views/                      # EJS template files
│   ├── partials/                  # Reusable template components
│   │   ├── page-footer.ejs        # Footer component
│   │   └── page-header.ejs        # Header component with navigation
│   ├── components.ejs             # Component library showcase
│   ├── error-404.ejs              # Custom 404 error page
│   ├── layout.ejs                 # Main layout template
│   └── page.ejs                   # Generic page template
├── .env                           # Environment configuration (create this)
├── .gitignore                     # Git ignore rules
├── BUILD_PROCESS.md               # Detailed build process documentation
├── eslint.config.mjs              # ESLint configuration
├── index.js                       # Main Express.js server
├── index.test.js                  # Main application tests
├── package.json                   # Project dependencies and scripts
└── README.md                      # This file
```

### Key Directories Explained

#### `/data/` - Content Management

- **`pages.json`**: Central content management file containing all page definitions, routes, and content. Each entry automatically generates a route and page.

#### `/docs/` - Production Build Output

- Generated by `npm run build`
- Contains static HTML, CSS, JS, and assets for GitHub Pages
- Automatically deployed via GitHub Actions

#### `/scripts/` - Build System

- **`clean-docs.js`**: Removes old build files while preserving `.nojekyll`
- **`copy-icons.js`**: Handles Bootstrap Icons deployment
- **`copy-static-assets.js`**: Copies JS, manifest, and other static files
- **`generate-static-site.js`**: Core static site generation with path conversion

#### `/scss/` - Styling Architecture

- **`main.scss`**: Entry point that imports Bootstrap and custom styles
- **`_variables.scss`**: Bootstrap customization and theme variables
- **`_custom.scss`**: Custom utility classes and components
- **`_components-pages.scss`**: Page-specific styling

#### `/views/` - Template System

- **`layout.ejs`**: Base template with navigation, head, and footer
- **`page.ejs`**: Generic content page template
- **`components.ejs`**: Component library showcase
- **`partials/`**: Reusable template components

#### `/utils/` - Application Logic

- Modular utility functions for caching, logging, validation, and more
- Database abstraction layer for future expansion
- Security and performance monitoring utilities

### Route Generation System

The application automatically generates routes based on `data/pages.json`:

```javascript
// Each page entry creates:
{
  "title": "Page Title",           // Used in <title> and navigation
  "url": "/page-url",             // Route path
  "template": "page",             // EJS template to use
  "content": {                    // Content passed to template
    "heading": "Page Heading",
    "text": "Description",
    "body": "HTML content"
  }
}

// Results in:
// - Route: GET /page-url
// - File: docs/page-url/index.html (when built)
// - Navigation: Automatic inclusion in header menu
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Application Settings
SITE_NAME=My Bootstrap Website
SITE_DESCRIPTION=A modern web application built with Bootstrap 5 and Express.js

# Performance Settings
ENABLE_CACHE=false
CACHE_DURATION=3600000

# Security Settings (optional)
SESSION_SECRET=your-secret-key-here
HELMET_ENABLED=true

# Development Settings
LIVERELOAD_PORT=35729
```

### Package.json Scripts

```json
{
  "scripts": {
    // Development
    "start": "node index.js",
    "dev": "nodemon index.js",
    "start:dev": "npm-run-all --parallel dev watch-css copy-icons",
    
    // Building
    "build": "npm-run-all copy-icons-docs copy-static-assets build-css generate-static-site",
    "prebuild": "npm run clean",
    "clean": "node scripts/clean-docs.js",
    
    // Asset Management
    "build-css": "sass --load-path=node_modules scss/main.scss docs/css/styles.css",
    "watch-css": "sass --load-path=node_modules --watch scss/main.scss:public/css/styles.css",
    "copy-icons": "node scripts/copy-icons.js",
    "copy-icons-docs": "node scripts/copy-icons.js --target=docs",
    "copy-static-assets": "node scripts/copy-static-assets.js",
    "generate-static-site": "node scripts/generate-static-site.js",
    
    // Testing and Quality
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## 📄 Content Management

### Adding New Pages

Pages are managed through the `data/pages.json` file. Each entry automatically generates:

- A route in Express.js
- A static HTML file when built
- Navigation menu item

#### Basic Page Structure

```json
{
  "title": "New Page",
  "url": "/new-page",
  "template": "page",
  "content": {
    "heading": "<i class=\"bi bi-star\"></i> New Page Title",
    "text": "Brief description of the page",
    "body": "<div class=\"container\">Your HTML content here</div>"
  }
}
```

#### Advanced Page with Custom Template

```json
{
  "title": "Custom Page",
  "url": "/custom",
  "template": "custom-template",
  "content": {
    "heading": "Custom Page",
    "text": "Page with custom template",
    "body": "Content here",
    "useCustomTemplate": true,
    "customData": {
      "specialFeature": true,
      "additionalInfo": "Custom data for template"
    }
  }
}
```

### Content Guidelines

#### HTML Content

- Use Bootstrap 5 classes for styling
- Include Bootstrap Icons with `<i class="bi bi-icon-name"></i>`
- Use semantic HTML structure
- Ensure responsive design with Bootstrap grid system

#### Page Metadata

- **title**: Used in `<title>` tag and navigation
- **url**: Route path (must start with `/`)
- **template**: EJS template file (without `.ejs` extension)
- **content**: Object passed to the template

#### Bootstrap 5 Components

The content can include any Bootstrap 5 components:

```html
<!-- Cards -->
<div class="card">
  <div class="card-body">
    <h5 class="card-title">Card Title</h5>
    <p class="card-text">Card content</p>
  </div>
</div>

<!-- Alerts -->
<div class="alert alert-success" role="alert">
  <i class="bi bi-check-circle me-2"></i>Success message
</div>

<!-- Buttons -->
<button type="button" class="btn btn-primary">
  <i class="bi bi-download me-2"></i>Download
</button>
```

## 🎨 Customization

### SASS/SCSS Customization

#### Bootstrap Variable Overrides (`scss/_variables.scss`)

```scss
// Color System
$primary: #007bff;
$secondary: #6c757d;
$success: #28a745;
$danger: #dc3545;
$warning: #ffc107;
$info: #17a2b8;

// Typography
$font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;

// Spacing
$spacer: 1rem;
$border-radius: 0.375rem;

// Component Customization
$navbar-padding-y: 1rem;
$card-border-radius: 0.5rem;
$btn-border-radius: 0.375rem;

// Custom Theme Colors
$theme-colors: (
  "primary": $primary,
  "secondary": $secondary,
  "success": $success,
  "info": $info,
  "warning": $warning,
  "danger": $danger,
  "light": #f8f9fa,
  "dark": #212529,
  "custom": #6f42c1  // Custom color
);
```

#### Custom Styles (`scss/_custom.scss`)

```scss
// Custom utility classes
.text-gradient {
  background: linear-gradient(45deg, $primary, $secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.shadow-custom {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

// Dark mode enhancements
[data-bs-theme="dark"] {
  .card {
    background-color: #2d3748;
    border-color: #4a5568;
  }
  
  .navbar {
    background-color: #1a202c !important;
  }
}

// Component customizations
.btn-custom {
  background: linear-gradient(45deg, $primary, lighten($primary, 10%));
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
}
```

### JavaScript Customization

#### Theme Toggle Enhancement (`public/js/theme-toggle.js`)

```javascript
// Enhanced theme management with animations
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'auto';
    this.initializeTheme();
    this.setupToggle();
  }

  initializeTheme() {
    if (this.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    } else {
      this.setTheme(this.theme);
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Add smooth transition
    document.documentElement.style.transition = 'color 0.3s ease, background-color 0.3s ease';
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  }

  toggle() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();
```

### Custom Components

#### Creating Reusable Components (`views/partials/custom-component.ejs`)

```html
<!-- Custom card component -->
<div class="card shadow-custom mb-4">
  <div class="card-header bg-primary text-white">
    <h5 class="card-title mb-0">
      <i class="bi bi-<%= icon %>"></i> <%= title %>
    </h5>
  </div>
  <div class="card-body">
    <p class="card-text"><%= description %></p>
    <% if (buttons && buttons.length > 0) { %>
      <div class="d-flex gap-2">
        <% buttons.forEach(button => { %>
          <a href="<%= button.url %>" class="btn btn-<%= button.variant %>">
            <% if (button.icon) { %>
              <i class="bi bi-<%= button.icon %> me-2"></i>
            <% } %>
            <%= button.text %>
          </a>
        <% }); %>
      </div>
    <% } %>
  </div>
</div>
```

## 🚀 Deployment Options

### 1. GitHub Pages (Recommended)

**Automatic Deployment:**

```bash
# Push to main branch triggers automatic deployment
git add .
git commit -m "Update content"
git push origin main
```

**Manual Deployment:**

```bash
npm run build
git add docs/
git commit -m "Build for GitHub Pages"
git push origin main
```

### 2. Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure vercel.json
{
  "builds": [
    { "src": "index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.js" }
  ]
}
```

### 3. Netlify

```bash
# Build command
npm run build

# Publish directory
docs

# Environment variables (in Netlify dashboard)
NODE_ENV=production
PORT=3000
```

### 4. Heroku

```bash
# Install Heroku CLI and create app
heroku create your-app-name

# Create Procfile
echo "web: node index.js" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 5. Docker Deployment

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
```

```bash
# Build and run
docker-compose up --build
```

## 📚 API Reference

### Available Endpoints

#### Core Routes

```javascript
// Page routes (auto-generated from pages.json)
GET /                    // Home page
GET /community          // Community page
GET /github-pages       // GitHub Pages guide
GET /getting-started    // Getting started guide
GET /components         // Component library

// API routes
GET /api/info          // Site information
GET /api/pages         // List all pages
GET /api/health        // Health check

// Static assets
GET /css/*             // Compiled CSS files
GET /js/*              // JavaScript files
GET /fonts/*           // Font files and icons
```

#### API Examples

```javascript
// Get site information
fetch('/api/info')
  .then(response => response.json())
  .then(data => console.log(data));

// Response:
{
  "name": "JS-Dev Starter",
  "version": "1.0.0",
  "description": "Bootstrap 5 + Express.js Starter Kit",
  "pages": 5,
  "features": ["PWA", "Dark Mode", "GitHub Pages"]
}

// Get all pages
fetch('/api/pages')
  .then(response => response.json())
  .then(pages => console.log(pages));

// Response: Array of page objects
[
  {
    "title": "Home",
    "url": "/",
    "template": "page"
  },
  // ... more pages
]
```

### Adding Custom API Endpoints

```javascript
// In index.js
apiRouter.get('/custom-endpoint', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Custom endpoint response',
      timestamp: new Date().toISOString()
    }
  });
});

// With error handling
apiRouter.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    // Your logic here
    res.json({ user: userData });
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});
```

## 🧪 Testing

### Test Structure

```text
tests/
├── app.test.js              # Main application tests
├── utils/
│   ├── cache.test.js        # Cache utility tests
│   ├── validation.test.js   # Validation tests
│   └── database.test.js     # Database tests
└── integration/
    ├── pages.test.js        # Page route tests
    └── api.test.js          # API endpoint tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- app.test.js

# Run tests matching pattern
npm test -- --testNamePattern="API"
```

### Example Tests

```javascript
// tests/app.test.js
const request = require('supertest');
const app = require('../index');

describe('Express App', () => {
  test('GET / should return home page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Bootstrap 5 + Express.js Starter Kit');
  });

  test('GET /api/info should return site information', async () => {
    const response = await request(app).get('/api/info');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('version');
  });
});

// tests/utils/validation.test.js
const { validateEmail, validateRequired } = require('../../utils/validation');

describe('Validation Utils', () => {
  test('validateEmail should validate email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });

  test('validateRequired should check required fields', () => {
    expect(validateRequired('value')).toBe(true);
    expect(validateRequired('')).toBe(false);
    expect(validateRequired(null)).toBe(false);
  });
});
```

### Test Configuration (jest.config.js)

```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/docs/**',
    '!jest.config.js'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ]
};
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/js-dev-env.git
cd js-dev-env

# Add upstream remote
git remote add upstream https://github.com/markhazleton/js-dev-env.git

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature-name

# Start development server
npm run start:dev
```

### Code Guidelines

#### JavaScript Style

- Use ES6+ features
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions

```javascript
/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

#### SCSS Style

- Use BEM methodology for custom classes
- Leverage Bootstrap variables and mixins
- Organize code in logical partials
- Use meaningful variable names

```scss
// Good
.component-name {
  &__element {
    color: $primary;
    
    &--modifier {
      font-weight: bold;
    }
  }
}

// Avoid
.my-class {
  color: #007bff; // Use variables instead
}
```

### Commit Guidelines

Use conventional commits:

```bash
feat: add new component showcase page
fix: resolve navigation issue on mobile devices  
docs: update README with deployment instructions
style: improve dark mode contrast ratios
test: add validation utility tests
refactor: optimize build script performance
```

### Pull Request Process

1. **Update Documentation**: Ensure README and other docs are updated
2. **Add Tests**: Include tests for new features
3. **Run Tests**: Ensure all tests pass (`npm test`)
4. **Build Check**: Verify build works (`npm run build`)
5. **Lint Code**: Fix any linting issues (`npm run lint:fix`)

### Reporting Issues

When reporting issues, include:

- **Environment**: OS, Node.js version, npm version
- **Steps to Reproduce**: Clear steps to recreate the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable

### Feature Requests

For new features, please:

1. Check existing issues and discussions
2. Create a detailed issue with use cases
3. Consider backward compatibility
4. Provide mockups or examples if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Bootstrap](https://getbootstrap.com/) for the amazing CSS framework
- [Express.js](https://expressjs.com/) for the web framework
- [EJS](https://ejs.co/) for templating
- [Bootstrap Icons](https://icons.getbootstrap.com/) for the icon library
- [GitHub Pages](https://pages.github.com/) for free hosting
- [GitHub Actions](https://github.com/features/actions) for CI/CD

## 📞 Support

- **Documentation**: Check this README and `BUILD_PROCESS.md`
- **Issues**: [GitHub Issues](https://github.com/markhazleton/js-dev-env/issues)
- **Discussions**: [GitHub Discussions](https://github.com/markhazleton/js-dev-env/discussions)
- **Live Demo**: [https://markhazleton.github.io/js-dev-env/](https://markhazleton.github.io/js-dev-env/)

---

**Built with ❤️ using Bootstrap 5, Express.js, and modern web technologies.**
