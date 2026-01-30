# Development Tools

This directory contains all development tools organized by function for the JsBootSpark project. The tools structure provides organized, maintainable, and automated development workflows across build processes, SEO optimization, git analysis, and maintenance tasks.

## Architecture Overview

The tools structure implements a **function-based organizational approach** where tools are grouped by their primary purpose rather than technology or language. This promotes:

- **Clear separation of concerns**
- **Easy discoverability and maintenance**
- **Consistent integration patterns**
- **Centralized output management**

## Directory Structure

```text
tools/
├── build/          # Build system tools and utilities
├── seo/            # SEO validation and audit tools  
├── git/            # Git analysis and reporting tools
├── maintenance/    # Maintenance and monitoring tools
└── README.md       # This documentation
```

## Quick Start

### Build Tools

```bash
# Full production build
npm run build

# Selective builds
npm run build:scss    # SCSS compilation only
npm run build:pug     # PUG template compilation only

# Clean build artifacts
npm run clean

# Start development server
npm run start
```

### SEO and Audit Tools

```bash
# Run SEO validation
npm run seo:audit

# Run accessibility checks
npm run audit:seo

# Check SSL certificates
npm run audit:ssl

# Run all audits
npm run audit:all
```

### Git Analysis

```bash
# Generate git activity report
npm run report:git
```

### Maintenance Tools

```bash
# Generate monthly maintenance report
npm run report:monthly

# Apply automatic fixes
npm run fix:auto

# Security audit
npm run security-audit

# Dependency analysis
npm run analyze:deps
```

## Tool Categories

### 🔨 Build Tools (`/tools/build/`)

**Purpose**: Unified build system with caching, performance tracking, and parallel execution capabilities.

#### Main Components

- **`build.js`** - Main build orchestrator with command-line argument parsing
- **`build-config.js`** - Environment-specific settings and path configuration
- **`clean.js`** - Clean build artifacts (moved from `scripts/clean-docs.js`)
- **`copy-icons.js`** - Copy Bootstrap Icons to build directory
- **`copy-static-assets.js`** - Copy static assets from public to docs
- **`generate-static-site.js`** - Generate static site from EJS templates
- **`start.js`** - Development server starter

#### Features

- **Command-line arguments**: `--pug`, `--scss`, `--scripts`, `--assets`
- **Performance tracking**: Build time reporting and metrics
- **Error handling**: Graceful failure with detailed logging
- **Artifact generation**: Build reports in `temp/reports/`

#### Usage Examples

```bash
# Build everything
npm run build

# Build only SCSS
npm run build:scss

# Build only assets
npm run build -- --assets

# Clean and rebuild
npm run clean && npm run build
```

### 🔍 SEO Tools (`/tools/seo/`)

**Purpose**: Comprehensive SEO validation, accessibility testing, and SSL monitoring.

#### Main Components

- **`seo-validation-report.js`** - SEO validation report generator
- **`seo-a11y-checks.mjs`** - Accessibility checker with WCAG compliance
- **`ssl-expiry.ts`** - SSL certificate monitor (TypeScript)

#### Features

- **Multiple output formats**: JSON, HTML, console
- **WCAG compliance**: Automated accessibility testing
- **SSL monitoring**: Certificate expiration checking
- **Report generation**: Centralized output to `temp/reports/`

#### Usage Examples

```bash
# Run comprehensive SEO audit
npm run seo:audit

# Check accessibility compliance
npm run audit:seo

# Monitor SSL certificates
npm run audit:ssl

# Run all SEO and security audits
npm run audit:all
```

### 📊 Git Analysis Tools (`/tools/git/`)

**Purpose**: Repository activity analysis, developer productivity metrics, and GitHub best practices assessment.

#### Main Components

- **`report-git-simple.mjs`** - Git activity reporter with metrics

#### Features (Planned)

- **Commit analysis**: Author attribution and patterns
- **DORA metrics**: Deployment frequency, lead time, etc.
- **Team collaboration**: Review patterns and collaboration metrics
- **File hotspots**: Modification frequency analysis

#### Usage Examples

```bash
# Generate basic git report
npm run report:git
```

### 🔧 Maintenance Tools (`/tools/maintenance/`)

**Purpose**: Automated maintenance tasks, code quality analysis, and dependency management.

#### Main Components

