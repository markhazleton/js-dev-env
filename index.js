const express = require('express');
const path = require('path');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');

const app = express();

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

// Read pages.json
const pagesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'pages.json'), 'utf-8'));

// Filter top-level pages for navigation
const topLevelPages = pagesData.filter(page => (page.url.match(/\//g) || []).length === 1);

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
  res.status(404).render('page', {
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