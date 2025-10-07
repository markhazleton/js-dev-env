# Phase 2: Full Reorganization - Step-by-Step Implementation

**Session Date**: October 6, 2025
**Status**: EXECUTING
**Approach**: Full reorganization with systematic testing
**User Decisions**:

- ✅ Full reorganization (all phases)
- ✅ Move index.js to /src/ (npm supports this)
- ✅ Execute now
- ✅ Full testing after each step

## 🎯 Implementation Strategy

**Safe Execution Plan:**

1. Make ONE change at a time
2. Test after EACH change
3. Revise plan if issues arise
4. Keep detailed log of what works

## 📋 Step-by-Step Execution Plan

### STEP 1: Create Directory Structure ✅

**Action:** Create all new directories first
**Risk:** ZERO (just creating empty folders)
**Time:** 1 minute

**Tasks:**

- [ ] Create `/src/` directory
- [ ] Create `/src/config/`
- [ ] Create `/src/data/`
- [ ] Create `/src/plugins/`
- [ ] Create `/src/public/`
- [ ] Create `/src/scss/`
- [ ] Create `/src/templates/`
- [ ] Create `/src/tests/`
- [ ] Create `/src/utils/`
- [ ] Create `/src/views/`
- [ ] Create `/build/` directory
- [ ] Create `/copilot/sessions/` directory

**Verification:**

```bash
Test-Path "src"
Test-Path "build"
Test-Path "copilot/sessions"
```

---

### STEP 2: Rename /tools → /build ✅

**Action:** Rename tools folder to build
**Risk:** LOW (can easily reverse)
**Time:** 1 minute

**Tasks:**

- [ ] Move `/tools/` → `/build/`

**Verification:**

```bash
Test-Path "build"
!(Test-Path "tools")
Get-ChildItem "build" | Measure-Object
```

---

### STEP 3: Update package.json for /build paths ✅

**Action:** Update all script paths from tools/ to build/
**Risk:** LOW (syntax errors will be obvious)
**Time:** 5 minutes

**Changes needed in package.json:**

```json
"build": "node build/scripts/build.js",
"start": "npm run build && node build/scripts/start.js",
"clean": "node build/scripts/clean.js",
"bundle-js": "node build/scripts/bundle-javascript.js",
"bundle-css-deps": "node build/scripts/bundle-css-dependencies.js",
"copy-icons": "node build/scripts/copy-icons.js",
"copy-icons-docs": "node build/scripts/copy-icons.js --target=docs",
"copy-static-assets": "node build/scripts/copy-static-assets.js",
"generate-static-site": "node build/scripts/generate-static-site.js",
"build:pug": "node build/scripts/build.js --pug",
"build:scss": "node build/scripts/build.js --scss",
"build:scripts": "node build/scripts/build.js --scripts",
"analyze:performance": "node build/scripts/performance-analyzer.js analyze",
"analyze:bundles": "node build/scripts/performance-analyzer.js bundle",
"performance:report": "node build/scripts/performance-analyzer.js report",
"performance:monitor": "node build/scripts/performance-analyzer.js monitor",
"security:audit": "node build/maintenance/security-audit.js",
"audit:seo": "node build/seo/seo-a11y-checks.mjs",
"audit:ssl": "tsx build/seo/ssl-expiry.ts",
"version:info": "node build/maintenance/version.js info",
"version:patch": "node build/maintenance/version.js increment patch",
"version:minor": "node build/maintenance/version.js increment minor",
"version:major": "node build/maintenance/version.js increment major",
"version:clean": "node build/maintenance/version.js clean",
"setup:minimal": "node build/maintenance/minimal-setup.js",
"setup:interactive": "node build/setup/interactive-setup.js",
"features": "node build/setup/feature-manager.js",
"features:list": "node build/setup/feature-manager.js list",
"features:enabled": "node build/setup/feature-manager.js enabled",
"features:presets": "node build/setup/feature-manager.js presets",
"configure": "node build/maintenance/configure-project.js",
"analyze:deps": "node build/maintenance/optimize-dependencies.js",
"optimize:deps": "node build/maintenance/optimize-dependencies.js --generate-minimal",
"test:deps": "node build/maintenance/test-dependencies.js",
"fix:auto": "node build/maintenance/apply-autofixes.mjs",
"report:monthly": "node build/maintenance/report-monthly.mjs",
"report:git": "node build/git/report-git-simple.mjs"
```

