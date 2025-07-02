const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

// Files to preserve during cleaning
const preserveFiles = ['.nojekyll'];

// Function to recursively delete directory contents
function deleteDirectoryContents(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist, nothing to clean.`);
    return;
  }

  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    // Skip preserved files
    if (preserveFiles.includes(item)) {
      console.log(`Preserving: ${item}`);
      continue;
    }

    const itemPath = path.join(dirPath, item);
    const stat = fs.lstatSync(itemPath);
    
    if (stat.isDirectory()) {
      deleteDirectoryContents(itemPath);
      fs.rmdirSync(itemPath);
      console.log(`Removed directory: ${itemPath}`);
    } else {
      fs.unlinkSync(itemPath);
      console.log(`Removed file: ${itemPath}`);
    }
  }
}

// Clean the docs directory
console.log('Cleaning docs directory...');
deleteDirectoryContents(docsDir);
console.log('Docs directory cleaned successfully!');
