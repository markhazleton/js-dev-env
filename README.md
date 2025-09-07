# Asset Organization

This directory structure is automatically copied to `/docs` during the build process.

## Directory Structure

- `/images/logos/` - Company/project logos
- `/images/screenshots/` - Application screenshots  
- `/images/` - General images
- `/documents/` - PDFs, downloads, documentation files

## Usage in Templates

Reference assets using relative paths:
- Root pages: `./images/logo.png`
- Nested pages: `../images/logo.png`

The build process automatically handles path conversion for GitHub Pages deployment.