- **`report-monthly.mjs`** - Monthly maintenance reporter
- **`apply-autofixes.mjs`** - Automated fix application
- **`security-audit.js`** - Security audit (moved from scripts)
- **`dev-helper.js`** - Development helper utilities
- **`optimize-dependencies.js`** - Dependency optimization
- **`test-dependencies.js`** - Dependency testing
- **`configure-project.js`** - Interactive project configuration
- **`minimal-setup.js`** - Minimal project setup

#### Features

- **Monthly reporting**: Automated maintenance summaries
- **Security scanning**: Vulnerability detection
- **Dependency management**: Update recommendations
- **Configuration management**: Interactive setup wizards

#### Usage Examples

```bash
# Generate monthly maintenance report
npm run report:monthly

# Run security audit
npm run security-audit

# Analyze dependencies
npm run analyze:deps

# Interactive configuration
npm run configure

# Apply automated fixes
npm run fix:auto
```

## Output Management

### Directory Structure

```text
repository-root/
├── tools/                    # All development tools
├── temp/                     # Temporary outputs (gitignored)
│   └── reports/             # Tool-generated reports
├── artifacts/               # CI/CD artifacts (gitignored)
└── reports/                 # Permanent reports (tracked)
```

### Report Types

- **Build reports**: Performance metrics and task results
- **SEO reports**: Validation results and recommendations
- **Security reports**: Vulnerability assessments
- **Git reports**: Repository activity and metrics
- **Maintenance reports**: Monthly summaries and action items

### .gitignore Configuration

The following directories are excluded from version control:

```gitignore
# Temporary files and generated reports
temp/
!temp/**/.gitkeep
artifacts/
!artifacts/**/.gitkeep
.build-cache/
lhci/
```

## Configuration

### Build Configuration

The build system uses `tools/build/build-config.js` for:

- **Environment detection**: Development, production, CI
- **Path configuration**: Source, build, output directories
- **Cache settings**: TTL, cleanup policies
- **Performance tracking**: Metrics and reporting
- **Optimization settings**: Minification, source maps

### Environment Variables

```bash
NODE_ENV=development|production|test    # Environment mode
```

## Integration with npm Scripts

All tools are integrated through npm scripts in `package.json`:

```json
{
  "scripts": {
    "build": "node tools/build/build.js",
    "clean": "node tools/build/clean.js",
    "seo:audit": "node tools/seo/seo-validation-report.js",
    "report:git": "node tools/git/report-git-simple.mjs",
    "report:monthly": "node tools/maintenance/report-monthly.mjs"
  }
}
```

## Development Workflow

1. **Clean previous builds**: `npm run clean`
2. **Run build**: `npm run build`
3. **Check quality**: `npm run audit:all`
4. **Generate reports**: `npm run report:monthly`
5. **Apply fixes**: `npm run fix:auto`

## Extending the Tools

### Adding New Tools

1. Create the tool in the appropriate category directory
2. Add npm script to `package.json`
3. Update this README with usage information
4. Follow the existing patterns for:
   - Command-line argument parsing
   - Error handling and logging
   - Report generation to `temp/reports/`
   - Configuration integration

### Best Practices

- **Use consistent logging**: Console messages with emojis for clarity
- **Generate reports**: Always output JSON reports for automation
- **Handle errors gracefully**: Provide actionable error messages
- **Support command-line flags**: Enable selective execution
- **Follow path conventions**: Use proper relative paths from tool location

## Troubleshooting

### Common Issues

1. **Path resolution errors**: Ensure scripts use correct relative paths from their location
2. **Permission issues**: Check file system permissions for temp directories
3. **Missing dependencies**: Run `npm install` to ensure all packages are available
4. **Build failures**: Check build logs in `temp/reports/build-report.json`

### Debugging

- Use `--verbose` flags where available
- Check report files in `temp/reports/`
- Review npm script definitions in `package.json`
- Verify environment variables and configuration

## Future Enhancements

- **Parallel execution**: Implement true parallel build processing
- **Advanced caching**: Content-based cache invalidation
- **Enhanced reporting**: Rich HTML reports with visualizations
- **GitHub Actions integration**: Automated workflow triggers
- **Performance optimization**: Build time reduction strategies

## Contributing

When contributing to the tools structure:

1. Follow the function-based organization
2. Add appropriate documentation
3. Include tests for new functionality
4. Update npm scripts and this README
5. Ensure compatibility with existing tools

---

For more information about the overall project structure, see the main [README.md](../README.md).
