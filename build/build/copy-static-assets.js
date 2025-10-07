const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourceDir = path.join(__dirname, '..', '..', 'src/public');
const destDir = path.join(__dirname, '..', '..', 'docs');

// Files and directories to exclude from copying (we'll handle CSS and fonts separately)
const excludeItems = ['css', 'fonts'];

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);
}

// Function to copy files recursively
function copyFiles(src, dest, exclude = []) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    // Skip excluded items
    if (exclude.includes(entry.name)) {
      console.log(`Skipping: ${entry.name}`);
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyFiles(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// Start copying
console.log('Copying static assets from public to docs...');
copyFiles(sourceDir, destDir, excludeItems);
console.log('Static assets copied successfully!');
