const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourceDir = path.join(__dirname, '..', 'node_modules', 'bootstrap-icons', 'font');
const destDir = path.join(__dirname, '..', 'public', 'fonts', 'bootstrap-icons');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);
}

// Function to copy files recursively
function copyFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
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
console.log('Copying Bootstrap Icons to public/fonts/bootstrap-icons...');
copyFiles(sourceDir, destDir);
console.log('Bootstrap Icons copied successfully!');