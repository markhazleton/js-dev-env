/**
 * Simple in-memory cache utility
 */
const cacheUtils = {
  cache: new Map(),
  
  // Get a value from cache
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Return null if item is expired
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  // Set a value in cache with optional TTL in milliseconds
  set(key, value, ttl = null) {
    const expiry = ttl ? Date.now() + ttl : null;
    this.cache.set(key, { value, expiry });
    return value;
  },
  
  // Remove a value from cache
  remove(key) {
    return this.cache.delete(key);
  },
  
  // Clear the entire cache
  clear() {
    this.cache.clear();
  }
};

module.exports = cacheUtils;