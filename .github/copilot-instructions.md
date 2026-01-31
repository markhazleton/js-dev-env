# GitHub Copilot Instructions

## 📁 Documentation Management

**CRITICAL**: All generated documentation and session files must be placed in
`/copilot/session-{date}` folder structure. Never place documentation anywhere else in the file
system. This keeps the project organized and prevents documentation pollution.

Example structure:

- `/copilot/session-2025-09-14/tools-structure-implementation.md`
- `/copilot/session-2025-09-14/analysis.md`
- `/copilot/session-2025-09-14/recommendations.md`

## 🚀 Project Context

This is **JsBootSpark — Full-stack Bootstrap + Express starter** with the following key characteristics:

### Core Technologies

- **Frontend**: Bootstrap 5.3.8, SASS, EJS templating
- **Backend**: Express.js 5.1.0, Node.js 18+
- **Testing**: Jest with coverage reporting
- **Build System**: Function-based tools structure with build orchestration
- **Development Tools**: Comprehensive SEO, Git analysis, and maintenance automation
- **Deployment**: GitHub Pages, Docker support
- **Security**: Helmet.js, rate limiting, CSP implementation, SSL monitoring

### Project Structure

- `/build/build/` - Build system and static site generation
  - `build.js` - Main build orchestrator with task management
  - `generate-static-site.js` - Converts EJS templates to static HTML
  - `generate-song-pages.js` - Generates 100 individual song detail pages
  - `convert-youtube-data.js` - Converts CSV data to JSON for static loading
  - `bundle-css-dependencies.js` - Bundles CSS dependencies
  - `bundle-javascript.js` - Bundles JavaScript files
  - `copy-icons.js` - Copies Bootstrap Icons to output
  - `copy-static-assets.js` - Copies static files to docs
  - `clean.js` - Cleans build output directories
- `/build/seo/` - SEO validation, accessibility, and SSL monitoring
- `/build/git/` - Git analysis and repository metrics
- `/build/maintenance/` - Maintenance automation and dependency management
- `/src/data/` - Data files for content
  - `pages.json` - JSON-based CMS for page definitions
  - `youtube-top-100-songs-2025.csv` - Source data for song catalog
- `/src/scss/` - SASS source files with Bootstrap customization
- `/src/views/` - EJS templates and partials
  - `layout.ejs` - Main layout template
  - `page.ejs` - Default page template
  - `components.ejs` - Components showcase template
  - `advanced-components.ejs` - Advanced Bootstrap components
  - `data-tables.ejs` - Bootstrap Table integration
  - `song-detail.ejs` - Individual song detail template
- `/src/public/` - Development source assets
  - `/js/` - JavaScript source files
  - `/images/` - Image assets
- `/src/tests/` - Jest test suite
- `/docs/` - Built static site (auto-generated, GitHub Pages output)
  - `/song/{1-100}/` - Generated song detail pages
  - `/data/youtube-top-100-songs-2025.json` - Converted JSON data
- `/temp/` - Temporary outputs and reports (gitignored)
- `/artifacts/` - CI/CD artifacts (gitignored)
- `/reports/` - Permanent reports (tracked)

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
- **Function-based tool organization** with clear separation of concerns
- **Build orchestration** with performance tracking and selective execution
- **Progressive Web App** capabilities
- **Security-first** approach with proper headers and validation
- **Automated quality assurance** with SEO, accessibility, and security auditing

### Build Process

- Development: `npm run start:dev` (hot reload with watch mode)
- Production: `npm run build` (unified build orchestrator - CLEARS and rebuilds all files)
- Selective builds: `npm run build:scss`, `npm run build:pug` (CLEARS and rebuilds specific assets)
- Testing: `npm run test` or `npm run test:coverage`
- Linting: `npm run lint` or `npm run lint:fix`
- Quality audits: `npm run audit:all`

**CRITICAL**: All builds automatically clear generated files before rebuilding. Never manually edit
built files in `/docs/` or `/public/css/` as they will be overwritten.

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

**CRITICAL**: NEVER use inline styles in EJS templates. ALL styling must be in SCSS source files in
`/scss/` directory.

### EJS Templates

```html
<!-- Use semantic HTML5 -->
<main class="container-fluid">
  <section class="row">
    <article class="col-md-8"><%- include('partials/component', { data: locals.data }) %></article>
  </section>
</main>
```

