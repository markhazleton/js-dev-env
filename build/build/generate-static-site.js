const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Load build info utility
const buildInfo = require('../../src/utils/build-info');

// Load pages data
const pagesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'src/data', 'pages.json'), 'utf-8'));

// Filter top-level pages for navigation
const navPages = pagesData.filter(page => !page.url.includes('/', 1));

// Create docs directory if it doesn't exist
const docsDir = path.join(__dirname, '..', '..', 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
  console.log(`Created directory: ${docsDir}`);
}

// Function to convert absolute paths for GitHub Pages subdirectory deployment
function convertPathsForGitHubPages(html) {
  // For GitHub Pages subdirectory (e.g., /js-dev-env/), keep absolute paths
  // The paths should start with /js-dev-env/ for proper resolution
  const basePath = '/js-dev-env/';
  
  // Convert absolute root paths to include GitHub Pages base path
  let convertedHtml = html
    // CSS and other assets
    .replace(/href="\/css\//g, `href="${basePath}css/`)
    .replace(/href="\/fonts\//g, `href="${basePath}fonts/`)
    .replace(/href="\/js\//g, `href="${basePath}js/`)
    .replace(/src="\/js\//g, `src="${basePath}js/`)
    .replace(/href="\/manifest\.json"/g, `href="${basePath}manifest.json"`)
    .replace(/href="\/favicon\.svg"/g, `href="${basePath}favicon.svg"`)
    .replace(/href="\/favicon\.ico"/g, `href="${basePath}favicon.ico"`)
    .replace(/src="\/images\//g, `src="${basePath}images/`)
    .replace(/src="\/img\//g, `src="${basePath}img/`)
    .replace(/"\/service-worker\.js"/g, `"${basePath}service-worker.js"`);
  
  // Convert navigation links
  // Handle home page link
  convertedHtml = convertedHtml.replace(/href="\/"(?=[\s>])/g, `href="${basePath}"`);
  
  // Handle other page links (e.g., /getting-started -> /js-dev-env/getting-started)
  convertedHtml = convertedHtml.replace(/href="\/([^"/]+)"(?=[\s>])/g, (match, pageName) => {
    return `href="${basePath}${pageName}"`;
  });
  
  return convertedHtml;
}

// Function to render a page
async function renderPage(pageData, isHomePage = false) {
  const viewsDir = path.join(__dirname, '..', '..', 'src/views');
  
  // Generate build info for static site
  buildInfo.generateBuildInfo();
  
  // Prepare data for template
  const templateData = {
    page: pageData,
    pages: navPages,
    currentPath: pageData.url,
    // Add some default values that might be expected
    title: pageData.title,
    content: pageData.content,
    // Add build info for static site
    buildInfo: buildInfo.getBuildInfo(),
    // Add a dummy cspNonce for static site generation
    cspNonce: 'static-site-dummy-nonce'
  };

  try {
    // Determine which template to use
    const templateFile = pageData.template === 'components' ? 'components.ejs' : 'page.ejs';
    const templatePath = path.join(viewsDir, templateFile);
    
    // Read and render the template
    const template = fs.readFileSync(templatePath, 'utf-8');
    
    // Render with layout
    const layoutPath = path.join(viewsDir, 'layout.ejs');
    const layoutTemplate = fs.readFileSync(layoutPath, 'utf-8');
    
    // First render the page content
    const pageContent = await ejs.render(template, templateData, {
      views: viewsDir,
      filename: templatePath
    });
    
    // Then render with layout
    let fullPage = await ejs.render(layoutTemplate, {
      ...templateData,
      body: pageContent
    }, {
      views: viewsDir,
      filename: layoutPath
    });

    // Determine output file name and depth for relative paths
    let fileName;
    if (isHomePage || pageData.url === '/') {
      fileName = 'index.html';
    } else {
      // Create directory structure for nested URLs
      const urlParts = pageData.url.split('/').filter(part => part);
      if (urlParts.length > 0) {
        const dirPath = path.join(docsDir, ...urlParts);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        fileName = path.join(...urlParts, 'index.html');
      } else {
        fileName = 'index.html';
      }
    }

    // Convert absolute paths to relative paths for GitHub Pages
    fullPage = convertPathsForGitHubPages(fullPage);

    // Write the file
    const outputPath = path.join(docsDir, fileName);
    fs.writeFileSync(outputPath, fullPage);
    console.log(`Generated: ${outputPath}`);

  } catch (error) {
    console.error(`Error rendering page ${pageData.url}:`, error);
  }
}

// Generate all pages
async function generateSite() {
  console.log('Generating static site for GitHub Pages...');
  
  for (const page of pagesData) {
    await renderPage(page, page.url === '/');
  }
  
  // Create .nojekyll file for GitHub Pages
  const nojekyllPath = path.join(docsDir, '.nojekyll');
  if (!fs.existsSync(nojekyllPath)) {
    fs.writeFileSync(nojekyllPath, '');
    console.log('Created .nojekyll file for GitHub Pages');
  }
  
  console.log('Static site generation complete!');
}

// Run the generator
if (require.main === module) {
  generateSite().catch(console.error);
}

module.exports = { generateSite, renderPage };
