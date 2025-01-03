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

// Read pages.json
const pagesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'pages.json'), 'utf-8'));

// Filter top-level pages (URLs with only one slash '/')
const topLevelPages = pagesData.filter(page => (page.url.match(/\//g) || []).length === 1);

// Dynamically generate routes based on pages.json
pagesData.forEach(page => {
  app.get(page.url, (req, res) => {
    res.render(page.template, {
      title: page.title,            // Pass page title for the <title> tag
      content: page.content,        // Pass the entire content object to the view
      pages: topLevelPages          // Pass top-level pages for navigation
    });
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).render('page', {
    title: '404 - Page Not Found',
    content: {
      heading: '<i class="bi bi-exclamation-circle"></i> Page Not Found',
      text: 'Sorry, the page you are looking for does not exist.',
      body: '<p>Please check the URL or go back to the <a href="/">home page</a>.</p>'
    },
    pages: topLevelPages
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