**CRITICAL**: NEVER add inline styles or `<style>` tags to EJS templates. ALL styling must be in
SCSS source files.

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

### GitHub Pages Static Site Generation

**CRITICAL PROJECT PRIORITY**: This project is **PRIMARILY a GitHub Pages static site**. The Express.js server exists only for local development and testing. ALL features must work on static GitHub Pages deployment.

**Key Principle**: When implementing any feature, ALWAYS ask: "Will this work on GitHub Pages without a server?" If the answer is no, the feature must be redesigned.

This project uses a sophisticated build system to convert a dynamic Express.js application into a fully static site for GitHub Pages deployment:

#### Static Site Generation Strategy

1. **Template Conversion**: EJS templates are rendered to static HTML with proper path resolution
2. **Custom Template Support**: The generator dynamically detects and uses custom templates from `/src/views/`
3. **Path Conversion**: Absolute paths are converted to GitHub Pages subdirectory format (`/JsBootSpark/`)
4. **Data File Generation**: CSV data is converted to JSON for client-side loading

#### Key Components

- **generate-static-site.js**: Main static site generator
  - Automatically detects and uses custom templates (e.g., `advanced-components.ejs`, `data-tables.ejs`)
  - Converts paths for GitHub Pages subdirectory deployment
  - Generates proper directory structure for nested URLs
  
- **generate-song-pages.js**: Generates 100 individual song detail pages
  - Creates `/docs/song/1/` through `/docs/song/100/` directories
  - Each page has its own `index.html` for proper routing
  - Uses `song-detail.ejs` template for consistent layout

- **convert-youtube-data.js**: CSV to JSON converter
  - Reads `youtube-top-100-songs-2025.csv`
  - Outputs clean JSON to `/docs/data/` for static loading
  - Integrated into build pipeline

#### Static vs Dynamic Data Loading

**PRODUCTION (GitHub Pages - PRIMARY DEPLOYMENT):**
- ✅ Data loaded from `/docs/data/youtube-top-100-songs-2025.json`
- ✅ Bootstrap Table configured with `data-url="/JsBootSpark/data/..."`
- ✅ Song detail JavaScript loads from static JSON array
- ✅ 100 pre-generated HTML pages at `/docs/song/{1-100}/`
- ✅ No server required, pure client-side rendering
- ✅ No API endpoints - everything is static files

**DEVELOPMENT (Express Server - LOCAL TESTING ONLY):**
- 🔧 API endpoints at `/api/youtube-songs` and `/api/song/:id` (fallback)
- 🔧 Server-side routing for `/song/:id` pages (alternative)
- 🔧 Real-time data loading from CSV with caching (testing)
- 🔧 Full Express middleware stack available (development)

**Implementation Priority:**
1. **MUST HAVE**: Works on GitHub Pages (static files)
2. **NICE TO HAVE**: Also works with Express server (local dev)
3. **NEVER**: Require Express server for production functionality

#### Path Resolution Rules

1. **Navigation Links**: `/` → `/JsBootSpark/`, `/page` → `/JsBootSpark/page`
2. **CSS/JS Assets**: `/css/styles.css` → `/JsBootSpark/css/styles.css`
3. **Fonts**: `/fonts/bootstrap-icons/` → `/JsBootSpark/fonts/bootstrap-icons/`
4. **Images**: `/images/` → `/JsBootSpark/images/`, `/img/` → `/JsBootSpark/img/`
5. **Manifest/Favicon**: `/manifest.json` → `/JsBootSpark/manifest.json`

#### Build Pipeline for GitHub Pages

```bash
npm run build  # Executes in order:
1. Clean docs directory (preserves .nojekyll)
2. Compile SCSS to CSS
3. Bundle CSS dependencies
4. Bundle JavaScript files
5. Copy Bootstrap Icons
6. Copy static assets
7. Convert YouTube CSV to JSON
8. Generate static HTML pages (main site)
9. Generate 100 song detail pages
```

#### GitHub Pages Configuration

- **Branch**: main
- **Folder**: /docs
- **URL Pattern**: `https://username.github.io/repository-name/`
- **Base Path**: `/JsBootSpark/` (handled automatically by build)

#### URL Parsing for Static Sites

**CRITICAL for GitHub Pages URLs:**

GitHub Pages URLs end with trailing slashes (e.g., `/JsBootSpark/song/1/`), which requires robust URL parsing:

