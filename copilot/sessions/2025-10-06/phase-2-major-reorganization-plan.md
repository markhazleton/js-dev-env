# Phase 2: Major Repository Reorganization Plan

**Session Date**: October 6, 2025
**Status**: Planning Phase
**Goal**: Organize repository into 4 primary folders

## 🎯 Proposed Structure

```
js-dev-env/
├── /src/           # All source files (BUILD INPUTS)
├── /docs/          # Published site (BUILD OUTPUT)
├── /build/         # Build scripts and utilities
├── /copilot/       # AI-generated documentation
└── [config files]  # Essential config files only
```

## 📊 Current vs. Proposed Mapping

### Comprehensive Folder Analysis

| Current Location | New Location | Type | Rationale |
|-----------------|--------------|------|-----------|
| `/config/` | `/src/config/` | Source | Application configuration |
| `/data/` | `/src/data/` | Source | JSON CMS content |
| `/plugins/` | `/src/plugins/` | Source | Plugin system code |
| `/public/` | `/src/public/` | Source | Development static assets |
| `/scss/` | `/src/scss/` | Source | SASS source files |
| `/templates/` | `/src/templates/` | Source | Template generation |
| `/tests/` | `/src/tests/` | Source | Test suite |
| `/utils/` | `/src/utils/` | Source | Utility modules |
| `/views/` | `/src/views/` | Source | EJS templates |
| `index.js` | `/src/index.js` | Source | Main application entry |
| `healthcheck.js` | `/src/healthcheck.js` | Source | Health check endpoint |
| `plugins.config.js` | `/src/plugins.config.js` | Source | Plugin configuration |
| `/tools/` | `/build/` | Build | All build tools consolidated |
| `/docs/` | `/docs/` | Output | **KEEP** - Published site |
| `/copilot/` | `/copilot/` | Docs | **KEEP** - AI documentation |

### Files That Stay in Root

**Essential Configuration** (Must stay in root for tooling):

- `.dockerignore` - Docker needs in root
- `.env` - Environment variables
- `.env.example` - Environment template
- `.eslintignore` - ESLint needs in root
- `.gitignore` - Git needs in root
- `.prettierignore` - Prettier needs in root
- `.prettierrc.json` - Prettier config in root
- `docker-compose.yml` - Docker needs in root
- `Dockerfile` - Docker needs in root
- `eslint.config.mjs` - ESLint needs in root
- `jest.config.js` - Jest needs in root
- `package.json` - npm needs in root
- `package-lock.json` - npm needs in root

**Documentation** (User-facing):

- `README.md` - Primary documentation
- `LICENSE` - Legal requirement
- `SECURITY.md` - GitHub standard
- `CONTRIBUTING.md` - Contributor guide

**Generated/Ignored Folders**:

- `.git/` - Git repository
- `.github/` - GitHub Actions/templates
- `node_modules/` - Dependencies (gitignored)
- `coverage/` - Test coverage (gitignored)
- `temp/` - Temporary files (gitignored)
- `artifacts/` - CI/CD artifacts (gitignored)

## 📁 Detailed New Structure

