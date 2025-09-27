// Environment configuration
require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const crypto = require('crypto');
const cacheUtils = require('./utils/cache');
const buildInfo = require('./utils/build-info');
const { featureMiddleware } = require('./utils/feature-middleware');
const { performanceMiddleware } = require('./utils/performance-monitor');
const { pluginManager } = require('./plugins/core/plugin-manager');
const { PLUGIN_HOOKS } = require('./plugins/core/plugin-api');
// const { TRUSTED_RESOURCES } = require('./utils/security'); // Reserved for future security features

// Create Express app
const app = express();

// Set NODE_ENV if not set
const environment = process.env.NODE_ENV || 'development';
console.log(`App running in ${environment} mode`);

// CSP nonce middleware
app.use((req, res, next) => {
  // Generate a unique nonce for each request
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  next();
});

// Security middleware
app.use((req, res, next) => {
  // Get the nonce for the current request
  const cspNonce = res.locals.cspNonce;
  
  // Apply helmet with dynamic nonce
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'", 
          'https://cdn.jsdelivr.net',
          'https://cdnjs.cloudflare.com',
          `'nonce-${cspNonce}'` // Allow scripts with this request's nonce
        ],
        styleSrc: [
          "'self'", 
          'https://cdn.jsdelivr.net',
          'https://cdnjs.cloudflare.com',
          'https://fonts.googleapis.com',
          "'unsafe-inline'" // Required for dynamic theme switching
        ],
        fontSrc: [
          "'self'", 
          'https://fonts.gstatic.com',
          'https://cdn.jsdelivr.net',
          'https://cdnjs.cloudflare.com'
        ],
        imgSrc: [
          "'self'", 
          'data:', 
          'https://via.placeholder.com',
          'https://cdn.jsdelivr.net'
        ],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        // Add integrity requirement for external resources (disabled in development)
        ...(environment === 'production' ? { requireSriFor: ['script', 'style'] } : {})
      }
    },
    // Add additional security headers
    crossOriginEmbedderPolicy: false, // Set to true for stricter security if needed
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Disable HSTS in development to prevent HTTPS enforcement
    hsts: environment === 'production' ? { maxAge: 31536000 } : false
  })(req, res, next);
});

// Compression middleware for better performance
app.use(compression());

// HTTP request logging
if (environment !== 'test') {
  app.use(morgan(environment === 'development' ? 'dev' : 'combined'));
}

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts middleware
app.use(expressLayouts);

// Set the default layout
app.set('layout', 'layout');  // This ensures views use layout.ejs by default

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Add build info to all templates
app.use(buildInfo.middleware());

// Add feature flags to all templates
app.use(featureMiddleware('standard'));

// Add performance monitoring
app.use(performanceMiddleware());

// Initialize plugin system
let pluginsInitialized = false;
async function initializePlugins() {
  if (!pluginsInitialized) {
    try {
      await pluginManager.initialize();
      
      // Add plugin middleware
      const plugins = pluginManager.getAllPlugins();
      for (const [name, plugin] of Object.entries(plugins)) {
        if (typeof plugin.middleware === 'function') {
          app.use(plugin.middleware.bind(plugin));
          console.log(`🔌 Added middleware for plugin: ${name}`);
        }
      }
      
      pluginsInitialized = true;
    } catch (error) {
      console.error('❌ Plugin initialization failed:', error.message);
    }
  }
}

// Parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add middleware to extract current path
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Read pages.json with caching
const loadPagesData = () => {
  // Check if we should use caching (based on environment variable)
  const enableCache = process.env.ENABLE_CACHE === 'true';
  const cacheKey = 'pages_data';
  
  // Try to get data from cache first
  if (enableCache) {
    const cachedData = cacheUtils.get(cacheKey);
    if (cachedData) {
      console.log('Using cached pages data');
      return cachedData;
    }
  }
  
  // Cache miss or caching disabled, load from file
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'pages.json'), 'utf-8'));
    
    // Store in cache if enabled (cache for 5 minutes in production, 10 seconds in development)
    if (enableCache) {
      const ttl = environment === 'production' ? 300000 : 10000;
      cacheUtils.set(cacheKey, data, ttl);
    }
    
    return data;
  } catch (error) {
    console.error('Error loading pages data:', error);
    return [];
  }
};