**Verification:**

```bash
npm run build
npm test
npm run lint
```

**Expected Result:** All tests pass, build works

---

### STEP 4: Move SCSS to /src/scss ✅

**Action:** Move SCSS source files
**Risk:** LOW (build will fail obviously if wrong)
**Time:** 2 minutes

**Tasks:**

- [ ] Move `/scss/` → `/src/scss/`

**Files to update:**

1. `package.json` - watch-css script
2. `build/scripts/build.js` - SCSS source path
3. Any build configs referencing scss/

**Changes:**

```json
// package.json
"watch-css": "sass --watch --load-path=node_modules src/scss/main.scss:src/public/css/styles.css",
"build-css": "sass --load-path=node_modules src/scss/main.scss docs/css/styles.css",
"build-css-dev": "sass --load-path=node_modules src/scss/main.scss src/public/css/styles.css",
```

**Verification:**

```bash
npm run build:scss
Test-Path "docs/css/styles.css"
Test-Path "src/public/css/styles.css"
npm test
```

---

### STEP 5: Move /data to /src/data ✅

**Action:** Move JSON CMS data files
**Risk:** LOW (small, well-contained)
**Time:** 2 minutes

**Tasks:**

- [ ] Move `/data/` → `/src/data/`

**Files to update:**

- `index.js` - data loading path
- Any build scripts reading pages.json

**Changes needed:**

```javascript
// In index.js and other files
// OLD: require('./data/pages.json')
// NEW: require('./data/pages.json') // Will work from src/index.js
// OR from root scripts: require('./src/data/pages.json')
```

**Verification:**

```bash
npm test
npm run start:server # Check if data loads
```

---

### STEP 6: Move /views to /src/views ✅

**Action:** Move EJS templates
**Risk:** LOW-MEDIUM (Express needs to find them)
**Time:** 2 minutes

**Tasks:**

- [ ] Move `/views/` → `/src/views/`

**Files to update:**

- `index.js` - views path configuration

**Changes needed:**

```javascript
// In index.js
// OLD: app.set('views', path.join(__dirname, 'views'));
// NEW: app.set('views', path.join(__dirname, 'views')); // Will work when index.js is in src
```

**Verification:**

```bash
npm test
npm run start:server # Check if pages render
curl http://localhost:3001/ # Should return HTML
```

---

### STEP 7: Move /public to /src/public ✅

**Action:** Move development static assets
**Risk:** MEDIUM (Express static serving)
**Time:** 2 minutes

**Tasks:**

- [ ] Move `/public/` → `/src/public/`

**Files to update:**

- `index.js` - static file serving path
- Build scripts copying to public/

**Changes needed:**

```javascript
// In index.js
// OLD: app.use(express.static('public'));
// NEW: app.use(express.static('public')); // Works from src/
```

**Verification:**

```bash
npm run build:dev
Test-Path "src/public/css/styles.css"
npm run start:server
# Check if CSS/JS loads in browser
```

---

### STEP 8: Move /utils to /src/utils ✅

**Action:** Move utility modules
**Risk:** MEDIUM-HIGH (many imports)
**Time:** 5 minutes

**Tasks:**

- [ ] Move `/utils/` → `/src/utils/`

**Files to update:**

- `index.js` - all utility imports
- Build scripts importing utilities
- Test files importing utilities

**Changes needed:**

```javascript
// From index.js (will be in src/)
// Already correct: require('./utils/cache')

// From build scripts (in /build/)
// OLD: require('../utils/cache')
// NEW: require('../src/utils/cache')
```

**Verification:**

```bash
npm test  # Critical - tests import many utils
npm run start:server
```

---

### STEP 9: Move /config to /src/config ✅

**Action:** Move configuration files
**Risk:** MEDIUM (features system used everywhere)
**Time:** 3 minutes

**Tasks:**

- [ ] Move `/config/` → `/src/config/`

**Files to update:**

- `index.js` - config imports
- Build scripts using features
- Middleware loading configs

**Changes needed:**

```javascript
// From index.js (in src/)
// Already correct: require('./config/features')

// From build scripts
// OLD: require('../config/features')
// NEW: require('../src/config/features')
```

**Verification:**

```bash
npm test
npm run features:list
npm run start:server
```

---

### STEP 10: Move /templates to /src/templates ✅

**Action:** Move template generation system
**Risk:** LOW (self-contained system)
**Time:** 2 minutes

