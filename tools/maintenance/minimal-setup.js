#!/usr/bin/env node

/**
 * Minimal Setup Script
 * Creates a simplified version of the project for beginners
 */

const fs = require('fs');

console.log('🚀 Setting up minimal configuration...\n');

// Create minimal package.json scripts
const minimalScripts = {
  "start": "node index.js",
  "dev": "nodemon index.js",
  "build": "npm run build-css",
  "build-css": "sass scss/main.scss public/css/styles.css",
  "watch-css": "sass --watch scss/main.scss:public/css/styles.css",
  "start:dev": "npm-run-all --parallel watch-css dev"
};

// Create minimal .gitignore
const minimalGitignore = `
node_modules/
.env
.DS_Store
*.log
coverage/
`;

// Create minimal README
const minimalReadme = `# My Web Project

A simple web application built with Express.js and Bootstrap.

## Quick Start

\`\`\`bash
npm install
npm run start:dev
\`\`\`

Open http://localhost:3000 in your browser.

## Files to Edit

- \`data/pages.json\` - Page content
- \`scss/main.scss\` - Styles
- \`views/layout.ejs\` - Page layout
- \`index.js\` - Server routes

## Commands

- \`npm run start:dev\` - Development server
- \`npm run build\` - Build for production
- \`npm run watch-css\` - Watch SASS files
`;

// Create minimal index.js
const minimalIndex = `const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('page', { 
    title: 'Home',
    content: 'Welcome to your new web application!'
  });
});

app.get('/about', (req, res) => {
  res.render('page', { 
    title: 'About',
    content: 'This is the about page.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`;

// Create minimal layout.ejs
const minimalLayout = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %> - My Web App</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/styles.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <a class="navbar-brand" href="/">My Web App</a>
            <div class="navbar-nav">
                <a class="nav-link" href="/">Home</a>
                <a class="nav-link" href="/about">About</a>
            </div>
        </div>
    </nav>

    <main class="container mt-4">
        <%- body %>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

// Create minimal page.ejs
const minimalPage = `<div class="row">
    <div class="col-12">
        <h1><%= title %></h1>
        <p><%= content %></p>
    </div>
</div>`;

// Create minimal SASS
const minimalSass = `// Custom styles
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.navbar-brand {
    font-weight: bold;
}

main {
    min-height: 70vh;
}`;

// Create minimal package.json
const minimalPackageJson = {
  "name": "my-web-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": minimalScripts,
  "dependencies": {
    "express": "^5.1.0",
    "express-ejs-layouts": "^2.5.1",
    "ejs": "^3.1.10"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "npm-run-all": "^4.1.5",
    "sass": "^1.89.2"
  }
};

// Function to create directories
function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

// Function to write files
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created file: ${filePath}`);
}

try {
  // Create minimal directory structure
  createDir('views');
  createDir('public/css');
  createDir('scss');

  // Write minimal files
  writeFile('index.js', minimalIndex);
  writeFile('views/layout.ejs', minimalLayout);
  writeFile('views/page.ejs', minimalPage);
  writeFile('scss/main.scss', minimalSass);
  writeFile('package.json', JSON.stringify(minimalPackageJson, null, 2));
  writeFile('.gitignore', minimalGitignore);
  writeFile('README.md', minimalReadme);

  console.log('\n🎉 Minimal setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run start:dev');
  console.log('3. Open: http://localhost:3000');
  console.log('\n📁 Key files to edit:');
  console.log('- index.js (add routes)');
  console.log('- views/page.ejs (change page layout)');
  console.log('- scss/main.scss (customize styles)');
  console.log('- views/layout.ejs (modify overall layout)');

} catch (error) {
  console.error('❌ Error during setup:', error.message);
  process.exit(1);
} 