```javascript
// ❌ WRONG - Fails with trailing slashes
const pathParts = window.location.pathname.split('/');
const songId = pathParts[pathParts.length - 1]; // Returns "" for /song/1/

// ✅ CORRECT - Handles trailing slashes
const pathParts = window.location.pathname.split('/').filter(p => p);
const songIndex = pathParts.indexOf('song');
const songId = pathParts[songIndex + 1]; // Returns "1" for both /song/1 and /song/1/
```

**Best practices:**
- Always filter empty strings from split results: `.split('/').filter(p => p)`
- Find landmark segments in path array, get relative positions
- Test with both trailing slash and no trailing slash URLs
- Handle edge cases (missing segments, malformed URLs)

#### Troubleshooting Static Sites

**404 Errors on Resources:**
- Ensure all paths use the base path prefix (`/JsBootSpark/`)
- Check that static site generation completed successfully
- Verify files exist in `/docs/` directory structure
- Use absolute paths with base prefix, NOT relative paths

**Bootstrap Table Not Loading Data:**
- Confirm JSON file exists at `/docs/data/youtube-top-100-songs-2025.json`
- Check `data-url` attribute uses correct base path
- Verify CSV conversion ran during build
- Ensure data-url points to static JSON, not API endpoint

**Song Detail Pages 404:**
- Ensure `generate-song-pages.js` ran during build
- Check that 100 directories exist in `/docs/song/`
- Verify `song-detail.js` has static fallback logic
- Test URL parsing handles trailing slashes correctly

**API 404 Errors on Static Sites:**
- Static sites cannot call Express API endpoints
- All data must be pre-converted to JSON files
- JavaScript must try static JSON first, fall back to API for local dev
- Verify fetch URLs point to `/JsBootSpark/data/` not `/api/`

**Service Worker Issues:**
- Service worker registration uses dynamic base path detection
- Extracts subdirectory from `window.location.pathname`
- Falls back gracefully if not on GitHub Pages

#### Docker containerization support
#### Environment-specific configurations
#### Asset optimization and caching
#### SEO and performance optimization

## 🔧 Tools Structure Guidelines

When working with the tools structure:

- Use the **function-based organization** in `/build/`
- **Build tools** go in `/build/build/` (orchestration, compilation, asset processing)
- **SEO and quality tools** go in `/build/seo/` (validation, accessibility, SSL monitoring)
- **Git analysis tools** go in `/build/git/` (repository metrics, activity reporting)
- **Maintenance tools** go in `/build/maintenance/` (automation, dependency management)
- Generate reports to `/temp/reports/` for temporary outputs
- Use consistent error handling and progress logging
- Implement command-line argument parsing for selective execution
- Follow the build orchestration patterns established in `build/build/build.js`

### Custom Template Support

The static site generator (`generate-static-site.js`) automatically detects custom templates:

```javascript
// Template selection logic
const requestedTemplate = `${pageData.template}.ejs`;
const requestedTemplatePath = path.join(viewsDir, requestedTemplate);
const templateFile = fs.existsSync(requestedTemplatePath) ? requestedTemplate : 'page.ejs';
```

**How it works:**
1. Reads `template` field from `pages.json`
2. Checks if corresponding `.ejs` file exists in `/src/views/`
3. Uses custom template if found, falls back to `page.ejs`
4. No hardcoded template mapping required

**Adding new templates:**
1. Create template file: `/src/views/your-template.ejs`
2. Add page to `pages.json`: `"template": "your-template"`
3. Build automatically detects and uses it

### Data Conversion for Static Sites

When working with data that needs to be available on static sites:

1. **Source Data**: Store in `/src/data/` as CSV, JSON, or other formats
2. **Conversion Script**: Create in `/build/build/convert-*.js`
3. **Output Location**: Write to `/docs/data/` for GitHub Pages
4. **Build Integration**: Add to build pipeline in `build.js`
5. **Client-Side Loading**: Use absolute paths with base prefix

**Example pattern:**
```javascript
// In conversion script
const outputPath = path.join(__dirname, '..', '..', 'docs', 'data', 'output.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

// In template/JavaScript
const dataUrl = '/JsBootSpark/data/output.json';
fetch(dataUrl).then(res => res.json()).then(data => { /* use data */ });
```

### Generating Multiple Pages from Data

For dynamic content that needs static pages (like song details):