**Tasks:**

- [ ] Move `/templates/` → `/src/templates/`

**Files to update:**

- `package.json` - template CLI scripts

**Changes:**

```json
"templates": "node src/templates/template-cli.js",
"templates:list": "node src/templates/template-cli.js list",
"templates:info": "node src/templates/template-cli.js info",
"templates:generate": "node src/templates/template-cli.js generate",
"templates:wizard": "node src/templates/template-cli.js wizard",
"templates:customize": "node src/templates/customization-wizard.js",
```

**Verification:**

```bash
npm run templates:list
npm test
```

---

### STEP 11: Move /plugins to /src/plugins ✅

**Action:** Move plugin system
**Risk:** LOW-MEDIUM (plugin system)
**Time:** 3 minutes

**Tasks:**

- [ ] Move `/plugins/` → `/src/plugins/`
- [ ] Move `/plugins.config.js` → `/src/plugins.config.js`

**Files to update:**

- `index.js` - plugin system imports
- `package.json` - plugin CLI scripts

**Changes:**

```json
"plugins": "node src/plugins/plugin-cli.js",
"plugins:list": "node src/plugins/plugin-cli.js list",
"plugins:info": "node src/plugins/plugin-cli.js info",
"plugins:create": "node src/plugins/plugin-cli.js create",
"plugins:run": "node src/plugins/plugin-cli.js run",
```

```javascript
// In index.js (from src/)
// Already correct: require('./plugins.config')
```

**Verification:**

```bash
npm run plugins:list
npm test
npm run start:server
```

---

### STEP 12: Move /tests to /src/tests ✅

**Action:** Move test suite
**Risk:** HIGH (Jest configuration)
**Time:** 5 minutes

**Tasks:**

- [ ] Move `/tests/` → `/src/tests/`

**Files to update:**

- `jest.config.js` - testMatch paths
- Test import paths

**Changes:**

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    'build/**/*.js',
    '!src/tests/**',
    '!build/docs/**',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
};
```

**Test file imports:**

```javascript
// In test files
// OLD: const app = require('../index');
// NEW: const app = require('../index'); // Still works if index.js is in src
```

**Verification:**

```bash
npm test  # ALL TESTS MUST PASS
npm run test:coverage
```

---

### STEP 13: Move index.js to /src/index.js ✅

**Action:** Move main application entry point
**Risk:** HIGH (npm main, Docker, everything references this)
**Time:** 10 minutes

**Tasks:**

- [ ] Move `index.js` → `/src/index.js`
- [ ] Move `healthcheck.js` → `/src/healthcheck.js`

**Files to update:**

- `package.json` - main entry point
- `Dockerfile` - WORKDIR and paths
- `docker-compose.yml` - volume mounts
- Test files - app imports
- Build scripts starting server

**Changes:**

**package.json:**

```json
{
  "main": "src/index.js",
  "scripts": {
    "start:server": "nodemon src/index.js",
  }
}
```

**Dockerfile:**

```dockerfile
# Update COPY commands
COPY src ./src
COPY build ./build

# Update CMD
CMD ["node", "src/index.js"]
```

**docker-compose.yml:**

```yaml
volumes:
  - ./src:/app/src
  - ./build:/app/build
```

**build/scripts/start.js:**

```javascript
// Update spawn path
const server = spawn('node', ['src/index.js']);
```

**Verification:**

```bash
npm test
npm run start  # Should start server
node src/index.js  # Direct test
docker-compose build  # Test Docker
```

---

### STEP 14: Reorganize Copilot Sessions ✅

**Action:** Group session folders
**Risk:** ZERO (just organization)
**Time:** 2 minutes

**Tasks:**

- [ ] Create `/copilot/sessions/` folder
- [ ] Move all `session-*` folders into it

**Commands:**

```powershell
New-Item -ItemType Directory -Path "copilot/sessions"
Get-ChildItem "copilot/session-*" | Move-Item -Destination "copilot/sessions/"
```

**Verification:**

```bash
Get-ChildItem "copilot/sessions" | Measure-Object
```

---

### STEP 15: Update Build Script Internal Paths ✅

**Action:** Update all path references in build scripts
**Risk:** MEDIUM (many scripts)
**Time:** 15 minutes

**Files to review and update:**

- All files in `/build/scripts/`
- All files in `/build/seo/`
- All files in `/build/git/`
- All files in `/build/maintenance/`
- All files in `/build/setup/`

**Common patterns to find and replace:**

```javascript
// Reading source files
'./scss/' → './src/scss/'
'./views/' → './src/views/'
'./data/' → './src/data/'
'./public/' → './src/public/'
'./utils/' → './src/utils/'
'./config/' → './src/config/'

