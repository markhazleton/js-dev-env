#!/usr/bin/env node

/**
 * JavaScript Bundling Tool
 * Bundles third-party dependencies and custom JavaScript files
 * Part of the build system to eliminate CDN dependencies
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    nodeModulesPath: path.join(process.cwd(), 'node_modules'),
    publicJsPath: path.join(process.cwd(), 'src', 'public', 'js'),
    outputPath: path.join(process.cwd(), 'docs', 'js'),
    tempPath: path.join(process.cwd(), 'temp'),
    
    // Dependencies to bundle (in order)
    dependencies: [
        'bootstrap/dist/js/bootstrap.bundle.min.js',
        'jquery/dist/jquery.min.js',
        'bootstrap-table/dist/bootstrap-table.min.js',
        'bootstrap-table/dist/extensions/export/bootstrap-table-export.min.js'
    ],
    
    // Custom JS files to include
    customFiles: [
        'custom.js',
        'song-detail.js',
        'theme-demo.js',
        'theme-toggle.js',
        'component-library.js',
        'form-validation.js',
        'script.js',
        'service-worker-register.js'
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
 * Bundle dependencies
 */
function bundleDependencies() {
    console.log('📦 Bundling JavaScript dependencies...');
    
    let bundledContent = '';
    let foundDependencies = [];
    
    // Add header comment
    bundledContent += `/* JS Dependencies Bundle - Generated ${new Date().toISOString()} */\n\n`;
    
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
    const depsOutput = path.join(config.outputPath, 'dependencies.js');
    fs.writeFileSync(depsOutput, bundledContent);
    
    return {
        file: depsOutput,
        dependencies: foundDependencies,
        size: bundledContent.length
    };
}

/**
 * Bundle custom JavaScript files
 */
function bundleCustomFiles() {
    console.log('🔧 Bundling custom JavaScript files...');
    
    let bundledContent = '';
    let foundFiles = [];
    
    // Add header comment
    bundledContent += `/* Custom JS Bundle - Generated ${new Date().toISOString()} */\n\n`;
    
    // Bundle each custom file
    for (const file of config.customFiles) {
        const filePath = path.join(config.publicJsPath, file);
        const content = readFile(filePath);
        
        if (content) {
            bundledContent += `/* ${file} */\n`;
            bundledContent += content + '\n\n';
            foundFiles.push(file);
            console.log(`✅ Added: ${file}`);
        } else {
            console.warn(`⚠️  Skipped: ${file} (not found)`);
        }
    }
    
    // Write custom bundle
    const customOutput = path.join(config.outputPath, 'custom.js');
    fs.writeFileSync(customOutput, bundledContent);
    
    return {
        file: customOutput,
        files: foundFiles,
        size: bundledContent.length
    };
}

/**
 * Minify JavaScript file
 */
function minifyFile(inputFile, outputFile) {
    try {
        console.log(`🗜️  Minifying: ${path.basename(inputFile)}`);
        
        // Use uglify-js to minify - Use array form to prevent command injection
        const { spawnSync } = require('child_process');
        const result = spawnSync('npx', ['uglifyjs', inputFile, '-o', outputFile, '--compress', '--mangle'], { stdio: 'pipe' });
        if (result.error) throw result.error;
        
        const originalSize = fs.statSync(inputFile).size;
        const minifiedSize = fs.statSync(outputFile).size;
        const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        
        console.log(`   📉 Reduced by ${savings}% (${originalSize} → ${minifiedSize} bytes)`);
        
        return { originalSize, minifiedSize, savings };
    } catch (error) {
        console.error(`❌ Minification failed for ${inputFile}: ${error.message}`);
        // Copy original file if minification fails
        fs.copyFileSync(inputFile, outputFile);
        return null;
    }
}

/**
 * Generate build report
 */
function generateReport(results) {
    const report = {
        timestamp: new Date().toISOString(),
        dependencies: results.dependencies,
        customFiles: results.customFiles,
        minification: results.minification,
        totalFiles: results.dependencies.dependencies.length + results.customFiles.files.length,
        totalSize: results.dependencies.size + results.customFiles.size
    };
    
    // Write report
    ensureDir(path.join(config.tempPath, 'reports'));
    const reportPath = path.join(config.tempPath, 'reports', 'js-bundle-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Build Report:');
    console.log(`   Dependencies: ${report.dependencies.dependencies.length} files`);
    console.log(`   Custom Files: ${report.customFiles.files.length} files`);
    console.log(`   Total Size: ${(report.totalSize / 1024).toFixed(2)} KB`);
    console.log(`   Report: ${reportPath}`);
    
    return report;
}

/**
 * Main bundling process
 */
async function main() {
    console.log('🚀 Starting JavaScript bundling process...\n');
    
    try {
        // Ensure output directory exists
        ensureDir(config.outputPath);
        
        // Bundle dependencies
        const dependenciesResult = bundleDependencies();
        
        // Bundle custom files
        const customResult = bundleCustomFiles();
        
        // Minify bundles
        console.log('\n🗜️  Minifying bundles...');
        
        const depsMinified = minifyFile(
            dependenciesResult.file,
            path.join(config.outputPath, 'dependencies.min.js')
        );
        
        const customMinified = minifyFile(
            customResult.file,
            path.join(config.outputPath, 'custom.min.js')
        );
        
        // Generate report
        const report = generateReport({
            dependencies: dependenciesResult,
            customFiles: customResult,
            minification: {
                dependencies: depsMinified,
                custom: customMinified
            }
        });
        
        console.log('\n✅ JavaScript bundling completed successfully!');
        
        return report;
        
    } catch (error) {
        console.error('❌ JavaScript bundling failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main, config };