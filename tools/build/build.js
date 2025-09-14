#!/usr/bin/env node

/**
 * Main Build Orchestrator
 * Unified build system with caching, performance tracking, and parallel execution
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const buildConfig = require('./build-config.js');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  pug: args.includes('--pug'),
  scss: args.includes('--scss'),
  scripts: args.includes('--scripts'),
  assets: args.includes('--assets'),
  all: args.length === 0 // If no flags, build all
};

async function runBuildTask(taskName, command) {
  console.log(`🔨 Running ${taskName}...`);
  
  try {
    const startTime = Date.now();
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    const duration = Date.now() - startTime;
    console.log(`✅ ${taskName} completed in ${duration}ms`);
    return { success: true, duration };
  } catch (error) {
    console.error(`❌ ${taskName} failed:`, error.message);
    return { success: false, error: error.message };
  }
}

async function build() {
  console.log('🚀 Starting build process...');
  const startTime = Date.now();
  const results = {};
  
  // Build tasks based on flags or build all
  const tasks = [];
  
  if (flags.all || flags.scss) {
    tasks.push({ name: 'SCSS Compilation', command: 'npm run build-css' });
  }
  
  if (flags.all || flags.assets) {
    tasks.push({ name: 'Copy Icons', command: 'node tools/build/copy-icons.js --target=docs' });
    tasks.push({ name: 'Copy Static Assets', command: 'node tools/build/copy-static-assets.js' });
  }
  
  if (flags.all || flags.pug) {
    tasks.push({ name: 'Generate Static Site', command: 'node tools/build/generate-static-site.js' });
  }
  
  // Run tasks sequentially for now (TODO: implement parallel execution)
  for (const task of tasks) {
    results[task.name] = await runBuildTask(task.name, task.command);
  }
  
  const totalTime = Date.now() - startTime;
  const successCount = Object.values(results).filter(r => r.success).length;
  const failureCount = Object.values(results).filter(r => !r.success).length;
  
  // Generate build report
  const reportPath = path.join(process.cwd(), 'temp/reports/build-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    duration: totalTime,
    tasks: results,
    summary: {
      total: tasks.length,
      successful: successCount,
      failed: failureCount
    }
  };
  
  // Ensure directory exists
  const dir = path.dirname(reportPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📊 Build Summary:`);
  console.log(`   Total time: ${totalTime}ms`);
  console.log(`   Successful: ${successCount}/${tasks.length}`);
  console.log(`   Failed: ${failureCount}/${tasks.length}`);
  console.log(`   Report: ${reportPath}`);
  
  if (failureCount > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  build().catch(console.error);
}

module.exports = { build };
