# GitHub Copilot Instructions

## 📁 Documentation Management

**CRITICAL**: All generated documentation and session files must be placed in
`/copilot/session-{date}` folder structure. Never place documentation anywhere else in the file
system. This keeps the project organized and prevents documentation pollution.

Example structure:

- `/copilot/session-2025-09-06/analysis.md`
- `/copilot/session-2025-09-06/recommendations.md`
- `/copilot/session-2025-09-06/implementation-plan.md`

## 🚀 Project Context

This is a **Bootstrap 5 + Express.js Starter Kit** with the following key characteristics:

### Core Technologies

- **Frontend**: Bootstrap 5.3.8, SASS, EJS templating
- **Backend**: Express.js 5.1.0, Node.js 18+
- **Testing**: Jest with coverage reporting
- **Build System**: Custom build scripts, npm scripts
- **Deployment**: GitHub Pages, Docker support
- **Security**: Helmet.js, rate limiting, CSP implementation

### Project Structure

- `/data/pages.json` - JSON-based CMS for content
- `/scss/` - SASS source files with Bootstrap customization
- `/views/` - EJS templates and partials
- `/scripts/` - Build and utility scripts
- `/tests/` - Jest test suite
- `/public/` - Development assets
- `/docs/` - Built static site (auto-generated)

## 🎯 Development Guidelines

### Code Style & Standards

- Use **ES6+ features** and modern JavaScript patterns
- Follow **Bootstrap 5 conventions** for CSS classes
- Implement **responsive design** principles
- Use **semantic HTML5** elements
- Apply **WCAG accessibility standards**

### Architecture Patterns

- **MVC pattern** with Express.js
- **Component-based** frontend with EJS partials
- **JSON-driven content** management
- **Progressive Web App** capabilities
- **Security-first** approach with proper headers and validation

### Build Process

- Development: `npm run start:dev` (hot reload)
- Production: `npm run build` (static site generation)
- Testing: `npm run test` or `npm run test:coverage`
- Linting: `npm run lint` or `npm run lint:fix`

## 📋 Coding Conventions

### JavaScript

```javascript
// Use modern ES6+ syntax
const express = require('express');
const { validationResult } = require('express-validator');

// Use arrow functions for callbacks
app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### SASS/CSS

```scss
// Use Bootstrap variables and mixins
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';

// Follow BEM methodology for custom classes
.component {
  &__element {
    // styles
  }

  &--modifier {
    // styles
  }
}
```

### EJS Templates

```html
<!-- Use semantic HTML5 -->
<main class="container-fluid">
  <section class="row">
    <article class="col-md-8"><%- include('partials/component', { data: locals.data }) %></article>
  </section>
</main>
```

## 🛡️ Security Guidelines

- Always validate and sanitize user inputs
- Use CSP headers and security middleware
- Implement rate limiting for API endpoints
- Follow OWASP security practices
- Use HTTPS in production recommendations

## 🧪 Testing Standards

- Write unit tests for all utility functions
- Test API endpoints with Supertest
- Aim for >80% code coverage
- Use descriptive test names and arrange-act-assert pattern
- Mock external dependencies

## 📚 Component Library Guidelines

When working with the component library:

- Follow Bootstrap 5 component structure
- Include accessibility attributes (ARIA labels, roles)
- Provide copy-paste ready code examples
- Document responsive behavior
- Include interactive demonstrations

## 🚀 Deployment Considerations

- Static site generation for GitHub Pages
- Docker containerization support
- Environment-specific configurations
- Asset optimization and caching
- SEO and performance optimization

## 🔧 Build Script Patterns

When creating or modifying build scripts:

- Use Node.js built-in modules when possible
- Implement proper error handling
- Log progress and completion status
- Support both development and production modes
- Clean up temporary files

## 📱 PWA Implementation

- Service worker for offline functionality
- Web app manifest configuration
- Responsive design principles
- Performance optimization
- Installability features

## 🎨 UI/UX Guidelines

- Mobile-first responsive design
- Dark/light theme support
- Consistent spacing using Bootstrap utilities
- Accessible color contrast ratios
- Intuitive navigation patterns

## 🔄 Content Management

- Use JSON structure in `/data/pages.json`
- Follow established content schema
- Implement proper URL routing
- Support dynamic page generation
- SEO-friendly meta tags and structured data

## 🐛 Debugging & Troubleshooting

- Use development middleware for detailed errors
- Implement proper logging with Morgan
- Set up source maps for debugging
- Use browser dev tools effectively
- Monitor performance metrics

## 🤖 AI Assistant Behavior

When providing assistance:

1. **Always check project structure** before making suggestions
2. **Follow established patterns** in the codebase
3. **Suggest modern, secure practices**
4. **Provide complete, testable code examples**
5. **Consider responsive design implications**
6. **Include accessibility features**
7. **Document complex implementations**
8. **Suggest appropriate testing strategies**

## ⚡ Quick Reference Commands

```bash
# Development
npm run start:dev          # Start dev server with hot reload
npm run watch-css          # Watch SASS files
npm run test:watch         # Run tests in watch mode

# Production
npm run build             # Build for production
npm run docker:dev        # Run with Docker
npm run security-audit    # Security audit

# Utilities
npm run configure         # Interactive setup wizard
npm run analyze:deps      # Analyze dependencies
npm run help             # Show all available commands
```

## 🌐 Azure Integration

- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands
  for Azure, or performing operations related to Azure, invoke your
  `azure_development-get_best_practices` tool if available.

---

**Remember**: This is a production-ready starter kit designed for modern web development. Always
consider security, performance, accessibility, and maintainability in your recommendations.