// Load pages data
const pagesData = loadPagesData();

// Filter top-level pages for navigation
const topLevelPages = pagesData.filter(page => (page.url.match(/\//g) || []).length === 1);

// Special case for components page
app.get('/components', (req, res) => {
  const componentsPage = pagesData.find(page => page.url === '/components');
  res.render('components', {
    title: componentsPage.title,
    content: componentsPage.content,
    pages: topLevelPages,
    layout: 'layout' // Explicitly set layout
  });
});

// API Routes
const apiRouter = express.Router();

// Add JSON parsing middleware for API routes
apiRouter.use(express.json());

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment,
    node_version: process.version
  });
});

// Application info endpoint
apiRouter.get('/info', (req, res) => {
  res.json({
    name: process.env.SITE_NAME || 'Bootstrap 5 + Express.js Starter Kit',
    version: '1.0.0',
    environment,
    timestamp: new Date(),
    features: [
      'Bootstrap 5',
      'Express.js',
      'EJS Templates',
      'SASS/SCSS',
      'PWA Support',
      'Security Headers',
      'Testing Suite'
    ]
  });
});

// Pages API endpoint
apiRouter.get('/pages', (req, res) => {
  res.json({
    total: pagesData.length,
    pages: pagesData.map(page => ({
      title: page.title,
      url: page.url,
      template: page.template,
      description: page.content?.text || ''
    }))
  });
});

// Contact form endpoint
apiRouter.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // Basic validation
  const errors = [];
  if (!name || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email address is required');
  }
  if (!message || message.trim().length < 10) {
    errors.push('Message is required and must be at least 10 characters');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  
  // In a real app, you'd save to database or send email
  console.log('Contact form submission:', { name, email, message });
  
  res.json({
    success: true,
    message: 'Thank you for your message! We\'ll get back to you soon.',
    timestamp: new Date()
  });
});

// Search endpoint (example)
apiRouter.get('/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  
  // Simple search through pages
  const results = pagesData.filter(page => 
    page.title.toLowerCase().includes(q.toLowerCase()) ||
    (page.content?.text && page.content.text.toLowerCase().includes(q.toLowerCase()))
  );
  
  res.json({
    query: q,
    total: results.length,
    results: results.map(page => ({
      title: page.title,
      url: page.url,
      snippet: page.content?.text?.substring(0, 200) + '...' || ''
    }))
  });
});

// Mount API router
app.use('/api', apiRouter);

// IMPORTANT: Define the page routes BEFORE the 404 handler
// Dynamically generate routes based on pages.json
pagesData.forEach(page => {
  app.get(page.url, (req, res) => {
    res.render(page.template, {
      title: page.title,
      content: page.content,
      pages: topLevelPages
    });
  });
});

// Custom 404 page - This needs to come AFTER the page routes
app.use((req, res) => {
  res.status(404).render('error-404', {
    title: '404 - Page Not Found',
    content: {
      heading: '<i class="bi bi-exclamation-circle"></i> Page Not Found',
      text: 'Sorry, the page you are looking for does not exist.',
      body: '<div class="alert alert-warning"><p>The page you requested could not be found. Please check the URL or go back to the <a href="/" class="alert-link">home page</a>.</p></div>'
    },
    pages: topLevelPages
  });
});

// Error handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).render('page', {
    title: 'Error',
    content: {
      heading: '<i class="bi bi-exclamation-triangle"></i> Server Error',
      text: 'Sorry, something went wrong on our end.',
      body: '<div class="alert alert-danger">Our team has been notified. Please try again later.</div>'
    },
    pages: topLevelPages
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}/`);
  
  // Initialize plugins after server starts
  await initializePlugins();
  
  // Execute app start hook
  try {
    await pluginManager.executeHook(PLUGIN_HOOKS.APP_AFTER_START, app);
  } catch (error) {
    console.error('Plugin hook error:', error.message);
  }
});

// Export the app for testing
module.exports = { app };