```
js-dev-env/
│
├── 📁 /src/                          # SOURCE FILES (BUILD INPUTS)
│   ├── index.js                      # Main application entry
│   ├── healthcheck.js                # Health check endpoint
│   ├── plugins.config.js             # Plugin configuration
│   │
│   ├── /config/                      # Application configuration
│   │   └── features.js
│   │
│   ├── /data/                        # JSON-based CMS
│   │   ├── pages.json
│   │   └── youtube-top-100-songs-2025.csv
│   │
│   ├── /plugins/                     # Plugin system
│   │   ├── plugin-cli.js
│   │   ├── /core/
│   │   └── /examples/
│   │
│   ├── /public/                      # Development static assets
│   │   ├── /css/                     # Compiled CSS (dev)
│   │   ├── /js/                      # Client-side JavaScript
│   │   ├── /fonts/                   # Bootstrap Icons
│   │   ├── /images/                  # Image assets
│   │   ├── favicon.svg
│   │   ├── manifest.json
│   │   └── service-worker.js
│   │
│   ├── /scss/                        # SASS source files
│   │   ├── _variables.scss
│   │   ├── _custom.scss
│   │   ├── _components-pages.scss
│   │   └── main.scss
│   │
│   ├── /templates/                   # Template generation system
│   │   ├── template-cli.js
│   │   ├── template-generator.js
│   │   ├── template-schema.js
│   │   ├── customization-wizard.js
│   │   └── README.md
│   │
│   ├── /tests/                       # Jest test suite
│   │   ├── api.test.js
│   │   ├── app.test.js
│   │   ├── setup.js
│   │   ├── /tools/
│   │   └── /utils/
│   │
│   ├── /utils/                       # Utility modules
│   │   ├── build-info.js
│   │   ├── cache.js
│   │   ├── database.js
│   │   ├── feature-middleware.js
│   │   ├── json-database.js
│   │   ├── performance-monitor.js
│   │   ├── performance.js
│   │   ├── security.js
│   │   └── version-manager.js
│   │
│   └── /views/                       # EJS templates
│       ├── layout.ejs
│       ├── page.ejs
│       ├── components.ejs
│       ├── advanced-components.ejs
│       ├── data-tables.ejs
│       ├── song-detail.ejs
│       ├── error-404.ejs
│       └── /partials/
│
├── 📁 /docs/                         # PUBLISHED SITE (BUILD OUTPUT)
│   ├── index.html                    # Generated static HTML
│   ├── favicon.svg
│   ├── manifest.json
│   ├── service-worker.js
│   ├── /css/                         # Built CSS
│   ├── /js/                          # Built JavaScript
│   ├── /fonts/                       # Bootstrap Icons
│   ├── /images/                      # Optimized images
│   ├── /developer-guide/             # Developer documentation
│   ├── /project-info/                # Project information
│   ├── /components/                  # Component library pages
│   ├── /advanced-components/         # Advanced components
│   ├── /data-tables/                 # Data table demos
│   └── [all generated HTML pages]
│
├── 📁 /build/                        # BUILD SYSTEM
│   ├── README.md                     # Build system documentation
│   │
│   ├── /scripts/                     # Core build scripts
│   │   ├── build.js                  # Main build orchestrator
│   │   ├── build-config.js           # Build configuration
│   │   ├── clean.js                  # Clean build directory
│   │   ├── start.js                  # Start production server
│   │   ├── copy-icons.js             # Bootstrap Icons
│   │   ├── copy-static-assets.js     # Asset copying
│   │   ├── generate-static-site.js   # Static site generation
│   │   ├── bundle-javascript.js      # JS bundling
│   │   ├── bundle-css-dependencies.js # CSS bundling
│   │   └── performance-analyzer.js   # Performance analysis
│   │
│   ├── /seo/                         # SEO and quality tools
│   │   ├── seo-a11y-checks.mjs       # SEO/accessibility validation
│   │   ├── seo-validation-report.js  # SEO reporting
│   │   └── ssl-expiry.ts             # SSL monitoring
│   │
│   ├── /git/                         # Git analysis tools
│   │   └── report-git-simple.mjs     # Git activity reports
│   │
│   ├── /maintenance/                 # Maintenance automation
│   │   ├── apply-autofixes.mjs       # Automated fixes
│   │   ├── configure-project.js      # Project configuration
│   │   ├── dev-helper.js             # Development helpers
│   │   ├── minimal-setup.js          # Minimal setup
│   │   ├── optimize-dependencies.js  # Dependency optimization
│   │   ├── report-monthly.mjs        # Monthly reports
│   │   ├── security-audit.js         # Security auditing
│   │   ├── test-dependencies.js      # Dependency testing
│   │   └── version.js                # Version management
│   │
│   ├── /setup/                       # Project setup tools
│   │   ├── feature-manager.js        # Feature management
│   │   └── interactive-setup.js      # Interactive setup wizard
│   │
│   └── /docs/                        # Build documentation tools
│       └── [documentation generators]
│
├── 📁 /copilot/                      # AI DOCUMENTATION
│   ├── README.md                     # Main index (final docs)
│   ├── [final documentation files]   # Polished final versions
│   │
│   └── /sessions/                    # Session working docs
│       ├── /2025-01-14/
│       ├── /2025-01-17/
│       ├── /2025-01-23/
│       ├── /2025-09-06/
│       ├── /2025-09-14/
│       ├── /2025-09-26/
│       ├── /2025-10-03/
│       ├── /2025-10-04/
│       └── /2025-10-06/
│
└── 📄 ROOT FILES (17 files - essential only)
    ├── .dockerignore
    ├── .env
    ├── .env.example
    ├── .eslintignore
    ├── .gitignore
    ├── .prettierignore
    ├── .prettierrc.json
    ├── docker-compose.yml
    ├── Dockerfile
    ├── eslint.config.mjs
    ├── jest.config.js
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── LICENSE
    ├── SECURITY.md
    └── CONTRIBUTING.md
```

