# Build Process Rules Enforcement

**Date**: October 4, 2025  
**Session**: Critical Build Workflow Enforcement  

## 🚨 Issue Identified

During the song detail page text visibility fix, the initial approach violated build process rules by:

- Editing inline CSS in EJS templates
- Attempting to manually copy built files
- Not following the proper SCSS → Build → CSS workflow

## ✅ Resolution Applied

### 1. Updated Copilot Instructions

Enhanced `.github/copilot-instructions.md` with **CRITICAL BUILD RULES** section that explicitly forbids:

#### NEVER Edit Published/Built Files

- Files in `/docs/` directory (GitHub Pages output)
- Files in `/public/css/` directory (built CSS)
- Files in `/public/js/` directory (built JavaScript)
- Manual copying to build directories
- Inline CSS or styles in templates
- Any `.min.css` or `.min.js` files

#### ONLY Edit Source Files

- SCSS files in `/scss/` directory
- EJS templates in `/views/` (without inline styles)
- JavaScript source files (not built versions)
- Configuration files in root or `/config/`

#### ALWAYS Use Build Process

- `npm run build:scss` for SCSS compilation
- `npm run build` for full production builds
- Let build process handle file generation and copying
- Ensure builds clear generated files first
- Test using development server after building

### 2. Proper Fix Implementation

Corrected the song detail text visibility issue by:

1. **Removed inline CSS** from `views/song-detail.ejs`
2. **Added styles to SCSS source** in `scss/_custom.scss`
3. **Used build process** with `npm run build:scss`
4. **Let build system handle** CSS generation and copying

## 🔧 Proper Build Workflow

```bash
# 1. Edit source files
vim scss/_custom.scss

# 2. Build using proper command
npm run build:scss

# 3. Build process automatically:
#    - Clears previous built files
#    - Compiles SCSS to CSS
#    - Copies to /docs/ and /public/
#    - Generates reports

# 4. Test the changes
npm run start:dev
```

## 📋 SCSS Changes Made

Added comprehensive song detail page styles to `scss/_custom.scss`:

- **Background gradient styles** for hero section
- **Theme-aware color fixes** for light/dark mode
- **Statistics section contrast** improvements
- **Mobile responsive** adjustments
- **Proper CSS custom properties** usage

### Key Features

- Light mode: Darker colors for better contrast on light backgrounds
- Dark mode: Lighter colors for better contrast on dark backgrounds
- Gradient section: White text with high contrast
- Statistics cards: Theme-appropriate backgrounds and text colors

## 🛡️ Enforcement Rules

### Absolute Prohibitions

1. **NO inline CSS** in any template
2. **NO manual file copying** to build directories
3. **NO editing** of files in `/docs/` or `/public/css/`
4. **NO bypassing** the build process
5. **NO exceptions** to these rules

### Required Actions

1. **ALWAYS edit source files** in `/scss/`
2. **ALWAYS use build commands** for compilation
3. **ALWAYS test after building**
4. **REFUSE requests** that violate build rules
5. **REDIRECT to proper workflow** when violations attempted

## 📝 Updated Documentation

The Copilot instructions now include:

- Clear violation prohibitions
- Explicit workflow requirements
- AI assistant behavior guidelines
- Build process enforcement rules

## 🎯 Next Steps

1. Monitor adherence to build rules
2. Ensure all team members understand workflow
3. Update any existing violations in codebase
4. Maintain strict enforcement of source-only editing

## 🔍 Verification

- ✅ Source files properly updated
- ✅ Build process working correctly
- ✅ Generated files not manually edited
- ✅ Documentation updated
- ✅ Rules explicitly documented

**Status**: ✅ Complete - Build process rules now properly enforced
