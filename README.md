# Bootstrap 5 + Express.js Starter Kit

A simple, lightweight starter kit for building websites with Bootstrap 5, Express.js, and EJS templates.

## Features

- 🚀 **Express.js Backend** - Fast, unopinionated, minimalist web framework for Node.js
- 📝 **EJS Templates** - Simple templating language for generating HTML
- 🎨 **Bootstrap 5** - Powerful, responsive front-end framework
- 💅 **SASS Support** - For more organized and maintainable CSS
- 🖌️ **Bootstrap Icons** - Over 1,800 high-quality icons
- 🔄 **Live Reload** - Automatically refresh your browser on code changes
- 📱 **Mobile-First** - Responsive design that works on all devices
- 🎛️ **Content Management** - Simple JSON-based content management
- 🌓 **Dark Mode** - Built-in dark mode with theme toggle and persistence
- 🔒 **Enhanced Security** - Helmet.js integration for security headers
- 🚄 **Performance Optimized** - Compression and caching for better performance
- 📱 **PWA Support** - Progressive Web App features for offline access
- 🔍 **SEO Ready** - Structured data and optimized metadata
- 🌐 **GitHub Pages Ready** - Static site generation for easy deployment

## GitHub Pages Deployment

This starter kit includes built-in support for GitHub Pages deployment:

### Build Process

The build process generates static HTML files in the `/docs` directory:

- `npm run build` - Build static site for GitHub Pages
- `npm run build:github-pages` - Alias for the build command

### Automatic Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. Builds the static site when you push to the main branch
2. Deploys the generated files to GitHub Pages
3. Makes your site available at `https://username.github.io/repository-name`

### Manual Setup

To set up GitHub Pages manually:

1. Run `npm run build` to generate the `/docs` directory
2. Commit and push the changes to your repository
3. In your GitHub repository settings, go to Pages
4. Set the source to "Deploy from a branch"
5. Select the `main` branch and `/docs` folder
6. Your site will be available at your GitHub Pages URL

## Quick Start

### Prerequisites

- Node.js (v14 or newer)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository (or download the ZIP file)
git clone https://github.com/yourusername/bootstrap-express-starter.git
cd bootstrap-express-starter

# Install dependencies
npm install

# Start the development server
npm run start:dev

# Open your browser and navigate to http://localhost:3000
```

## Project Structure

```
project-root/
├── data/
│   └── pages.json             # Content definitions for pages
├── public/                    # Static files served to the client
│   ├── css/                   # Compiled CSS files
│   ├── js/                    # JavaScript files
│   │   ├── form-validation.js # Form validation utilities
│   │   └── theme-toggle.js    # Dark mode toggle functionality
│   ├── manifest.json          # Web App Manifest for PWA
│   ├── service-worker.js      # Service Worker for offline support
│   └── fonts/                 # Font files including Bootstrap Icons
├── scss/                      # SASS source files
│   ├── _custom.scss           # Custom styles
│   ├── _variables.scss        # Bootstrap variable overrides
│   ├── _components-pages.scss # Component-specific styles
│   └── main.scss              # Main SASS file
├── scripts/                   # Utility scripts
│   └── copy-icons.js          # Script to copy Bootstrap Icons
├── tests/                     # Test suite
│   └── app.test.js            # Basic application tests
├── utils/                     # Utility functions
│   ├── cache.js               # Simple caching system
│   └── database.js            # Database abstraction layer
├── views/                     # EJS template files
│   ├── partials/              # Reusable template parts
│   ├── error-404.ejs          # Custom 404 error page
│   ├── layout.ejs             # Main layout template
│   └── page.ejs               # Page template
├── .env                       # Environment configuration
├── index.js                   # Main server file
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation
```

## Environment Configuration

The starter kit uses dotenv for environment configuration. Create or edit the `.env` file:

```properties
# Server configuration
PORT=3000
NODE_ENV=development

# Application settings
SITE_NAME=My Bootstrap Website
ENABLE_CACHE=false
```

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with nodemon for auto-reloading
- `npm run build-css` - Compile SASS to CSS once
- `npm run watch-css` - Watch SASS files and compile on changes
- `npm run copy-icons` - Copy Bootstrap Icons to the public directory
- `npm run start:dev` - Do all of the above at once (recommended for development)
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run Jest test suite

## Adding New Pages

To add a new page, add an entry to `data/pages.json`:

```json
{
  "title": "Page Title",
  "url": "/page-url",
  "template": "page",
  "content": {
    "heading": "Page Heading",
    "text": "Page description text",
    "body": "Page content in HTML format"
  }
}
```

The server automatically creates routes for all pages defined in the JSON file.

## API Endpoints

The starter kit includes a basic API structure:

- `GET /api/info` - Returns basic information about the site

Add your own endpoints in the `index.js` file:

```javascript
apiRouter.get('/custom-endpoint', (req, res) => {
  // Your API logic here
  res.json({ success: true, data: { ... } });
});
```

## Progressive Web App (PWA) Support

This starter kit includes built-in PWA support:

- Service Worker for offline functionality
- Web App Manifest for installable experience

To customize the PWA settings, edit the `public/manifest.json` file.

## Form Validation

Use the included form validation utilities for client-side validation:

```html
<form class="needs-validation" novalidate>
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" required>
    <div class="invalid-feedback">Please provide a valid email.</div>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

## Dark Mode

The starter kit includes a dark mode toggle. The theme preference is saved to localStorage and respects the user's system preferences.

## SCSS Best Practices

This starter kit follows modern SCSS best practices:

- **Sass Module System:** Uses `@use` and `@forward` instead of `@import`.
- **Namespacing:** All variables and mixins are namespaced (e.g., `variables.$primary`, `bootstrap.media-breakpoint-down`).
- **Modular Structure:** SCSS files are organized into partials for better maintainability.
- **Bootstrap Customization:** Variables are overridden in `_variables.scss` before importing Bootstrap.

## Customizing Bootstrap

To customize Bootstrap variables, edit `scss/_variables.scss`. For example:

```scss
// Bootstrap color overrides
$primary: #ff5733; // Primary color for theme

// Example: Extend Bootstrap's $theme-colors map
$theme-colors: map-merge(
  (
    "primary": #ff5733,
    "secondary": #6c757d
  ),
  $theme-colors
);

// Custom variables
$font-size-base: 1.1rem; // Base font size
$custom-card-shadow-light: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); // Light card shadow
$custom-card-shadow-dark: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.3); // Dark card shadow
```

## Deployment

This starter kit can be deployed to various hosting platforms:

- **Heroku**: Add a `Procfile` with `web: node index.js`
- **Vercel/Netlify**: Configure as a Node.js application
- **GitHub Pages**: See the GitHub Pages Deployment section
- **Traditional Hosting**: Build the site and upload via FTP

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
