/**
 * Security Utilities for External Resource Management
 * 
 * This module provides utilities for managing external resources securely,
 * including SRI hash generation and verification.
 */

const crypto = require('crypto');
const https = require('https');

/**
 * Generate SRI hash for a given URL
 * @param {string} url - The URL of the external resource
 * @returns {Promise<string>} The SRI hash string
 */
async function generateSRIHash(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch resource: ${response.statusCode}`));
        return;
      }

      const hash = crypto.createHash('sha384');
      
      response.on('data', (chunk) => {
        hash.update(chunk);
      });

      response.on('end', () => {
        const base64Hash = hash.digest('base64');
        resolve(`sha384-${base64Hash}`);
      });

      response.on('error', (error) => {
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Verify if an SRI hash matches the content at a URL
 * @param {string} url - The URL of the external resource
 * @param {string} expectedHash - The expected SRI hash (with algorithm prefix)
 * @returns {Promise<boolean>} True if hash matches, false otherwise
 */
async function verifySRIHash(url, expectedHash) {
  try {
    const actualHash = await generateSRIHash(url);
    return actualHash === expectedHash;
  } catch (error) {
    console.error('Error verifying SRI hash:', error);
    return false;
  }
}

/**
 * Recommended external resources with their verified SRI hashes
 */
const TRUSTED_RESOURCES = {
  bootstrap: {
    js: {
      url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
      integrity: 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz',
      crossorigin: 'anonymous'
    }
  },
  highlightjs: {
    js: {
      url: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/highlight.min.js',
      integrity: 'sha384-GdEWAbCjn+ghjX0gLx7/N1hyTVmPAjdC2OvoAA0RyNcAOhqwtT8qnbCxWle2+uJX',
      crossorigin: 'anonymous'
    },
    css: {
      default: {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/default.min.css',
        integrity: 'sha384-4Y0nObtF3CbKnh+lpzmAVdAMtQXl+ganWiiv73RcGVdRdfVIya8Cao1C8ZsVRRDz',
        crossorigin: 'anonymous'
      },
      light: {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github.min.css',
        integrity: 'sha384-eFTL69TLRZTkNfYZOLM+G04821K1qZao/4QLJbet1pP4tcF+fdXq/9CdqAbWRl/L',
        crossorigin: 'anonymous'
      },
      dark: {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github-dark.min.css',
        integrity: 'sha384-wH75j6z1lH97ZOpMOInqhgKzFkAInZPPSPlZpYKYTOqsaizPvhQZmAtLcPKXpLyH',
        crossorigin: 'anonymous'
      }
    }
  }
};

/**
 * Security headers for external resources
 */
const SECURITY_HEADERS = {
  crossorigin: 'anonymous',
  referrerpolicy: 'no-referrer'
};

/**
 * Validate that all external resources in TRUSTED_RESOURCES have valid SRI hashes
 * @returns {Promise<Object>} Validation results
 */
async function validateTrustedResources() {
  const results = {};
  
  for (const [libraryName, resources] of Object.entries(TRUSTED_RESOURCES)) {
    results[libraryName] = {};
    
    for (const [resourceType, resource] of Object.entries(resources)) {
      if (typeof resource === 'object' && resource.url && resource.integrity) {
        try {
          const isValid = await verifySRIHash(resource.url, resource.integrity);
          results[libraryName][resourceType] = {
            url: resource.url,
            valid: isValid,
            integrity: resource.integrity
          };
        } catch (error) {
          results[libraryName][resourceType] = {
            url: resource.url,
            valid: false,
            error: error.message
          };
        }
      } else if (typeof resource === 'object') {
        // Handle nested resources (like CSS light/dark themes)
        results[libraryName][resourceType] = {};
        for (const [subType, subResource] of Object.entries(resource)) {
          if (subResource.url && subResource.integrity) {
            try {
              const isValid = await verifySRIHash(subResource.url, subResource.integrity);
              results[libraryName][resourceType][subType] = {
                url: subResource.url,
                valid: isValid,
                integrity: subResource.integrity
              };
            } catch (error) {
              results[libraryName][resourceType][subType] = {
                url: subResource.url,
                valid: false,
                error: error.message
              };
            }
          }
        }
      }
    }
  }
  
  return results;
}

module.exports = {
  generateSRIHash,
  verifySRIHash,
  validateTrustedResources,
  TRUSTED_RESOURCES,
  SECURITY_HEADERS
};
