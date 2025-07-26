# 🚀 Bootstrap 5 + Express.js Starter Kit

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/markhazleton/js-dev-env?style=for-the-badge&logo=github)](https://github.com/markhazleton/js-dev-env/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/markhazleton/js-dev-env?style=for-the-badge&logo=github)](https://github.com/markhazleton/js-dev-env/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/markhazleton/js-dev-env?style=for-the-badge&logo=github)](https://github.com/markhazleton/js-dev-env/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.7-purple?style=for-the-badge&logo=bootstrap)](https://getbootstrap.com/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue?style=for-the-badge&logo=express)](https://expressjs.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?style=for-the-badge&logo=github)](https://markhazleton.github.io/js-dev-env/)

**A production-ready, feature-rich starter kit for building modern, responsive web applications**

🌐 **[Live Demo](https://markhazleton.github.io/js-dev-env/)** | 📚 **[Documentation](https://github.com/markhazleton/js-dev-env/wiki)** | 🚀 **[Quick Start](#-quick-start)**

![Hero Image](https://raw.githubusercontent.com/markhazleton/js-dev-env/main/docs/images/hero-banner.svg)

</div>

## 📖 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Project Structure](#️-project-structure)
- [🎯 Use Cases](#-use-cases)
- [🛠️ Development](#️-development)
- [🎨 Component Library](#-component-library)
- [🌐 Deployment](#-deployment)
- [📄 Content Management](#-content-management)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🔥 Core Technologies

<div align="center">

| Technology | Purpose | Version |
|------------|---------|---------|
| ![Express.js](https://img.shields.io/badge/Express.js-5.1.0-blue?logo=express) | Backend Framework | Latest |
| ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.7-purple?logo=bootstrap) | CSS Framework | Latest |
| ![EJS](https://img.shields.io/badge/EJS-3.1.10-red?logo=javascript) | Template Engine | Latest |
| ![SASS](https://img.shields.io/badge/SASS-1.89.2-pink?logo=sass) | CSS Preprocessor | Latest |
| ![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js) | Runtime Environment | 18+ |

</div>

### 🌟 Key Features

#### 🎨 **Modern UI/UX**

- **Bootstrap 5.3.7** with latest components and utilities
- **2,000+ Bootstrap Icons** for comprehensive iconography
- **Dark/Light Mode Toggle** with system preference detection
- **Responsive Design** optimized for all device sizes
- **Advanced Component Library** with interactive examples

#### ⚡ **Developer Experience**

- **Hot Reload Development** with automatic browser refresh
- **SASS Watch Mode** for real-time style compilation
- **ESLint + Prettier** for consistent code formatting
- **Jest Testing Suite** with coverage reports
- **Docker Support** for containerized development

#### 🛡️ **Security & Performance**

- **Helmet.js Integration** for security headers
- **Rate Limiting** to prevent abuse
- **Compression Middleware** for optimized delivery
- **Content Security Policy** implementation
- **Input Validation** with sanitization

#### 📱 **Progressive Web App**

- **Service Worker** for offline functionality
- **Web App Manifest** for installable experience
- **Responsive Images** with optimized loading
- **Performance Metrics** tracking

#### 🚀 **Deployment Ready**

- **GitHub Pages Integration** with automatic builds
- **CI/CD Pipeline** with GitHub Actions
- **Docker Containerization** for consistent deployment
- **Static Site Generation** for hosting flexibility
- **SEO Optimization** with structured data

## 🚀 Quick Start

### Prerequisites

| Requirement | Minimum Version | Recommended |
|-------------|----------------|-------------|
| Node.js | 18.0.0 | Latest LTS |
| npm | 9.0.0 | Latest |
| Git | 2.28.0 | Latest |

### ⚡ One-Command Setup

```bash
# Clone and setup in one go
npx degit markhazleton/js-dev-env my-awesome-project && cd my-awesome-project && npm install && npm run start:dev
```

### 📋 Step-by-Step Installation

```bash
# 1. Clone the repository
git clone https://github.com/markhazleton/js-dev-env.git
cd js-dev-env

# 2. Install dependencies
npm install

# 3. Start development server with hot reload
npm run start:dev

# 4. Open your browser
open http://localhost:3000
```

### 🐳 Docker Quick Start

```bash
# Using Docker Compose (Recommended)
docker-compose up --build

# Or using Docker directly
docker build -t js-dev-env .
docker run -p 3000:3000 js-dev-env
```

## 🏗️ Project Structure

```
js-dev-env/
├── 📁 .github/                    # GitHub workflows and templates
│   ├── workflows/
│   │   ├── ci.yml                 # Continuous Integration
│   │   └── deploy.yml             # GitHub Pages deployment
│   └── ISSUE_TEMPLATE/            # Issue templates
├── 📁 data/                       # Content management
│   └── pages.json                 # JSON-based CMS
├── 📁 docs/                       # Built static site (auto-generated)
├── 📁 public/                     # Static assets
│   ├── css/                       # Compiled CSS
│   ├── js/                        # Client-side JavaScript
│   ├── fonts/                     # Bootstrap Icons & fonts
│   ├── images/                    # Image assets
│   ├── manifest.json              # PWA manifest
│   └── service-worker.js          # Offline functionality
├── 📁 scripts/                    # Build and utility scripts
│   ├── clean-docs.js              # Clean build directory
│   ├── copy-icons.js              # Bootstrap Icons setup
│   ├── copy-static-assets.js      # Asset management
│   ├── generate-static-site.js    # Static site generator
│   ├── security-audit.js          # Security checks
│   └── dev-helper.js              # Development utilities
├── 📁 scss/                       # SASS source files
│   ├── _variables.scss            # Bootstrap overrides
│   ├── _custom.scss               # Custom styles
│   ├── _components-pages.scss     # Component-specific styles
│   └── main.scss                  # Main stylesheet
├── 📁 tests/                      # Test suite
│   ├── app.test.js                # Application tests
│   └── setup.js                   # Test configuration
├── 📁 utils/                      # Utility modules
│   ├── cache.js                   # Caching system
│   ├── database.js                # Database abstraction
│   ├── performance.js             # Performance monitoring
│   ├── security.js                # Security utilities
│   └── json-database.js           # JSON database
├── 📁 views/                      # EJS templates
│   ├── partials/                  # Reusable components
│   ├── components.ejs             # Basic component library
│   ├── advanced-components.ejs    # Advanced components
│   ├── layout.ejs                 # Main layout
│   ├── page.ejs                   # Generic page template
│   └── error-404.ejs              # Error page
├── index.js                       # Main Express server
├── package.json                   # Dependencies and scripts
├── docker-compose.yml             # Docker configuration
├── Dockerfile                     # Container definition
├── jest.config.js                 # Test configuration
├── eslint.config.mjs              # ESLint configuration
└── README.md                      # This file
```

## 🎯 Use Cases

### 🎨 **UI/UX Prototyping**

Perfect for rapidly prototyping interfaces with Bootstrap 5 components and custom styling.

### 📖 **Documentation Sites**

Create beautiful documentation with the JSON-based CMS and automatic GitHub Pages deployment.

### 🌐 **Landing Pages**

Build conversion-optimized landing pages with SEO features and performance optimization.

### 🛍️ **E-commerce Frontends**

Develop responsive e-commerce interfaces with form validation and security features.

### 📱 **Progressive Web Apps**

Create installable web applications with offline functionality and responsive design.

### 🎓 **Learning Projects**

Ideal for developers learning modern web development practices and Bootstrap 5.

## 🛠️ Development

### 📋 Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `npm run start:dev` | **Development server** with hot reload | Primary development |
| `npm run build` | **Production build** for deployment | Before deployment |
| `npm test` | **Run test suite** with Jest | Testing |
| `npm run lint` | **Code linting** with ESLint | Code quality |
| `npm run docker:dev` | **Docker development** environment | Containerized dev |

### 🔧 Development Workflow

```bash
# Start development environment
npm run start:dev

# In another terminal, run tests in watch mode
npm run test:watch

# Check code quality
npm run lint

# Build for production
npm run build
```

### 🎨 Customization

#### **Theme Customization**

Edit `scss/_variables.scss` to customize Bootstrap variables:

```scss
// Brand Colors
$primary: #007bff;
$secondary: #6c757d;
$success: #28a745;

// Typography
$font-family-base: 'Inter', system-ui, sans-serif;
$font-size-base: 1rem;

// Spacing
$spacer: 1rem;
$border-radius: 0.375rem;
```

#### **Adding Custom Components**

1. Create component in `views/partials/`
2. Add styles in `scss/_custom.scss`
3. Include in page templates

## 🎨 Component Library

The starter kit includes two comprehensive component libraries:

### 📦 **Basic Components** (`/components`)

- **Buttons** - All variants, sizes, and states
- **Typography** - Headings, text utilities, and formatting
- **Cards** - Various card layouts and styles
- **Alerts** - All alert types with icons
- **Forms** - Complete form elements with validation
- **Modals** - Interactive modal examples
- **Tables** - Responsive table designs
- **Icons** - Bootstrap Icons showcase

### 🔥 **Advanced Components** (`/advanced-components`)

- **Accordion** - Collapsible content panels
- **Carousel** - Image/content sliders with controls
- **Offcanvas** - Sliding panel navigation
- **Tabs & Pills** - Tabbed content navigation
- **Collapse** - Show/hide content functionality
- **Dropdowns** - Context menus and actions
- **Tooltips & Popovers** - Interactive help elements
- **Progress Bars** - Animated progress indicators
- **Spinners** - Loading state animations
- **Badges** - Status and notification badges
- **Breadcrumbs** - Navigation trails
- **Pagination** - Page navigation controls

### 🖼️ **Interactive Examples**

Each component includes:

- **Live Preview** - See components in action
- **Copy-Paste Code** - Ready-to-use HTML snippets
- **Responsive Design** - Mobile-optimized layouts
- **Accessibility** - WCAG compliant implementations

## 🌐 Deployment

### 🎯 **GitHub Pages (Recommended)**

Automatic deployment with every push to main:

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
```

### ☁️ **Other Deployment Options**

<details>
<summary><strong>🔷 Vercel</strong></summary>

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

</details>

<details>
<summary><strong>🟧 Netlify</strong></summary>

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "docs"
```

</details>

<details>
<summary><strong>🟣 Heroku</strong></summary>

```bash
# Create Procfile
echo "web: node index.js" > Procfile

# Deploy
git push heroku main
```

</details>

<details>
<summary><strong>🐳 Docker</strong></summary>

```bash
# Build and run
docker-compose up --build -d
```

</details>

## 📄 Content Management

### 📝 **JSON-Based CMS**

Add new pages by editing `data/pages.json`:

```json
{
  "title": "New Page",
  "url": "/new-page",
  "template": "page",
  "content": {
    "heading": "🎉 Welcome to My New Page",
    "text": "This page was created with the JSON-based CMS",
    "body": "<div class=\"alert alert-success\">Content goes here!</div>"
  }
}
```

### 🔄 **Automatic Features**

- **Route Generation** - Pages automatically become accessible
- **Navigation Updates** - Menu items added automatically
- **SEO Optimization** - Meta tags generated from content
- **Static Site Generation** - HTML files created for GitHub Pages

## 🧪 Testing

### 🎯 **Comprehensive Test Suite**

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# CI/CD tests
npm run test:ci
```

### 📊 **Coverage Reports**

Tests cover:

- **Route handling** and page rendering
- **Utility functions** and helpers
- **Security middleware** functionality
- **API endpoints** and responses
- **Component rendering** and interactions

### 🔍 **Quality Assurance**

- **ESLint** for code quality
- **Prettier** for formatting
- **Jest** for unit testing
- **Security audits** with npm audit
- **Performance monitoring** built-in

## 🤝 Contributing

We welcome contributions from developers of all skill levels!

### 🚀 **Getting Started**

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** thoroughly
6. **Submit** a pull request

### 📋 **Contribution Guidelines**

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Use conventional commit messages
- Keep pull requests focused

### 🏷️ **Good First Issues**

Look for issues labeled:

- `good first issue`
- `beginner-friendly`
- `help wanted`
- `documentation`

### 💬 **Community**

- 🐛 **Report bugs** via [GitHub Issues](https://github.com/markhazleton/js-dev-env/issues)
- 💡 **Suggest features** via [GitHub Discussions](https://github.com/markhazleton/js-dev-env/discussions)
- 🗨️ **Ask questions** in the community forum
- 📢 **Follow updates** on releases and announcements

## 📈 **Project Stats**

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/markhazleton/js-dev-env?style=for-the-badge)
![GitHub code size](https://img.shields.io/github/languages/code-size/markhazleton/js-dev-env?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/markhazleton/js-dev-env?style=for-the-badge)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/markhazleton/js-dev-env?style=for-the-badge)

</div>

## 🙏 **Acknowledgments**

Special thanks to the amazing open-source community and these fantastic projects:

- [Bootstrap](https://getbootstrap.com/) for the incredible CSS framework
- [Express.js](https://expressjs.com/) for the robust web framework
- [Bootstrap Icons](https://icons.getbootstrap.com/) for the comprehensive icon library
- [GitHub Pages](https://pages.github.com/) for free hosting
- [Jest](https://jestjs.io/) for the testing framework

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🌟 **Show Your Support**

If this project helped you, please consider:

- ⭐ **Starring** the repository
- 🍴 **Forking** for your own projects
- 📢 **Sharing** with the community
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features

---

<div align="center">

**Built with ❤️ by [Mark Hazleton](https://github.com/markhazleton)**

[![Follow on GitHub](https://img.shields.io/github/followers/markhazleton?style=social)](https://github.com/markhazleton)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=social&logo=linkedin)](https://www.linkedin.com/in/markhazleton/)

</div>
