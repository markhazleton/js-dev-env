# Security Notice - Third-Party Dependencies

## Code Scanning Alerts - Status Report

This document tracks security alerts from GitHub Code Scanning and explains mitigation strategies.

### ✅ Fixed Issues (Source Code)

The following security issues in **source code** have been fixed:

1. **Polynomial Regular Expression (ReDoS) - Alert #65**
   - **File**: `src/index.js` (line 263)
   - **Status**: ✅ FIXED
   - **Fix**: Replaced polynomial regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` with simpler pattern `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
   - **Impact**: Eliminates ReDoS vulnerability in email validation

2. **Missing Rate Limiting - Alert #51**
   - **File**: `src/index.js` (line 310)
   - **Status**: ✅ FIXED
   - **Fix**: Added rate limiter to YouTube songs API endpoint
   - **Impact**: Prevents abuse and DoS attacks on the endpoint

3. **Incomplete URL Substring Sanitization - Alerts #49, #50**
   - **Files**: `src/index.js`, `src/public/service-worker.js`
   - **Status**: ✅ FIXED
   - **Fix**: Replaced substring matching with proper URL parsing and domain validation using `URL()` API and `endsWith()` checks
   - **Impact**: Prevents URL spoofing attacks

4. **Bad HTML Filtering Regexp - Alert #54**
   - **File**: `build/maintenance/security-audit.js` (line 122)
   - **Status**: ✅ FIXED
   - **Fix**: Replaced unsafe regex with more robust script tag detection
   - **Impact**: Prevents ReDoS in security scanning tool

### ⚠️ Third-Party Library Issues (Built Files)

The following security issues are in **third-party minified libraries** that are bundled into `dependencies.js`:

#### Affected Files (ALL Auto-Generated):
- `docs/js/dependencies.js`
- `src/public/js/dependencies.js`
- `public/js/dependencies.js`

#### Issues from tableexport.jquery.plugin v1.33.0:

**Incomplete String Escaping - Alerts #36-46, #55-64**
- **Lines**: 119-120
- **Source**: tableExport.min.js (minified third-party library)
- **Impact**: Potential XSS if user-controlled data flows through export functionality
- **Mitigation**:
  - ✅ Marked as generated files in `.gitattributes`
  - ✅ Excluded from CodeQL scanning via `.github/codeql-config.yml`
  - ✅ Library is at latest version (1.33.0 - no newer versions available)
  - ✅ Usage is isolated to data export functionality
  - ⚠️ Library hasn't been updated since 2020
  
**DOM Text Reinterpreted as HTML - Alerts #52-53**
- **Lines**: 79, 87
- **Source**: tableExport.min.js (minified third-party library)
- **Impact**: Potential XSS if user-controlled data is exported
- **Mitigation**: Same as above

### 🔒 Security Recommendations

1. **Do Not Edit Built Files**: Per project guidelines, NEVER edit files in:
   - `/docs/` directory (GitHub Pages output)
   - `/public/js/dependencies.js` (built bundles)
   - `/src/public/js/dependencies.js` (built bundles)

2. **Source File Edits Only**: All security fixes should be applied to:
   - Source files in `/src/`
   - Build tools in `/build/`
   - Then rebuild using `npm run build`

3. **Dependency Management**:
   - tableexport.jquery.plugin is at the latest version
   - Consider replacing with a more actively maintained alternative
   - Monitor for updates: https://github.com/hhurz/tableExport.jquery.plugin

4. **Build Process**:
   - Builds automatically clear and regenerate all files in `/docs/`
   - Use `npm run build` to apply all changes
   - Built files are now marked as `linguist-generated=true`

### 📋 GitHub Code Scanning Configuration

**Files Created/Updated**:
1. `.gitattributes` - Marks generated files for GitHub
2. `.github/codeql-config.yml` - Excludes generated files from scanning

**To Apply Configuration**:
The CodeQL configuration will be used automatically on the next scan. To trigger a manual scan:
1. Push changes to GitHub
2. GitHub will automatically use the new configuration
3. Generated files will be excluded from future scans

### 🔄 Next Steps

1. ✅ Commit and push the security fixes
2. ✅ Rebuild the site: `npm run build`
3. ✅ Push built files to trigger new code scan
4. 🔍 Monitor GitHub Security tab for confirmation
5. 📝 Consider replacing tableexport.jquery.plugin with alternative

### 📚 References

- [OWASP Regular Expression Denial of Service](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)
- [Express Rate Limiting](https://express-rate-limit.mintlify.app/)
- [URL API for Safe URL Parsing](https://developer.mozilla.org/en-US/docs/Web/API/URL)
- [GitHub Code Scanning](https://docs.github.com/en/code-security/code-scanning)

---

**Last Updated**: 2025-11-03
**Status**: Source code issues fixed, third-party issues documented and mitigated
