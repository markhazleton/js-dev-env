#!/usr/bin/env node

/**
 * Security Validation Script
 * 
 * This script validates the SRI hashes of external resources
 * and checks for potential security issues in your application.
 */

const { validateTrustedResources } = require('../../utils/security');
const fs = require('fs');
const path = require('path');

console.log('🔒 Running Security Validation...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

async function main() {
  try {
    console.log(colorize('📋 Validating external resource integrity...', 'blue'));
    
    const results = await validateTrustedResources();
    let allValid = true;
    
    for (const [library, resources] of Object.entries(results)) {
      console.log(`\n📦 ${library.toUpperCase()}:`);
      
      for (const [resourceType, resource] of Object.entries(resources)) {
        if (resource.valid !== undefined) {
          const status = resource.valid ? 
            colorize('✅ VALID', 'green') : 
            colorize('❌ INVALID', 'red');
          console.log(`  ${resourceType}: ${status}`);
          
          if (!resource.valid) {
            allValid = false;
            if (resource.error) {
              console.log(`    Error: ${colorize(resource.error, 'red')}`);
            }
          }
        } else {
          // Handle nested resources
          for (const [subType, subResource] of Object.entries(resource)) {
            const status = subResource.valid ? 
              colorize('✅ VALID', 'green') : 
              colorize('❌ INVALID', 'red');
            console.log(`  ${resourceType}.${subType}: ${status}`);
            
            if (!subResource.valid) {
              allValid = false;
              if (subResource.error) {
                console.log(`    Error: ${colorize(subResource.error, 'red')}`);
              }
            }
          }
        }
      }
    }
    
    console.log('\n' + '='.repeat(50));
    
    if (allValid) {
      console.log(colorize('✅ All external resources have valid SRI hashes!', 'green'));
    } else {
      console.log(colorize('❌ Some external resources have invalid SRI hashes!', 'red'));
      console.log(colorize('⚠️  This could indicate a security risk.', 'yellow'));
    }
    
    // Check for potential security issues in templates
    console.log('\n' + colorize('🔍 Checking for potential security issues...', 'blue'));
    
    const viewsDir = path.join(__dirname, '..', '..', 'views');
    const templateFiles = fs.readdirSync(viewsDir).filter(file => file.endsWith('.ejs'));
    
    let securityIssues = [];
    
    for (const file of templateFiles) {
      const filePath = path.join(viewsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for scripts without SRI
      const scriptMatches = content.match(/script[^>]*src=["']https?:\/\/[^"']*["'][^>]*>/gi);
      if (scriptMatches) {
        for (const script of scriptMatches) {
          if (!script.includes('integrity=')) {
            securityIssues.push({
              file,
              issue: 'External script without SRI hash',
              line: script.trim()
            });
          }
        }
      }
      
      // Check for stylesheets without SRI
      const linkMatches = content.match(/link[^>]*href=["']https?:\/\/[^"']*["'][^>]*>/gi);
      if (linkMatches) {
        for (const link of linkMatches) {
          if (link.includes('stylesheet') && !link.includes('integrity=')) {
            securityIssues.push({
              file,
              issue: 'External stylesheet without SRI hash',
              line: link.trim()
            });
          }
        }
      }
      
      // Check for inline scripts (potential CSP violations)
      const inlineScripts = content.match(/<script[^>]*>[\s\S]*?<\/script>/gi);
      if (inlineScripts) {
        for (const script of inlineScripts) {
          if (!script.includes('src=') && !script.includes('nonce=')) {
            securityIssues.push({
              file,
              issue: 'Inline script detected without nonce (may violate CSP)',
              line: script.substring(0, 100) + '...'
            });
          }
        }
      }
    }
    
    if (securityIssues.length === 0) {
      console.log(colorize('✅ No security issues found in templates!', 'green'));
    } else {
      console.log(colorize(`⚠️  Found ${securityIssues.length} potential security issue(s):`, 'yellow'));
      
      securityIssues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${colorize(issue.file, 'cyan')}`);
        console.log(`   Issue: ${colorize(issue.issue, 'yellow')}`);
        console.log(`   Code: ${issue.line}`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(colorize('🔒 Security validation complete!', 'blue'));
    
    // Recommendations
    console.log('\n' + colorize('💡 Security Recommendations:', 'cyan'));
    console.log('1. Always use SRI hashes for external resources');
    console.log('2. Keep external libraries updated to latest versions');
    console.log('3. Use HTTPS for all external resources');
    console.log('4. Implement strict Content Security Policy');
    console.log('5. Regularly audit and validate external dependencies');
    
  } catch (error) {
    console.error(colorize(`❌ Error during security validation: ${error.message}`, 'red'));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
