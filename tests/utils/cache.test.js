/**
 * Tests for cache utility
 */
const cacheUtils = require('../../utils/cache');

describe('Cache Utils', () => {
  beforeEach(() => {
    // Clear cache before each test
    cacheUtils.clear();
  });

  afterEach(() => {
    // Clean up after each test
    cacheUtils.clear();
  });

  describe('set and get', () => {
    test('should store and retrieve value', () => {
      cacheUtils.set('test-key', 'test-value');
      expect(cacheUtils.get('test-key')).toBe('test-value');
    });

    test('should store complex objects', () => {
      const obj = { name: 'John', age: 30, nested: { city: 'NYC' } };
      cacheUtils.set('user', obj);
      expect(cacheUtils.get('user')).toEqual(obj);
    });

    test('should store arrays', () => {
      const arr = [1, 2, 3, 4, 5];
      cacheUtils.set('numbers', arr);
      expect(cacheUtils.get('numbers')).toEqual(arr);
    });

    test('should return null for non-existent key', () => {
      expect(cacheUtils.get('non-existent')).toBeNull();
    });

    test('should overwrite existing value', () => {
      cacheUtils.set('key', 'value1');
      cacheUtils.set('key', 'value2');
      expect(cacheUtils.get('key')).toBe('value2');
    });

    test('should handle multiple keys independently', () => {
      cacheUtils.set('key1', 'value1');
      cacheUtils.set('key2', 'value2');
      cacheUtils.set('key3', 'value3');
      
      expect(cacheUtils.get('key1')).toBe('value1');
      expect(cacheUtils.get('key2')).toBe('value2');
      expect(cacheUtils.get('key3')).toBe('value3');
    });
  });

  describe('TTL (Time To Live)', () => {
    test('should respect TTL expiration', (done) => {
      cacheUtils.set('expiring-key', 'expiring-value', 100); // 100ms TTL
      
      // Value should exist immediately
      expect(cacheUtils.get('expiring-key')).toBe('expiring-value');
      
      // Value should be null after TTL expires
      setTimeout(() => {
        expect(cacheUtils.get('expiring-key')).toBeNull();
        done();
      }, 150);
    });

    test('should not expire items without TTL', (done) => {
      cacheUtils.set('permanent-key', 'permanent-value');
      
      setTimeout(() => {
        expect(cacheUtils.get('permanent-key')).toBe('permanent-value');
        done();
      }, 100);
    });

    test('should handle different TTLs for different keys', (done) => {
      cacheUtils.set('short-ttl', 'value1', 50);
      cacheUtils.set('long-ttl', 'value2', 200);
      
      setTimeout(() => {
        expect(cacheUtils.get('short-ttl')).toBeNull();
        expect(cacheUtils.get('long-ttl')).toBe('value2');
        done();
      }, 100);
    });

    test('should return set value for chaining', () => {
      const value = cacheUtils.set('key', 'value', 1000);
      expect(value).toBe('value');
    });
  });

  describe('remove', () => {
    test('should remove cached value', () => {
      cacheUtils.set('test-key', 'test-value');
      expect(cacheUtils.get('test-key')).toBe('test-value');
      
      const removed = cacheUtils.remove('test-key');
      expect(removed).toBe(true);
      expect(cacheUtils.get('test-key')).toBeNull();
    });

    test('should return false for non-existent key', () => {
      const removed = cacheUtils.remove('non-existent');
      expect(removed).toBe(false);
    });

    test('should not affect other keys', () => {
      cacheUtils.set('key1', 'value1');
      cacheUtils.set('key2', 'value2');
      
      cacheUtils.remove('key1');
      
      expect(cacheUtils.get('key1')).toBeNull();
      expect(cacheUtils.get('key2')).toBe('value2');
    });
  });

  describe('clear', () => {
    test('should remove all cached values', () => {
      cacheUtils.set('key1', 'value1');
      cacheUtils.set('key2', 'value2');
      cacheUtils.set('key3', 'value3');
      
      cacheUtils.clear();
      
      expect(cacheUtils.get('key1')).toBeNull();
      expect(cacheUtils.get('key2')).toBeNull();
      expect(cacheUtils.get('key3')).toBeNull();
    });

    test('should handle clearing empty cache', () => {
      expect(() => cacheUtils.clear()).not.toThrow();
    });

    test('should allow new items after clearing', () => {
      cacheUtils.set('key1', 'value1');
      cacheUtils.clear();
      cacheUtils.set('key2', 'value2');
      
      expect(cacheUtils.get('key1')).toBeNull();
      expect(cacheUtils.get('key2')).toBe('value2');
    });
  });

  describe('Edge Cases', () => {
    test('should handle null values', () => {
      cacheUtils.set('null-key', null);
      expect(cacheUtils.get('null-key')).toBeNull();
    });

    test('should handle undefined values', () => {
      cacheUtils.set('undefined-key', undefined);
      expect(cacheUtils.get('undefined-key')).toBeUndefined();
    });

    test('should handle empty string key', () => {
      cacheUtils.set('', 'empty-key-value');
      expect(cacheUtils.get('')).toBe('empty-key-value');
    });

    test('should handle numeric keys', () => {
      cacheUtils.set(123, 'numeric-key');
      expect(cacheUtils.get(123)).toBe('numeric-key');
    });

    test('should handle boolean values', () => {
      cacheUtils.set('bool-true', true);
      cacheUtils.set('bool-false', false);
      
      expect(cacheUtils.get('bool-true')).toBe(true);
      expect(cacheUtils.get('bool-false')).toBe(false);
    });

    test('should handle zero as value', () => {
      cacheUtils.set('zero', 0);
      expect(cacheUtils.get('zero')).toBe(0);
    });
  });

  describe('Memory Management', () => {
    test('should handle large number of entries', () => {
      for (let i = 0; i < 1000; i++) {
        cacheUtils.set(`key-${i}`, `value-${i}`);
      }
      
      expect(cacheUtils.get('key-0')).toBe('value-0');
      expect(cacheUtils.get('key-500')).toBe('value-500');
      expect(cacheUtils.get('key-999')).toBe('value-999');
    });

    test('should handle clearing large cache', () => {
      for (let i = 0; i < 1000; i++) {
        cacheUtils.set(`key-${i}`, `value-${i}`);
      }
      
      cacheUtils.clear();
      expect(cacheUtils.get('key-0')).toBeNull();
    });
  });
});
