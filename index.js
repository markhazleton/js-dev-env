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
const { TRUSTED_RESOURCES } = require('./utils/security');

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
        // Add integrity requirement for external resources
        requireSriFor: ['script', 'style']
      }
    },
    // Add additional security headers
    crossOriginEmbedderPolicy: false, // Set to true for stricter security if needed
    crossOriginResourcePolicy: { policy: "cross-origin" }
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

// Sample API endpoint
apiRouter.get('/info', (req, res) => {
  res.json({
    name: process.env.SITE_NAME || 'Bootstrap 5 + Express.js Starter Kit',
    version: '1.0.0',
    environment,
    timestamp: new Date()
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
app.use((req, res, next) => {
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
app.use((err, req, res, next) => {
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
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Export the app for testing
module.exports = { app };