// Loading modules
require('../utils/') → require('../src/utils/')
require('../config/') → require('../src/config/')
```

**Systematic approach:**

```powershell
# Search for old patterns
Get-ChildItem -Path "build" -Recurse -Filter "*.js" | 
  Select-String -Pattern "'\./views/'" | 
  Select-Object -Property Path, LineNumber, Line
```

**Verification:**

```bash
npm run build  # Full build
npm test
npm run audit:all
```

---

### STEP 16: Update Documentation ✅

**Action:** Update all documentation with new paths
**Risk:** ZERO (documentation only)
**Time:** 10 minutes

**Files to update:**

- `README.md` - folder structure
- `CONTRIBUTING.md` - architecture section
- `/docs/developer-guide/build-process.md`
- `/docs/developer-guide/quick-start.md`
- `/build/README.md` (create if doesn't exist)
- `/src/README.md` (create new)

**Verification:**

- Review all docs for accuracy
- Check all internal links work

---

### STEP 17: Final Comprehensive Testing ✅

**Action:** Full regression testing
**Risk:** ZERO (just testing)
**Time:** 15 minutes

**Test Suite:**

```bash
# 1. Clean build
npm run clean
npm run build

# 2. Full test suite
npm test
npm run test:coverage

# 3. Linting
npm run lint

# 4. Start server
npm run start:dev
# Manually test in browser

# 5. Build scripts
npm run build:scss
npm run build:pug

# 6. Tools
npm run features:list
npm run plugins:list
npm run templates:list

# 7. Analysis
npm run analyze:deps
npm run report:git

# 8. Docker
docker-compose build
docker-compose up

# 9. Security
npm run security:audit
npm run audit:seo
```

**Verification:**

- [ ] All 216+ tests pass
- [ ] Build completes successfully
- [ ] Server starts without errors
- [ ] Pages load in browser
- [ ] CSS/JS assets load
- [ ] No console errors
- [ ] Docker builds successfully
- [ ] All npm scripts work

---

### STEP 18: Update .gitignore if needed ✅

**Action:** Ensure gitignore covers new structure
**Risk:** ZERO
**Time:** 2 minutes

**Review:**

- Check temp/ paths
- Check artifacts/ paths
- Ensure coverage/ works
- Verify node_modules/ excluded

---

## 📊 Execution Log

### Checkpoint After Each Step

| Step | Status | Time | Tests Pass | Notes |
|------|--------|------|------------|-------|
| 1. Create directories | ⏳ | - | N/A | - |
| 2. Rename /tools → /build | ⏳ | - | - | - |
| 3. Update package.json | ⏳ | - | - | - |
| 4. Move /scss | ⏳ | - | - | - |
| 5. Move /data | ⏳ | - | - | - |
| 6. Move /views | ⏳ | - | - | - |
| 7. Move /public | ⏳ | - | - | - |
| 8. Move /utils | ⏳ | - | - | - |
| 9. Move /config | ⏳ | - | - | - |
| 10. Move /templates | ⏳ | - | - | - |
| 11. Move /plugins | ⏳ | - | - | - |
| 12. Move /tests | ⏳ | - | - | - |
| 13. Move index.js | ⏳ | - | - | - |
| 14. Copilot reorg | ⏳ | - | N/A | - |
| 15. Build script paths | ⏳ | - | - | - |
| 16. Documentation | ⏳ | - | N/A | - |
| 17. Final testing | ⏳ | - | - | - |
| 18. .gitignore | ⏳ | - | N/A | - |

## 🎯 Success Criteria

- [ ] All source files in `/src/`
- [ ] All build tools in `/build/`
- [ ] All tests passing
- [ ] Build process works
- [ ] Server starts and runs
- [ ] Docker builds successfully
- [ ] Documentation updated
- [ ] No broken imports
- [ ] Root directory clean (21 items)

## 🚨 Rollback Plan

If any step fails critically:

1. Git stash/revert changes
2. Document what failed
3. Revise approach
4. Try again with fixes

## 📝 Notes Section

*Space for notes during execution*

---

**Ready to begin!** Starting with Step 1...
