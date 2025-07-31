# Dependency Testing Guide

This guide helps you systematically test and remove dependencies from your project with safety checks and prioritization.

## 🎯 Prioritization Strategy

### **HIGH Priority** - Test Very Carefully

- **dotenv**: Environment variable management
  - **Risk**: HIGH - Could break environment configuration
  - **Test Strategy**: Check if you use `.env` files or `process.env` variables
  - **Safe to Remove**: ❌ NO - Usually essential for configuration

### **MEDIUM Priority** - Test with Caution

- **uuid**: Generate unique identifiers
  - **Risk**: MEDIUM - Could break ID generation features
  - **Test Strategy**: Search codebase for `uuid` usage
  - **Safe to Remove**: ✅ YES - If not used for ID generation

- **validator**: String validation library
  - **Risk**: MEDIUM - Could break form validation
  - **Test Strategy**: Search codebase for `validator` usage
  - **Safe to Remove**: ✅ YES - If not used for validation

- **morgan**: HTTP request logger middleware
  - **Risk**: MEDIUM - Could break logging functionality
  - **Test Strategy**: Check Express app for morgan usage
  - **Safe to Remove**: ✅ YES - If not used for request logging

### **LOW Priority** - Safe to Test

- **npm-run-all**: Build tool for parallel script execution
  - **Risk**: LOW - Could break build processes
  - **Test Strategy**: Check if you use parallel script execution
  - **Safe to Remove**: ✅ YES - If not using parallel scripts

- **@parcel/watcher**: File watching for build processes
  - **Risk**: LOW - Could break file watching
  - **Test Strategy**: Check if you use file watching in build scripts
  - **Safe to Remove**: ✅ YES - If not using file watching

- **cross-env**: Cross-platform environment variable setting
  - **Risk**: LOW - Could break cross-platform compatibility
  - **Test Strategy**: Check if you use cross-platform environment variables
  - **Safe to Remove**: ✅ YES - If not using cross-platform env vars

## 🧪 Testing Process

### Step 1: Analyze Dependencies

```bash
npm run test:deps list
```

This will show you:

- Which dependencies are actually used in your code
- Priority levels for each dependency
- Safe removal recommendations

### Step 2: Test Individual Dependencies

```bash
# Test a specific dependency
npm run test:deps test uuid

# Test another dependency
npm run test:deps test validator
```

The testing process will:

1. ✅ Create a backup of your `package.json`
2. 🗑️ Remove the dependency
3. 🧪 Run test commands to verify functionality
4. ✅ Keep it removed if tests pass
5. ❌ Restore it if tests fail

### Step 3: Test All Unused Dependencies

```bash
npm run test:deps test-all
```

This will automatically test all unused dependencies that are marked as safe to remove.

## 📋 Manual Testing Checklist

After each dependency removal, manually test:

### Core Functionality

- [ ] Application starts without errors
- [ ] All pages load correctly
- [ ] Forms work properly
- [ ] Navigation works
- [ ] Styling is intact

### Build Process

- [ ] `npm run build` works
- [ ] `npm run start:dev` works
- [ ] CSS compilation works
- [ ] Static file generation works

### Development Tools

- [ ] `npm test` passes
- [ ] Linting works (`npm run lint`)
- [ ] Hot reload works
- [ ] File watching works

### Production Features

- [ ] Docker builds work
- [ ] Deployment works
- [ ] Environment variables work
- [ ] Security features work

## 🔍 Manual Verification Steps

### For `uuid`

```bash
# Search for uuid usage
grep -r "uuid" . --exclude-dir=node_modules
grep -r "require.*uuid" . --exclude-dir=node_modules
grep -r "import.*uuid" . --exclude-dir=node_modules
```

### For `validator`

```bash
# Search for validator usage
grep -r "validator" . --exclude-dir=node_modules
grep -r "require.*validator" . --exclude-dir=node_modules
grep -r "import.*validator" . --exclude-dir=node_modules
```

### For `morgan`

```bash
# Search for morgan usage
grep -r "morgan" . --exclude-dir=node_modules
grep -r "require.*morgan" . --exclude-dir=node_modules
grep -r "import.*morgan" . --exclude-dir=node_modules
```

### For `dotenv`

```bash
# Check for .env files
ls -la .env*

# Search for dotenv usage
grep -r "dotenv" . --exclude-dir=node_modules
grep -r "require.*dotenv" . --exclude-dir=node_modules
grep -r "process\.env" . --exclude-dir=node_modules
```

## 🚨 Safety Tips

### Before Testing

1. **Commit your changes** to git
2. **Create a backup branch**: `git checkout -b backup-before-deps-test`
3. **Note current dependencies**: `npm list --depth=0`

### During Testing

1. **Test one dependency at a time**
2. **Run full test suite** after each removal
3. **Test in different environments** (dev, staging)
4. **Check for runtime errors** in console/logs

### After Testing

1. **Document what was removed** and why
2. **Update documentation** if needed
3. **Test in production-like environment**
4. **Monitor for issues** after deployment

## 🔄 Rollback Process

If something breaks:

### Quick Rollback

```bash
# Restore from backup
git checkout backup-before-deps-test

# Or restore specific dependency
npm install <dependency-name>
```

### Manual Rollback

```bash
# Install back the removed dependency
npm install uuid validator morgan

# Or restore from backup file
cp package.json.backup.* package.json
npm install
```

## 📊 Expected Results

Based on the analysis, you should be able to safely remove:

### ✅ Safe to Remove (if unused)

- `uuid` - If not generating unique IDs
- `validator` - If not doing form validation
- `morgan` - If not using HTTP request logging

### ⚠️ Test Carefully

- `dotenv` - Only if you don't use environment variables

### 🔒 Keep These (used in scripts)

- `npm-run-all` - Used in package.json scripts
- `@parcel/watcher` - Used in build process
- `cross-env` - Used in test scripts

## 💡 Pro Tips

1. **Start with LOW priority dependencies** - they're safest to test
2. **Test in a clean environment** - fresh `node_modules`
3. **Use the automated testing tool** - it handles backups and rollbacks
4. **Document your findings** - helps future maintenance
5. **Test thoroughly** - don't rush the process

## 🎯 Quick Start

```bash
# 1. Analyze your dependencies
npm run test:deps list

# 2. Test a specific dependency
npm run test:deps test uuid

# 3. Test all unused dependencies
npm run test:deps test-all

# 4. Verify everything still works
npm test
npm run start:dev
npm run build
```

This systematic approach ensures you can safely optimize your dependencies while maintaining project stability.
