// Environment configuration
require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
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

// Global cache for songs data
let songsCache = null;
let songsLastLoaded = null;
const SONGS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

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
          'https://cdnjs.cloudflare.com', // Still needed for highlight.js
          `'nonce-${cspNonce}'`, // Allow scripts with this request's nonce
          "'unsafe-inline'" // Temporarily allow inline scripts for debugging
        ],
        styleSrc: [
          "'self'", 
          'https://cdnjs.cloudflare.com', // Still needed for highlight.js
          'https://fonts.googleapis.com',
          "'unsafe-inline'" // Required for dynamic theme switching
        ],
        fontSrc: [
          "'self'", 
          'https://fonts.gstatic.com'
        ],
        imgSrc: [
          "'self'", 
          'data:', 
          'https://cdn.jsdelivr.net',
          'https://i.ytimg.com'  // Allow YouTube thumbnails
        ],
        connectSrc: [
          "'self'", 
          "https://cdnjs.cloudflare.com",
          "https://i.ytimg.com"  // Allow service worker to cache YouTube thumbnails
        ],
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

// Serve data directory for development (JSON files)
// This allows data-tables to load the JSON file in dev mode
app.use('/data', express.static(path.join(__dirname, '..', 'docs', 'data')));

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
    name: process.env.SITE_NAME || 'JsBootSpark',
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
  // Use a simpler, non-polynomial regex for email validation
  if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
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

// Rate limiter for YouTube songs endpoint
const youtubeSongsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// YouTube Top 100 Songs endpoint
apiRouter.get('/youtube-songs', youtubeSongsLimiter, (req, res) => {
  try {
    const csvFilePath = path.join(__dirname, 'data', 'youtube-top-100-songs-2025.csv');
    
    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      return res.status(404).json({ error: 'CSV file not found' });
    }

    const songs = [];
    const searchTerm = (req.query.search || '').toLowerCase();

    // Use csv-parser for proper CSV parsing
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Clean and process the row data
        const song = {
          rank: songs.length + 1,
          title: cleanCsvValue(row.title || row.fulltitle || 'Unknown Title'),
          channel: cleanCsvValue(row.channel || 'Unknown Channel'),
          views: formatViews(row.view_count),
          duration: formatDuration(row.duration_string || row.duration),
          followers: formatNumber(row.channel_follower_count),
          category: cleanCsvValue(row.categories || 'Music'),
          description: cleanDescription(row.description || '')
        };

        // Apply search filter if provided
        if (!searchTerm || 
            song.title.toLowerCase().includes(searchTerm) ||
            song.channel.toLowerCase().includes(searchTerm) ||
            song.category.toLowerCase().includes(searchTerm)) {
          songs.push(song);
        }
      })
      .on('end', () => {
        console.log(`✅ Loaded ${songs.length} songs from CSV`);
        res.json(songs);
      })
      .on('error', (error) => {
        console.error('❌ CSV parsing error:', error);
        res.status(500).json({ error: 'Failed to parse CSV file' });
      });

  } catch (error) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions for data cleaning and formatting
function cleanCsvValue(value) {
  if (!value || value === 'undefined' || value === 'null') return '';
  return String(value).trim().replace(/^"|"$/g, '');
}

function cleanDescription(description) {
  if (!description || description === 'undefined' || description === 'null') return '';
  // Limit description length and clean up
  return String(description).trim().substring(0, 200) + (description.length > 200 ? '...' : '');
}

