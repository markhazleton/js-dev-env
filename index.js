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
app.set('layout', 'layout');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Load pages from pages.json
let pages = [];
fs.readFile(path.join(__dirname, 'data', 'pages.json'), 'utf-8', (err, data) => {
  if (err) {
    console.error("Error reading pages.json:", err);
    return;
  }
  pages = JSON.parse(data);
});

// Dynamic route handling based on pages.json
app.get('*', (req, res) => {
  const page = pages.find(p => p.url === req.url);
  if (page) {
    res.render(page.template, {
      title: page.title,
      content: page.content,
      pages // Pass pages for dynamic navigation
    });
  } else {
    res.status(404).send('Page not found');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