## 📊 Impact Analysis

### Files That Move

**Total files/folders moving: ~15 folders + 3 files**

#### To `/src/` (10 folders + 3 files)

1. `/config/` → `/src/config/`
2. `/data/` → `/src/data/`
3. `/plugins/` → `/src/plugins/`
4. `/public/` → `/src/public/`
5. `/scss/` → `/src/scss/`
6. `/templates/` → `/src/templates/`
7. `/tests/` → `/src/tests/`
8. `/utils/` → `/src/utils/`
9. `/views/` → `/src/views/`
10. `index.js` → `/src/index.js`
11. `healthcheck.js` → `/src/healthcheck.js`
12. `plugins.config.js` → `/src/plugins.config.js`

#### To `/build/` (1 folder - consolidation)

1. `/tools/` → `/build/` (rename entire folder)

#### Copilot Reorganization

1. `/copilot/session-*` → `/copilot/sessions/*` (group all sessions)

### Files That Stay

- **17 root config/doc files** (essential)
- **4 special folders** (.git, .github, node_modules, coverage, temp, artifacts)
- **4 primary folders** (/src, /docs, /build, /copilot)

## 🔧 Required Updates

### 1. Package.json Script Updates

**All tool paths need updating:**

```json
// OLD
"build": "node tools/build/build.js"
"clean": "node tools/build/clean.js"

// NEW
"build": "node build/scripts/build.js"
"clean": "node build/scripts/clean.js"
```

**All test paths need updating:**

```json
// jest.config.js
testMatch: [
  // OLD: '<rootDir>/tests/**/*.test.js'
  // NEW: '<rootDir>/src/tests/**/*.test.js'
]
```

### 2. Import Path Updates

**Every import/require needs updating:**

```javascript
// OLD
const cache = require('./utils/cache');
const features = require('./config/features');

// NEW (from root scripts)
const cache = require('../src/utils/cache');
const features = require('../src/config/features');

// NEW (from within src)
const cache = require('./utils/cache');
const features = require('./config/features');
```

### 3. Build Script Path Updates

**All build scripts reference paths:**

```javascript
// OLD
path.join(process.cwd(), 'docs')
path.join(process.cwd(), 'public')
path.join(process.cwd(), 'scss')

// NEW
path.join(process.cwd(), 'docs')        // stays same
path.join(process.cwd(), 'src/public')
path.join(process.cwd(), 'src/scss')
```

### 4. Template/View Path Updates

**Express view paths:**

```javascript
// OLD
app.set('views', path.join(__dirname, 'views'));

// NEW
app.set('views', path.join(__dirname, 'src/views'));
```

### 5. Static File Serving Updates

**Express static paths:**

```javascript
// OLD
app.use(express.static('public'));

// NEW
app.use(express.static('src/public'));
```

### 6. Docker Configuration Updates

**Dockerfile paths:**

```dockerfile
# OLD
COPY views ./views
COPY public ./public

# NEW
COPY src/views ./src/views
COPY src/public ./src/public
```

### 7. GitHub Actions Updates

**CI/CD workflow paths:**

```yaml
# Check for changes in source files
paths:
  # OLD: - 'views/**'
  # NEW: - 'src/views/**'
```

### 8. ESLint/Prettier Configuration

**Ignore patterns:**

```javascript
// OLD
ignores: ['docs/**', 'coverage/**']

// NEW
ignores: ['docs/**', 'coverage/**', 'src/public/css/**']
```

### 9. Jest Configuration

**Test paths and coverage:**

```javascript
// OLD
testMatch: ['<rootDir>/tests/**/*.test.js']
collectCoverageFrom: ['utils/**/*.js', 'tools/**/*.js']

// NEW
testMatch: ['<rootDir>/src/tests/**/*.test.js']
collectCoverageFrom: ['src/utils/**/*.js', 'build/**/*.js']
```

### 10. Documentation Links

**All documentation references:**

- README.md links to folders
- CONTRIBUTING.md structure references
- Developer guide paths
- Build process documentation

## ⚠️ Risk Assessment

### HIGH RISK Changes

1. **index.js move** - Main entry point, Docker/npm expects in root
   - **Mitigation**: Keep symlink or update all references
2. **Import path changes** - 100+ files could break
   - **Mitigation**: Systematic find/replace with testing
3. **Build script paths** - Critical for deployment
   - **Mitigation**: Update and test each script individually

### MEDIUM RISK Changes

