const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

console.log('🎵 Generating static song detail pages...');

// Load build info utility
const buildInfo = require('../../src/utils/build-info');

// Load pages data for navigation
const pagesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'src/data', 'pages.json'), 'utf-8'));
const navPages = pagesData.filter(page => !page.url.includes('/', 1));

// Load YouTube songs data
const songsJsonPath = path.join(__dirname, '..', '..', 'docs', 'data', 'youtube-top-100-songs-2025.json');

if (!fs.existsSync(songsJsonPath)) {
  console.error('❌ YouTube songs JSON file not found. Run convert-youtube-data.js first.');
  process.exit(1);
}

const songs = JSON.parse(fs.readFileSync(songsJsonPath, 'utf-8'));
console.log(`📊 Found ${songs.length} songs to generate pages for`);

const viewsDir = path.join(__dirname, '..', '..', 'src/views');
const docsDir = path.join(__dirname, '..', '..', 'docs');

// Function to convert absolute paths for GitHub Pages subdirectory deployment
function convertPathsForGitHubPages(html) {
  const basePath = '/js-dev-env/';
  
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
  convertedHtml = convertedHtml.replace(/href="\/"(?=[\s>])/g, `href="${basePath}"`);
  convertedHtml = convertedHtml.replace(/href="\/([^"/]+)"(?=[\s>])/g, (match, pageName) => {
    return `href="${basePath}${pageName}"`;
  });
  
  return convertedHtml;
}

// Function to render a song page
async function renderSongPage(songIndex) {
  const song = songs[songIndex];
  const rank = songIndex + 1;
  
  // Generate build info for static site
  buildInfo.generateBuildInfo();
  
  // Prepare data for template
  const templateData = {
    title: `${song.title} - Song #${rank}`,
    songId: rank,
    pages: navPages,
    currentPath: `/song/${rank}`,
    content: {
      heading: `<i class="bi bi-music-note-beamed"></i> Song Details`,
      text: `Detailed information about song #${rank} from YouTube Top 100`,
      useCustomTemplate: true
    },
    buildInfo: buildInfo.getBuildInfo(),
    cspNonce: 'static-site-dummy-nonce'
  };

  try {
    // Read song-detail template
    const templatePath = path.join(viewsDir, 'song-detail.ejs');
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

    // Create directory structure
    const songDir = path.join(docsDir, 'song', rank.toString());
    if (!fs.existsSync(songDir)) {
      fs.mkdirSync(songDir, { recursive: true });
    }

    // Convert paths for GitHub Pages
    fullPage = convertPathsForGitHubPages(fullPage);

    // Write the file
    const outputPath = path.join(songDir, 'index.html');
    fs.writeFileSync(outputPath, fullPage);
    
    // Log progress every 10 songs
    if (rank % 10 === 0 || rank === 1 || rank === songs.length) {
      console.log(`✅ Generated ${rank}/${songs.length}: ${song.title.substring(0, 40)}...`);
    }

  } catch (error) {
    console.error(`❌ Error rendering song page ${rank}:`, error.message);
  }
}

// Generate all song pages
async function generateSongPages() {
  console.log('🚀 Starting song page generation...');
  
  for (let i = 0; i < songs.length; i++) {
    await renderSongPage(i);
  }
  
  console.log(`\n✅ Successfully generated ${songs.length} song detail pages!`);
  console.log(`📁 Pages location: ${path.join(docsDir, 'song')}`);
}

// Run the generator
if (require.main === module) {
  generateSongPages().catch(error => {
    console.error('❌ Song page generation failed:', error);
    process.exit(1);
  });
}

module.exports = { generateSongPages };