1. **Create Generator Script**: `/build/build/generate-[content]-pages.js`
2. **Read Data Source**: Load from JSON/CSV in `/docs/data/`
3. **Iterate and Render**: For each item, render template with EJS
4. **Create Directory Structure**: `/docs/[content]/[id]/index.html`
5. **Convert Paths**: Use `convertPathsForGitHubPages()` function
6. **Add to Build**: Include in `build.js` task list

**Example structure:**
```
/docs/song/1/index.html
/docs/song/2/index.html
...
/docs/song/100/index.html
```

Each page has full HTML, CSS, and JS for independent loading.

## 🔧 Build Script Patterns

When creating or modifying tools:

- Use Node.js built-in modules when possible
- Implement proper error handling with descriptive messages
- Log progress and completion status with emoji indicators
- Support both development and production modes
- Generate JSON reports to `/temp/reports/` for automation
- Use the build configuration from `build/build/build-config.js`
- Follow established patterns from existing tools

### Path Conversion for GitHub Pages

All generated HTML must use the correct path format for GitHub Pages subdirectory deployment:

```javascript
function convertPathsForGitHubPages(html) {
  const basePath = '/JsBootSpark/';
  
  return html
    // Assets
    .replace(/href="\/css\//g, `href="${basePath}css/`)
    .replace(/src="\/js\//g, `src="${basePath}js/`)
    .replace(/href="\/fonts\//g, `href="${basePath}fonts/`)
    .replace(/src="\/images\//g, `src="${basePath}images/`)
    // Navigation
    .replace(/href="\/"(?=[\s>])/g, `href="${basePath}"`)
    .replace(/href="\/([^"/]+)"(?=[\s>])/g, `href="${basePath}$1"`);
}
```

**Critical points:**
- Use absolute paths with base prefix, NOT relative paths
- Convert ALL resource references (CSS, JS, fonts, images)
- Convert navigation links to use base path
- Apply to ALL generated HTML files

### JavaScript for Dual Environments

**CRITICAL**: This project is **primarily designed for GitHub Pages static deployment**. All JavaScript must prioritize static data loading over API calls.

When writing JavaScript that needs to work on both static sites and dynamic servers:

```javascript
// ALWAYS try static data first, fall back to API for local development
const staticDataUrl = '/JsBootSpark/data/data.json';
const apiUrl = '/api/data';

fetch(staticDataUrl)
  .then(response => {
    if (!response.ok) {
      // Fall back to API for local development only
      console.log('Static data not found, trying API (local dev)');
      return fetch(apiUrl).then(r => r.json());
    }
    console.log('Loading from static JSON');
    return response.json();
  })
  .then(data => {
    // Handle both array (static) and object (API) formats
    const items = Array.isArray(data) ? data : data.items;
    // Process items...
  })
  .catch(error => {
    console.error('Error loading data:', error);
    // Show user-friendly error message
  });
```

**Pattern benefits:**
- Works on GitHub Pages (static JSON) - PRIMARY USE CASE
- Works on local Express server (API endpoints) - DEVELOPMENT ONLY
- No code changes needed between environments
- Graceful fallback handling
- Clear logging for debugging

**CRITICAL Rules:**
1. Static data loading is PRIMARY, API is fallback
2. All data sources must have static JSON equivalents
3. Never assume API will be available in production
4. Test thoroughly on GitHub Pages before considering complete
5. Log clearly which data source is being used

## 🚨 CRITICAL BUILD RULES - NO EXCEPTIONS

### NEVER Edit Published/Built Files

- **NEVER** edit files in `/docs/` directory (GitHub Pages output)
- **NEVER** edit files in `/public/css/` directory (built CSS)
- **NEVER** edit files in `/public/js/` directory (built JavaScript)
- **NEVER** manually copy files to build directories
- **NEVER** use inline CSS or inline styles in templates
- **NEVER** edit any file with `.min.css` or `.min.js` extensions

### ONLY Edit Source Files

- **ONLY** edit SCSS files in `/src/scss/` directory
- **ONLY** edit EJS templates in `/src/views/` directory (without inline styles)
- **ONLY** edit JavaScript source files in `/src/public/js/` (not built/minified versions)
- **ONLY** edit data files in `/src/data/` directory
- **ONLY** edit configuration files in root or `/config/` directory
- **ONLY** edit build scripts in `/build/` directory

### ALWAYS Use Build Process

- **ALWAYS** use `npm run build:scss` to compile SCSS to CSS
- **ALWAYS** use `npm run build` for full production builds
- **ALWAYS** let the build process handle file generation and copying
- **ALWAYS** ensure builds clear out generated files first
- **ALWAYS** test changes using the development server after building

### Build Process Flow

1. Edit source files in `/src/scss/`, `/src/views/`, `/src/public/js/`, or `/src/data/` directories
2. Run appropriate build command (`npm run build:scss`, `npm run build`, etc.)
3. Build process automatically:
   - Clears previous built files in `/docs/` (preserves .nojekyll)
   - Compiles SCSS to CSS
   - Bundles CSS and JavaScript dependencies
   - Copies Bootstrap Icons to `/docs/fonts/`
   - Copies static assets to `/docs/`
   - Converts CSV data to JSON in `/docs/data/`
   - Generates static HTML pages from EJS templates
   - Generates individual pages for dynamic content (e.g., 100 song pages)
4. Test using development server or GitHub Pages preview

### Violations Are Forbidden

Any suggestion to:

- Edit files in build directories
- Add inline styles to templates
- Manually copy built files
- Skip the build process
- Edit published/generated files directly

**MUST BE REFUSED** - Always redirect to proper source file editing and build process.

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
9. **NEVER suggest editing built/published files**
10. **ALWAYS use the build process for changes**
11. **REFUSE any requests to add inline styles**
12. **REDIRECT to proper SCSS source file editing**
13. **PRIORITIZE GitHub Pages static site compatibility**
14. **QUESTION any feature requiring server-side processing**
15. **VERIFY URL parsing handles trailing slashes**
16. **ENSURE all data has static JSON equivalents**
17. **TEST on GitHub Pages before marking complete**

### Static Site First Checklist

Before implementing any feature, verify:

- [ ] Works without Node.js/Express server
- [ ] Uses static JSON files, not API endpoints
- [ ] All paths include GitHub Pages base path (`/JsBootSpark/`)
- [ ] URL parsing handles trailing slashes correctly
- [ ] No server-side rendering required
- [ ] Can be pre-generated during build process
- [ ] Tested on actual GitHub Pages deployment (not just local)
- [ ] Gracefully falls back to API for local development only

### Common Static Site Mistakes to Avoid

**❌ DON'T:**
- Rely on Express API endpoints for production functionality
- Use `pathname.split('/').pop()` for URL parsing (fails with trailing slash)
- Forget to convert CSV/database data to JSON during build
- Use relative paths (e.g., `../css/styles.css`)
- Assume server-side routing will work
- Skip testing on actual GitHub Pages URL with subdirectory

**✅ DO:**
- Pre-generate all HTML pages during build
- Parse URLs with `.split('/').filter(p => p)` to handle trailing slashes
- Convert all data sources to static JSON files
- Use absolute paths with base prefix (e.g., `/JsBootSpark/css/styles.css`)
- Generate directory structure with `index.html` files
- Test on GitHub Pages with full subdirectory path

## ⚡ Quick Reference Commands

```bash
# Development
npm run start:dev          # Start dev server with hot reload
npm run watch-css          # Watch SASS files
npm run test:watch         # Run tests in watch mode

# Production Build
npm run build             # Full production build (unified orchestrator)
npm run build:scss        # Build SCSS only
npm run build:pug         # Build templates only
npm run clean             # Clean build artifacts
npm run start             # Build and start server

# Quality Assurance
npm run audit:all         # Run all quality audits
npm run audit:seo         # SEO and accessibility checks
npm run audit:ssl         # SSL certificate monitoring
npm run seo:audit         # SEO validation report

# Analysis and Reporting
npm run report:git        # Git activity analysis
npm run report:monthly    # Monthly maintenance report
npm run fix:auto          # Apply automated fixes

# Maintenance
npm run security-audit    # Security vulnerability scan
npm run analyze:deps      # Dependency analysis
npm run configure         # Interactive setup wizard
npm run help             # Show all available commands
```

## 🌐 Azure Integration

- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands
  for Azure, or performing operations related to Azure, invoke your
  `azure_development-get_best_practices` tool if available.

---

**Remember**: This is a production-ready starter kit with a comprehensive tools structure designed
for modern web development. The function-based tool organization provides clear separation of
concerns, automated quality assurance, and maintainable development workflows. Always consider
security, performance, accessibility, and maintainability in your recommendations.