1. **Test paths** - Coverage reports could break
2. **Docker builds** - Container might fail
3. **GitHub Actions** - CI/CD could fail

### LOW RISK Changes

1. **Template moves** - Well-contained
2. **Documentation moves** - No functional impact
3. **SASS moves** - Clear path updates

## 🎯 Recommended Approach

### Option A: Full Reorganization (Recommended with Caution)

**Pros:**

- Clean, intuitive structure
- Clear separation of concerns
- Professional organization

**Cons:**

- Major breaking changes
- Extensive path updates required
- Risk of missing references
- Docker/deployment complexity

**Estimated Effort:** 2-4 hours of careful work

### Option B: Partial Reorganization (Safer)

**Phase 1:** Non-critical moves

- Move templates, plugins, scss to /src
- Rename /tools to /build
- Reorganize /copilot sessions

**Phase 2:** Critical moves (after Phase 1 testing)

- Move index.js, utils, views to /src
- Update all imports
- Test thoroughly

**Estimated Effort:** 3-6 hours split across phases

### Option C: Virtual Organization (Minimal Risk)

- Keep physical structure mostly the same
- Add README files explaining logical groupings
- Use documentation to explain architecture
- Add clear comments about source vs. build

**Estimated Effort:** 30 minutes

## 💡 My Recommendation

**START WITH OPTION B - Partial Reorganization**

### Phase 1 (Low Risk - Do Now)

1. Rename `/tools/` → `/build/`
2. Reorganize `/copilot/session-*` → `/copilot/sessions/*`
3. Update package.json scripts for /build paths
4. Test build process
5. Update documentation

### Phase 2 (Medium Risk - After Testing)

1. Create `/src/` directory structure
2. Move non-critical folders (templates, scss, plugins)
3. Update paths in build scripts
4. Test thoroughly

### Phase 3 (Higher Risk - After Phase 2 Success)

1. Move core application files (utils, views, data, config)
2. Update all import paths
3. Update Docker configuration
4. Comprehensive testing

### Phase 4 (Highest Risk - Only if needed)

1. Move index.js to /src/index.js
2. Update package.json main entry
3. Update Docker WORKDIR
4. Update all deployment scripts

## 📋 Percentage Analysis

**How much CAN be moved under 4 folders?**

### Current Root Folders: 21 folders

- **Can move to /src: 10 folders** (47.6%)
- **Can move to /build: 1 folder** (/tools) (4.8%)
- **Already in /docs: 1 folder** (4.8%)
- **Already in /copilot: 1 folder** (4.8%)
- **Must stay in root: 8 folders** (.git, .github, node_modules, coverage, temp, artifacts, docs, copilot) (38%)

### Current Root Files: 20 files

- **Can move to /src: 3 files** (index.js, healthcheck.js, plugins.config.js) (15%)
- **Must stay in root: 17 files** (config files + documentation) (85%)

### Overall Summary

**Total items in root: 41 (21 folders + 20 files)**

- **Can be reorganized under 4 folders: ~14 folders + 3 files = 17 items** (41.5%)
- **Must stay in root: 24 items** (58.5%)

## 🎯 Final Structure Efficiency

**After full reorganization:**

- **Root directory: 17 config files + 4 primary folders = 21 items**
- **Reduction from current: 41 items → 21 items = 48.8% reduction!**

**Clarity improvement:**

- Users see: /src (inputs), /docs (outputs), /build (process), /copilot (documentation)
- Instantly understand project architecture
- Know where to make changes (src vs. docs)
- Understand build flow visually

## ❓ Questions for User

Before proceeding:

1. **Risk Tolerance**: Which option appeals to you?
   - A: Full reorganization (high risk, high reward)
   - B: Partial reorganization (phased approach)
   - C: Virtual organization (documentation only)

2. **index.js Location**: Main entry point
   - Keep in root (Docker/npm convention)
   - Move to /src/ (cleaner but requires Docker updates)

3. **Timeline**: When to implement?
   - Immediately
   - After current work stabilizes
   - Create new branch for testing

4. **Backwards Compatibility**: Important?
   - Need to maintain old paths
   - Can break all paths
   - Create symlinks for transition

## 🚀 Next Steps

Once user confirms approach:

1. Create detailed implementation checklist
2. Create backup/branch for safety
3. Implement changes systematically
4. Test after each major step
5. Update all documentation
6. Create migration guide for contributors

---

**Ready to proceed?** This is a significant architectural change that will make the repository much more intuitive, but requires careful execution.
