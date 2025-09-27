#!/usr/bin/env node

/**
 * Performance Analysis CLI
 * Analyze build performance, bundle sizes, and optimization opportunities
 */

const fs = require('fs');
const path = require('path');
const { performanceMonitor } = require('../../utils/performance-monitor');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const target = args[1] || '.';

function showHelp() {
  console.log(`
📊 Performance Analysis CLI

Usage:
  node tools/build/performance-analyzer.js <command> [options]

Commands:
  analyze [directory]     Analyze file sizes and performance
  bundle [directory]      Analyze bundle sizes and dependencies
  report                  Generate performance report
  monitor                 Show current performance metrics
  cleanup                 Clean up old performance data
  
Options:
  --format json          Output in JSON format
  --threshold <size>     Set size threshold in bytes (default: 1MB)
  --recursive           Analyze directories recursively
  --extensions <ext>     Filter by file extensions (comma-separated)

Examples:
  node tools/build/performance-analyzer.js analyze docs
  node tools/build/performance-analyzer.js bundle --threshold 500000
  node tools/build/performance-analyzer.js report --format json
  node tools/build/performance-analyzer.js analyze public --extensions .js,.css
`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function analyzeDirectory(dirPath, options = {}) {
  const { recursive = true, extensions = null, threshold = 1024 * 1024 } = options;
  
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Directory not found: ${dirPath}`);
    return;
  }

  console.log(`\n📊 Analyzing directory: ${dirPath}\n`);
  
  const extensionFilter = extensions ? extensions.split(',').map(ext => ext.trim()) : null;
  const analysis = performanceMonitor.analyzeDirectory(dirPath, {
    recursive,
    extensions: extensionFilter
  });

  // Sort files by size (largest first)
  const sortedFiles = analysis.files.sort((a, b) => b.sizeInBytes - a.sizeInBytes);
  
  // Show summary
  console.log(`📁 Directory Summary:`);
  console.log(`   Total files: ${analysis.fileCount}`);
  console.log(`   Total size: ${formatBytes(analysis.totalSize)}`);
  console.log(`   Average file size: ${formatBytes(analysis.totalSize / analysis.fileCount)}\n`);

  // Show largest files
  const largeFiles = sortedFiles.filter(file => file.sizeInBytes > threshold);
  if (largeFiles.length > 0) {
    console.log(`🚨 Large files (>${formatBytes(threshold)}):`);
    largeFiles.slice(0, 10).forEach(file => {
      console.log(`   ${formatBytes(file.sizeInBytes).padEnd(10)} ${path.relative(process.cwd(), file.filePath)}`);
    });
    console.log('');
  }

  // Show file type breakdown
  const typeBreakdown = {};
  sortedFiles.forEach(file => {
    const ext = path.extname(file.filePath) || 'no extension';
    if (!typeBreakdown[ext]) {
      typeBreakdown[ext] = { count: 0, totalSize: 0 };
    }
    typeBreakdown[ext].count++;
    typeBreakdown[ext].totalSize += file.sizeInBytes;
  });

  console.log(`📊 File type breakdown:`);
  Object.entries(typeBreakdown)
    .sort((a, b) => b[1].totalSize - a[1].totalSize)
    .slice(0, 10)
    .forEach(([ext, data]) => {
      console.log(`   ${ext.padEnd(12)} ${data.count.toString().padEnd(6)} files ${formatBytes(data.totalSize)}`);
    });

  return analysis;
}

function analyzeBundles(dirPath, _options = {}) {
  console.log(`\n📦 Bundle Analysis: ${dirPath}\n`);
  
  const bundleDirs = ['public', 'docs', 'build', 'dist'];
  const foundDirs = bundleDirs.filter(dir => 
    fs.existsSync(path.join(process.cwd(), dir))
  );

  if (foundDirs.length === 0) {
    console.log('No bundle directories found (public, docs, build, dist)');
    return;
  }

  const bundleAnalysis = {};
  foundDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    bundleAnalysis[dir] = performanceMonitor.analyzeDirectory(dirPath, {
      recursive: true,
      extensions: ['.js', '.css', '.html']
    });
  });

  // Show bundle comparison
  console.log(`📊 Bundle Size Comparison:`);
  Object.entries(bundleAnalysis).forEach(([dir, analysis]) => {
    console.log(`   ${dir.padEnd(10)} ${formatBytes(analysis.totalSize).padEnd(10)} (${analysis.fileCount} files)`);
  });
  console.log('');

  // Show largest bundles
  const allFiles = Object.values(bundleAnalysis)
    .flatMap(analysis => analysis.files)
    .sort((a, b) => b.sizeInBytes - a.sizeInBytes);

  console.log(`🏆 Largest bundle files:`);
  allFiles.slice(0, 10).forEach(file => {
    const relativePath = path.relative(process.cwd(), file.filePath);
    console.log(`   ${formatBytes(file.sizeInBytes).padEnd(10)} ${relativePath}`);
  });

  return bundleAnalysis;
}

function generateReport(options = {}) {
  const { format = 'text' } = options;
  
  console.log(`\n📈 Performance Report\n`);
  
  const report = performanceMonitor.generateReport();
  
  if (format === 'json') {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  // Text format
  console.log(`📊 Summary:`);
  console.log(`   Generated: ${new Date(report.generatedAt).toLocaleString()}`);
  console.log(`   Build metrics: ${report.summary.totalBuildMetrics}`);
  console.log(`   Runtime metrics: ${report.summary.totalRuntimeMetrics}\n`);

  // Build performance
  if (report.analysis.buildPerformance.totalBuilds > 0) {
    console.log(`🔨 Build Performance:`);
    console.log(`   Average duration: ${formatDuration(report.analysis.buildPerformance.averageDuration)}`);
    console.log(`   Total builds: ${report.analysis.buildPerformance.totalBuilds}`);
    console.log(`   Over threshold: ${report.analysis.buildPerformance.buildsOverThreshold}\n`);
  }

  // Runtime performance
  if (report.analysis.runtimePerformance.totalRequests > 0) {
    console.log(`⚡ Runtime Performance:`);
    console.log(`   Average response time: ${formatDuration(report.analysis.runtimePerformance.averageResponseTime)}`);
    console.log(`   Total requests: ${report.analysis.runtimePerformance.totalRequests}`);
    console.log(`   Slow routes: ${report.analysis.runtimePerformance.slowRoutes.length}\n`);
  }

  // Recommendations
  if (report.analysis.recommendations.length > 0) {
    console.log(`💡 Recommendations:`);
    report.analysis.recommendations.forEach(rec => {
      const icon = rec.severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`   ${icon} ${rec.message}`);
      rec.suggestions.forEach(suggestion => {
        console.log(`      • ${suggestion}`);
      });
    });
  }

  // Save report to file
  const reportPath = path.join(process.cwd(), 'temp', 'reports', `performance-report-${Date.now()}.json`);
  performanceMonitor.saveMetrics(reportPath);
  console.log(`\n💾 Report saved to: ${path.relative(process.cwd(), reportPath)}`);
}

function showMonitoringData() {
  console.log(`\n🔍 Current Performance Monitoring Data\n`);
  
  const report = performanceMonitor.generateReport();
  
  if (report.buildMetrics.length > 0) {
    console.log(`📊 Recent Build Metrics (last ${report.buildMetrics.length}):`);
    report.buildMetrics.forEach(metric => {
      console.log(`   ${metric.buildType.padEnd(15)} ${formatDuration(metric.duration).padEnd(10)} ${formatBytes(metric.outputSize || 0)}`);
    });
    console.log('');
  }

  if (report.runtimeMetrics.length > 0) {
    console.log(`📊 Recent Runtime Metrics (last ${Math.min(10, report.runtimeMetrics.length)}):`);
    report.runtimeMetrics.slice(-10).forEach(metric => {
      console.log(`   ${metric.method.padEnd(6)} ${metric.route.padEnd(20)} ${formatDuration(metric.duration).padEnd(10)} ${metric.statusCode}`);
    });
    console.log('');
  }
}

function cleanup() {
  console.log(`\n🧹 Cleaning up old performance data...\n`);
  
  const beforeBuild = performanceMonitor.buildMetrics.length;
  const beforeRuntime = performanceMonitor.runtimeMetrics.length;
  
  performanceMonitor.cleanup();
  
  const afterBuild = performanceMonitor.buildMetrics.length;
  const afterRuntime = performanceMonitor.runtimeMetrics.length;
  
  console.log(`✅ Cleanup complete:`);
  console.log(`   Build metrics: ${beforeBuild} -> ${afterBuild} (removed ${beforeBuild - afterBuild})`);
  console.log(`   Runtime metrics: ${beforeRuntime} -> ${afterRuntime} (removed ${beforeRuntime - afterRuntime})`);
}

// Parse options
const options = {};
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--format' && args[i + 1]) {
    options.format = args[i + 1];
    i++;
  } else if (arg === '--threshold' && args[i + 1]) {
    options.threshold = parseInt(args[i + 1]);
    i++;
  } else if (arg === '--recursive') {
    options.recursive = true;
  } else if (arg === '--extensions' && args[i + 1]) {
    options.extensions = args[i + 1];
    i++;
  }
}

// Main command handling
switch (command) {
  case 'analyze':
    analyzeDirectory(target, options);
    break;
    
  case 'bundle':
    analyzeBundles(target, options);
    break;
    
  case 'report':
    generateReport(options);
    break;
    
  case 'monitor':
    showMonitoringData();
    break;
    
  case 'cleanup':
    cleanup();
    break;
    
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
    
  default:
    console.error(`❌ Unknown command: ${command || 'none'}`);
    showHelp();
    process.exit(1);
}