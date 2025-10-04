#!/usr/bin/env node

/**
 * Main Build Orchestrator
 * Unified build system with caching, performance tracking, and parallel execution
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load build info utility
const buildInfo = require('../../utils/build-info');
const versionManager = require('../../utils/version-manager');
const { performanceMonitor } = require('../../utils/performance-monitor');

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
  
  const taskId = `build_${taskName.toLowerCase().replace(/\s+/g, '_')}`;
  performanceMonitor.startTiming(taskId);
  
  try {
    const startTime = Date.now();
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    const duration = Date.now() - startTime;
    
    // Record performance metrics
    const metric = performanceMonitor.endTiming(taskId, { taskName, command });
    performanceMonitor.recordBuildMetric(taskName, duration, 0, {
      success: true,
      memoryDelta: metric.memoryDelta
    });
    
    console.log(`✅ ${taskName} completed in ${duration}ms`);
    return { success: true, duration };
  } catch (error) {
    // Record failed build metric
    performanceMonitor.endTiming(taskId);
    performanceMonitor.recordBuildMetric(taskName, 0, 0, {
      success: false,
      error: error.message
    });
    
    console.error(`❌ ${taskName} failed:`, error.message);
    return { success: false, error: error.message };
  }
}

async function build() {
  console.log('🚀 Starting build process...');
  
  // Increment build version
  console.log('📈 Incrementing build version...');
  const versionInfo = versionManager.incrementVersion('build');
  console.log(`Version: ${versionInfo.oldVersion} → ${versionInfo.newVersion}`);
  
  // Generate build info
  console.log('📝 Generating build information...');
  buildInfo.generateBuildInfo();
  console.log('✅ Build info generated');
  
  const startTime = Date.now();
  const results = {};
  
  // Build tasks based on flags or build all
  const tasks = [];
  
  if (flags.all || flags.scss) {
    tasks.push({ name: 'SCSS Compilation', command: 'npm run build-css' });
    tasks.push({ name: 'CSS Dependencies Bundle', command: 'node tools/build/bundle-css-dependencies.js' });
  }
  
  if (flags.all || flags.scripts) {
    tasks.push({ name: 'JavaScript Bundle', command: 'node tools/build/bundle-javascript.js' });
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