function formatViews(viewCount) {
  if (!viewCount || viewCount === 'undefined' || viewCount === 'null') return 'N/A';
  
  const num = parseInt(viewCount);
  if (isNaN(num)) return 'N/A';
  
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function formatNumber(number) {
  if (!number || number === 'undefined' || number === 'null') return 'N/A';
  
  const num = parseInt(number);
  if (isNaN(num)) return 'N/A';
  
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function formatDuration(duration) {
  if (!duration || duration === 'undefined' || duration === 'null') return 'N/A';
  
  // If it's already formatted (contains :), return as is
  if (String(duration).includes(':')) {
    return duration;
  }
  
  // If it's a number (seconds), convert to MM:SS format
  const seconds = parseInt(duration);
  if (isNaN(seconds)) return 'N/A';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Load songs into cache
async function loadSongsCache() {
  return new Promise((resolve, reject) => {
    const csvFilePath = path.join(__dirname, 'data', 'youtube-top-100-songs-2025.csv');
    
    if (!fs.existsSync(csvFilePath)) {
      reject(new Error('CSV file not found'));
      return;
    }

    const songs = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        songs.push(row);
      })
      .on('end', () => {
        songsCache = songs;
        songsLastLoaded = Date.now();
        console.log(`✅ Loaded ${songs.length} songs into cache`);
        resolve(songs);
      })
      .on('error', (error) => {
        console.error('❌ CSV loading error:', error);
        reject(error);
      });
  });
}

// Get songs from cache or load if not cached
async function getSongs() {
  const now = Date.now();
  
  // Check if cache is valid
  if (songsCache && songsLastLoaded && (now - songsLastLoaded) < SONGS_CACHE_TTL) {
    return songsCache;
  }
  
  // Load fresh data
  try {
    return await loadSongsCache();
  } catch (error) {
    console.error('❌ Failed to load songs:', error);
    return songsCache || []; // Return cached data if available, otherwise empty array
  }
}

// Song detail endpoint - get individual song by rank/index
apiRouter.get('/song/:id', async (req, res) => {
  try {
    const songId = parseInt(req.params.id);
    
    if (isNaN(songId) || songId < 1) {
      return res.status(400).json({ error: 'Invalid song ID' });
    }

    // Get songs from cache
    const songs = await getSongs();
    
    if (songs.length === 0) {
      return res.status(500).json({ error: 'No songs available' });
    }

    if (songId > songs.length) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Get the song (array is 0-indexed, but IDs are 1-indexed)
    const row = songs[songId - 1];
    
    // Return all available data for detail view
    const foundSong = {
      id: songId,
      rank: songId,
      title: cleanCsvValue(row.title || row.fulltitle || 'Unknown Title'),
      fullTitle: cleanCsvValue(row.fulltitle || row.title || 'Unknown Title'),
      description: cleanCsvValue(row.description || ''),
      channel: cleanCsvValue(row.channel || 'Unknown Channel'),
      channelUrl: cleanCsvValue(row.channel_url || ''),
      views: formatViews(row.view_count),
      viewsRaw: parseInt(row.view_count) || 0,
      duration: formatDuration(row.duration_string || row.duration),
      durationRaw: parseInt(row.duration) || 0,
      followers: formatNumber(row.channel_follower_count),
      followersRaw: parseInt(row.channel_follower_count) || 0,
      category: cleanCsvValue(row.categories || 'Music'),
      tags: cleanCsvValue(row.tags || ''),
      liveStatus: cleanCsvValue(row.live_status || ''),
      thumbnail: cleanCsvValue(row.thumbnail || ''),
      // Parse description for additional metadata
      links: extractLinksFromDescription(row.description || ''),
      socialMedia: extractSocialMediaFromDescription(row.description || ''),
      releaseInfo: extractReleaseInfoFromDescription(row.description || '')
    };

    res.json(foundSong);

  } catch (error) {
    console.error('❌ Song detail API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions for parsing description metadata
function extractLinksFromDescription(description) {
  const links = [];
  const urlRegex = /https?:\/\/[^\s\n]+/g;
  const matches = description.match(urlRegex);
  if (matches) {
    matches.forEach(url => {
      links.push({
        url: url.trim(),
        type: categorizeLink(url),
        domain: new URL(url).hostname
      });
    });
  }
  return links;
}

function extractSocialMediaFromDescription(description) {
  const socialMedia = [];
  const socialPatterns = {
    instagram: /https?:\/\/(?:www\.)?instagram\.com\/[^\s\n]+/g,
    tiktok: /https?:\/\/(?:www\.)?tiktok\.com\/[^\s\n]+/g,
    twitter: /https?:\/\/(?:www\.|x\.)?(?:twitter\.com|x\.com)\/[^\s\n]+/g,
    facebook: /https?:\/\/(?:www\.)?facebook\.com\/[^\s\n]+/g,
    youtube: /https?:\/\/(?:www\.)?youtube\.com\/[^\s\n]+/g,
    spotify: /https?:\/\/(?:open\.)?spotify\.com\/[^\s\n]+/g,
    apple: /https?:\/\/music\.apple\.com\/[^\s\n]+/g
  };

  Object.entries(socialPatterns).forEach(([platform, regex]) => {
    const matches = description.match(regex);
    if (matches) {
      matches.forEach(url => {
        socialMedia.push({
          platform: platform,
          url: url.trim(),
          icon: getSocialMediaIcon(platform)
        });
      });
    }
  });

  return socialMedia;
}

function extractReleaseInfoFromDescription(description) {
  const releaseInfo = {};
  
  // Look for streaming/download mentions
  if (description.toLowerCase().includes('download') || description.toLowerCase().includes('stream')) {
    releaseInfo.hasStreamingLinks = true;
  }
  
  // Look for album mentions
  const albumMatch = description.match(/album[:\s]+([^\n]+)/i);
  if (albumMatch) {
    releaseInfo.album = albumMatch[1].trim();
  }
  
  // Look for vinyl/CD mentions
  if (description.toLowerCase().includes('vinyl') || description.toLowerCase().includes('cd')) {
    releaseInfo.hasPhysicalRelease = true;
  }

  return releaseInfo;
}

function categorizeLink(url) {
  // Properly validate URL and check against specific domains (not just substring matches)
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check against specific domains using endsWith to prevent substring false positives
    if (hostname.endsWith('spotify.com') || hostname === 'spotify.com') return 'Spotify';
    if (hostname.endsWith('apple.com') || hostname === 'apple.com') return 'Apple Music';
    if (hostname.endsWith('youtube.com') || hostname === 'youtube.com' || hostname.endsWith('youtu.be') || hostname === 'youtu.be') return 'YouTube';
    if (hostname.endsWith('instagram.com') || hostname === 'instagram.com') return 'Instagram';
    if (hostname.endsWith('tiktok.com') || hostname === 'tiktok.com') return 'TikTok';
    if (hostname.endsWith('twitter.com') || hostname === 'twitter.com' || hostname === 'x.com' || hostname.endsWith('x.com')) return 'Twitter/X';
    if (hostname.endsWith('facebook.com') || hostname === 'facebook.com') return 'Facebook';
    if (hostname.endsWith('lnk.to') || hostname === 'lnk.to') return 'Universal Link';
    return 'Website';
  } catch {
    // If URL parsing fails, return default
    return 'Website';
  }
}

function getSocialMediaIcon(platform) {
  const icons = {
    instagram: 'bi-instagram',
    tiktok: 'bi-tiktok',
    twitter: 'bi-twitter-x',
    facebook: 'bi-facebook',
    youtube: 'bi-youtube',
    spotify: 'bi-spotify',
    apple: 'bi-apple'
  };
  return icons[platform] || 'bi-link-45deg';
}

// Mount API router
app.use('/api', apiRouter);

// Song detail page routes (both /song/:id and /songs/:id)
app.get(['/song/:id', '/songs/:id'], (req, res) => {
  res.render('song-detail', {
    title: 'Song Details',
    songId: req.params.id,
    cspNonce: res.locals.cspNonce, // Explicitly pass the nonce
    content: {
      heading: `<i class="bi bi-music-note-beamed"></i> Song Details`,
      text: `Detailed information about song #${req.params.id} from YouTube Top 100`,
      useCustomTemplate: true  // This tells the layout to render the template content
    },
    pages: topLevelPages
  });
});

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
  
  // Initialize songs cache
  try {
    await loadSongsCache();
  } catch (error) {
    console.error('❌ Failed to load songs cache on startup:', error.message);
  }
  
  // Execute app start hook
  try {
    await pluginManager.executeHook(PLUGIN_HOOKS.APP_AFTER_START, app);
  } catch (error) {
    console.error('Plugin hook error:', error.message);
  }
});

// Export the app for testing
module.exports = { app };