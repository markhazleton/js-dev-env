/**
 * Tests for JSON Database utility
 */
const JsonDatabase = require('../../utils/json-database');
const fs = require('fs');
const path = require('path');

describe('JsonDatabase', () => {
  let db;
  const testDir = path.join(process.cwd(), 'data', 'test-db');
  const testCollection = 'test-collection';

  beforeEach(() => {
    // Use a test-specific directory
    db = new JsonDatabase('data/test-db');
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      const files = fs.readdirSync(testDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(testDir, file));
      });
      fs.rmdirSync(testDir);
    }
  });

  describe('Initialization', () => {
    test('should create data directory if it does not exist', () => {
      expect(fs.existsSync(testDir)).toBe(true);
    });

    test('should use provided data directory', () => {
      const _customDb = new JsonDatabase('data/custom-test');
      const customDir = path.join(process.cwd(), 'data', 'custom-test');
      
      expect(fs.existsSync(customDir)).toBe(true);
      
      // Clean up
      fs.rmdirSync(customDir);
    });

    test('should create nested directories', () => {
      const _nestedDb = new JsonDatabase('data/nested/test/dir');
      const nestedDir = path.join(process.cwd(), 'data', 'nested', 'test', 'dir');
      
      expect(fs.existsSync(nestedDir)).toBe(true);
      
      // Clean up
      fs.rmdirSync(path.join(process.cwd(), 'data', 'nested', 'test', 'dir'));
      fs.rmdirSync(path.join(process.cwd(), 'data', 'nested', 'test'));
      fs.rmdirSync(path.join(process.cwd(), 'data', 'nested'));
    });
  });

  describe('read and write', () => {
    test('should return empty array for non-existent collection', () => {
      const data = db.read('non-existent');
      expect(data).toEqual([]);
    });

    test('should write and read data', () => {
      const testData = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' }
      ];

      db.write(testCollection, testData);
      const readData = db.read(testCollection);

      expect(readData).toEqual(testData);
    });

    test('should overwrite existing data', () => {
      const data1 = [{ id: '1', name: 'Original' }];
      const data2 = [{ id: '1', name: 'Updated' }];

      db.write(testCollection, data1);
      db.write(testCollection, data2);

      const result = db.read(testCollection);
      expect(result).toEqual(data2);
    });

    test('should return true on successful write', () => {
      const result = db.write(testCollection, []);
      expect(result).toBe(true);
    });

    test('should format JSON with proper indentation', () => {
      const testData = [{ id: '1', name: 'Test' }];
      db.write(testCollection, testData);

      const filePath = db.getFilePath(testCollection);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Check that it's formatted (has newlines and spaces)
      expect(fileContent).toContain('\n');
      expect(fileContent).toContain('  ');
    });
  });

  describe('insert', () => {
    test('should insert new item', () => {
      const item = { name: 'New Item', value: 100 };
      const inserted = db.insert(testCollection, item);

      expect(inserted).toHaveProperty('id');
      expect(inserted).toHaveProperty('createdAt');
      expect(inserted.name).toBe('New Item');
      expect(inserted.value).toBe(100);
    });

    test('should generate unique IDs', () => {
      const item1 = db.insert(testCollection, { name: 'Item 1' });
      const item2 = db.insert(testCollection, { name: 'Item 2' });

      expect(item1.id).not.toBe(item2.id);
    });

    test('should add timestamp on insert', () => {
      const item = db.insert(testCollection, { name: 'Timestamped' });
      
      expect(item).toHaveProperty('createdAt');
      expect(new Date(item.createdAt)).toBeInstanceOf(Date);
    });

    test('should insert into existing collection', () => {
      db.insert(testCollection, { name: 'Item 1' });
      db.insert(testCollection, { name: 'Item 2' });

      const data = db.read(testCollection);
      expect(data).toHaveLength(2);
    });

    test('should preserve existing item properties', () => {
      const item = {
        name: 'Test',
        nested: { key: 'value' },
        array: [1, 2, 3]
      };

      const inserted = db.insert(testCollection, item);

      expect(inserted.name).toBe('Test');
      expect(inserted.nested).toEqual({ key: 'value' });
      expect(inserted.array).toEqual([1, 2, 3]);
    });
  });

  describe('findById', () => {
    test('should find item by ID', () => {
      const inserted = db.insert(testCollection, { name: 'Find Me' });
      const found = db.findById(testCollection, inserted.id);

      expect(found).toEqual(inserted);
    });

    test('should return undefined for non-existent ID', () => {
      db.insert(testCollection, { name: 'Item' });
      const found = db.findById(testCollection, 'non-existent-id');

      expect(found).toBeUndefined();
    });

    test('should handle empty collection', () => {
      const found = db.findById(testCollection, 'any-id');
      expect(found).toBeUndefined();
    });
  });

  describe('findBy', () => {
    beforeEach(() => {
      db.insert(testCollection, { name: 'John', age: 30, city: 'NYC' });
      db.insert(testCollection, { name: 'Jane', age: 25, city: 'LA' });
      db.insert(testCollection, { name: 'Bob', age: 30, city: 'NYC' });
    });

    test('should find items by single criterion', () => {
      const results = db.findBy(testCollection, { age: 30 });
      expect(results).toHaveLength(2);
      expect(results.every(item => item.age === 30)).toBe(true);
    });

    test('should find items by multiple criteria', () => {
      const results = db.findBy(testCollection, { age: 30, city: 'NYC' });
      expect(results).toHaveLength(2);
      expect(results.every(item => item.age === 30 && item.city === 'NYC')).toBe(true);
    });

    test('should return empty array when no matches', () => {
      const results = db.findBy(testCollection, { age: 99 });
      expect(results).toEqual([]);
    });

    test('should return all items for empty criteria', () => {
      const results = db.findBy(testCollection, {});
      expect(results).toHaveLength(3);
    });

    test('should handle non-existent collection', () => {
      const results = db.findBy('non-existent', { name: 'Test' });
      expect(results).toEqual([]);
    });
  });

  describe('update', () => {
    test('should update existing item', () => {
      const inserted = db.insert(testCollection, { name: 'Original', value: 100 });
      const updated = db.update(testCollection, inserted.id, { name: 'Updated', value: 200 });

      expect(updated.name).toBe('Updated');
      expect(updated.value).toBe(200);
      expect(updated.id).toBe(inserted.id);
    });

    test('should add updatedAt timestamp', () => {
      const inserted = db.insert(testCollection, { name: 'Test' });
      const updated = db.update(testCollection, inserted.id, { name: 'Updated' });

      expect(updated).toHaveProperty('updatedAt');
      expect(new Date(updated.updatedAt)).toBeInstanceOf(Date);
    });

    test('should preserve original properties not in updates', () => {
      const inserted = db.insert(testCollection, { name: 'Test', value: 100, extra: 'data' });
      const updated = db.update(testCollection, inserted.id, { name: 'Updated' });

      expect(updated.value).toBe(100);
      expect(updated.extra).toBe('data');
    });

    test('should return null for non-existent ID', () => {
      const updated = db.update(testCollection, 'non-existent-id', { name: 'Updated' });
      expect(updated).toBeNull();
    });

    test('should persist changes to disk', () => {
      const inserted = db.insert(testCollection, { name: 'Original' });
      db.update(testCollection, inserted.id, { name: 'Updated' });

      const found = db.findById(testCollection, inserted.id);
      expect(found.name).toBe('Updated');
    });
  });

  describe('delete', () => {
    test('should delete existing item', () => {
      const inserted = db.insert(testCollection, { name: 'To Delete' });
      const deleted = db.delete(testCollection, inserted.id);

      expect(deleted).toBe(true);

      const found = db.findById(testCollection, inserted.id);
      expect(found).toBeUndefined();
    });

    test('should return false for non-existent ID', () => {
      const deleted = db.delete(testCollection, 'non-existent-id');
      expect(deleted).toBe(false);
    });

    test('should not affect other items', () => {
      const item1 = db.insert(testCollection, { name: 'Keep 1' });
      const item2 = db.insert(testCollection, { name: 'Delete' });
      const item3 = db.insert(testCollection, { name: 'Keep 2' });

      db.delete(testCollection, item2.id);

      expect(db.findById(testCollection, item1.id)).toBeDefined();
      expect(db.findById(testCollection, item3.id)).toBeDefined();
      expect(db.findById(testCollection, item2.id)).toBeUndefined();
    });

    test('should handle empty collection', () => {
      const deleted = db.delete(testCollection, 'any-id');
      expect(deleted).toBe(false);
    });
  });

  describe('getFilePath', () => {
    test('should generate correct file path', () => {
      const filePath = db.getFilePath('test');
      expect(filePath).toContain('test.json');
      expect(path.isAbsolute(filePath)).toBe(true);
    });

    test('should use collection name in path', () => {
      const filePath = db.getFilePath('users');
      expect(filePath).toContain('users.json');
    });
  });

  describe('Error Handling', () => {
    test('should handle read errors gracefully', () => {
      // Mock console.error to suppress error output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Create invalid JSON file
      const filePath = db.getFilePath('corrupt');
      fs.writeFileSync(filePath, 'invalid json{', 'utf8');

      const data = db.read('corrupt');
      expect(data).toEqual([]);

      consoleSpy.mockRestore();
    });

    test('should handle complex nested objects', () => {
      const complexItem = {
        name: 'Complex',
        nested: {
          deep: {
            deeper: {
              value: 'test'
            }
          }
        },
        array: [{ id: 1 }, { id: 2 }]
      };

      const inserted = db.insert(testCollection, complexItem);
      const found = db.findById(testCollection, inserted.id);

      expect(found.nested.deep.deeper.value).toBe('test');
      expect(found.array).toHaveLength(2);
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete CRUD workflow', () => {
      // Create
      const created = db.insert(testCollection, { name: 'Test User', email: 'test@example.com' });
      expect(created.id).toBeDefined();

      // Read
      const found = db.findById(testCollection, created.id);
      expect(found.email).toBe('test@example.com');

      // Update
      const updated = db.update(testCollection, created.id, { email: 'updated@example.com' });
      expect(updated.email).toBe('updated@example.com');

      // Delete
      const deleted = db.delete(testCollection, created.id);
      expect(deleted).toBe(true);

      // Verify deletion
      const notFound = db.findById(testCollection, created.id);
      expect(notFound).toBeUndefined();
    });

    test('should handle multiple collections independently', () => {
      db.insert('users', { name: 'User 1' });
      db.insert('posts', { title: 'Post 1' });

      const users = db.read('users');
      const posts = db.read('posts');

      expect(users).toHaveLength(1);
      expect(posts).toHaveLength(1);
      expect(users[0].name).toBe('User 1');
      expect(posts[0].title).toBe('Post 1');
    });
  });
});
