#!/usr/bin/env node

/**
 * CSS Bundling Tool
 * Bundles third-party CSS dependencies with existing SASS compilation
 * Part of the build system to eliminate CDN dependencies
 */

const fs = require('fs');
const path = require('path');

// Configuration
const isDevelopment = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
const config = {
    nodeModulesPath: path.join(process.cwd(), 'node_modules'),
    outputPath: isDevelopment ? path.join(process.cwd(), 'public', 'css') : path.join(process.cwd(), 'docs', 'css'),
    tempPath: path.join(process.cwd(), 'temp'),
    
    // CSS dependencies to bundle (in order)
    dependencies: [
        'bootstrap-table/dist/bootstrap-table.min.css'
    ]
};

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Read file safely
 */
function readFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        } else {
            console.warn(`⚠️  Warning: File not found: ${filePath}`);
            return '';
        }
    } catch (error) {
        console.warn(`⚠️  Warning: Could not read ${filePath}: ${error.message}`);
        return '';
    }
}

/**
 * Bundle CSS dependencies
 */
function bundleDependencies() {
    console.log('🎨 Bundling CSS dependencies...');
    
    let bundledContent = '';
    let foundDependencies = [];
    
    // Add header comment
    bundledContent += `/* CSS Dependencies Bundle - Generated ${new Date().toISOString()} */\n\n`;
    
    // Bundle each dependency
    for (const dep of config.dependencies) {
        const depPath = path.join(config.nodeModulesPath, dep);
        const content = readFile(depPath);
        
        if (content) {
            bundledContent += `/* ${dep} */\n`;
            bundledContent += content + '\n\n';
            foundDependencies.push(dep);
            console.log(`✅ Added: ${dep}`);
        } else {
            console.warn(`⚠️  Skipped: ${dep} (not found)`);
        }
    }
    
    // Write dependencies bundle
    const depsOutput = path.join(config.outputPath, 'dependencies.css');
    fs.writeFileSync(depsOutput, bundledContent);
    
    return {
        file: depsOutput,
        dependencies: foundDependencies,
        size: bundledContent.length
    };
}

/**
 * Generate build report
 */
function generateReport(results) {
    const report = {
        timestamp: new Date().toISOString(),
        dependencies: results.dependencies.dependencies,
        totalFiles: results.dependencies.dependencies.length,
        totalSize: results.dependencies.size
    };
    
    // Write report
    ensureDir(path.join(config.tempPath, 'reports'));
    const reportPath = path.join(config.tempPath, 'reports', 'css-bundle-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 CSS Bundle Report:');
    console.log(`   Dependencies: ${report.dependencies.length} files`);
    console.log(`   Total Size: ${(report.totalSize / 1024).toFixed(2)} KB`);
    console.log(`   Report: ${reportPath}`);
    
    return report;
}

/**
 * Main bundling process
 */
async function main() {
    console.log('🚀 Starting CSS dependency bundling process...\n');
    
    try {
        // Ensure output directory exists
        ensureDir(config.outputPath);
        
        // Bundle dependencies
        const dependenciesResult = bundleDependencies();
        
        // Generate report
        const report = generateReport({
            dependencies: dependenciesResult
        });
        
        console.log('\n✅ CSS dependency bundling completed successfully!');
        
        return report;
        
    } catch (error) {
        console.error('❌ CSS dependency bundling failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main, config };