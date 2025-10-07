/**
 * Tests for Database Utilities
 */

const fs = require('fs').promises;
const path = require('path');
const { FileDatabase, getDatabase } = require('../../utils/database');

// Mock fs.promises
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

describe('FileDatabase', () => {
  let db;
  const testDataFolder = 'test-data';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    db = new FileDatabase(testDataFolder);
  });

  describe('Constructor', () => {
    test('should create instance with default data folder', () => {
      const defaultDb = new FileDatabase();
      expect(defaultDb.dataFolder).toBe(path.join(process.cwd(), 'data'));
    });

    test('should create instance with custom data folder', () => {
      expect(db.dataFolder).toBe(path.join(process.cwd(), testDataFolder));
    });

    test('should handle absolute path data folder', () => {
      const absolutePath = '/absolute/path/data';
      const absoluteDb = new FileDatabase(absolutePath);
      expect(absoluteDb.dataFolder).toBe(path.join(process.cwd(), absolutePath));
    });
  });

  describe('init', () => {
    test('should create data folder if it does not exist', async () => {
      fs.mkdir.mockResolvedValue(undefined);

      const result = await db.init();

      expect(fs.mkdir).toHaveBeenCalledWith(
        path.join(process.cwd(), testDataFolder),
        { recursive: true }
      );
      expect(result).toBe(true);
    });

    test('should return true when folder already exists', async () => {
      fs.mkdir.mockResolvedValue(undefined);

      const result = await db.init();

      expect(result).toBe(true);
    });

    test('should handle initialization errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      fs.mkdir.mockRejectedValue(new Error('Permission denied'));

      const result = await db.init();

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initialize file database:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    test('should use recursive option for nested folders', async () => {
      fs.mkdir.mockResolvedValue(undefined);

      await db.init();

      expect(fs.mkdir).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ recursive: true })
      );
    });
  });

  describe('getCollection', () => {
    test('should read and parse collection file', async () => {
      const testData = [{ id: 1, name: 'Test' }];
      fs.readFile.mockResolvedValue(JSON.stringify(testData));

      const result = await db.getCollection('users');

      expect(fs.readFile).toHaveBeenCalledWith(
        path.join(process.cwd(), testDataFolder, 'users.json'),
        'utf-8'
      );
      expect(result).toEqual(testData);
    });

    test('should return empty array when file does not exist', async () => {
      const error = new Error('File not found');
      error.code = 'ENOENT';
      fs.readFile.mockRejectedValue(error);

      const result = await db.getCollection('nonexistent');

      expect(result).toEqual([]);
    });

    test('should throw error for other read failures', async () => {
      const error = new Error('Permission denied');
      error.code = 'EACCES';
      fs.readFile.mockRejectedValue(error);

      await expect(db.getCollection('users')).rejects.toThrow('Permission denied');
    });

    test('should handle empty JSON file', async () => {
      fs.readFile.mockResolvedValue('[]');

      const result = await db.getCollection('empty');

      expect(result).toEqual([]);
    });

    test('should handle complex nested data', async () => {
      const complexData = [
        {
          id: 1,
          nested: {
            deep: {
              value: 'test'
            }
          },
          array: [1, 2, 3]
        }
      ];
      fs.readFile.mockResolvedValue(JSON.stringify(complexData));

      const result = await db.getCollection('complex');

      expect(result).toEqual(complexData);
    });

    test('should throw error for invalid JSON', async () => {
      fs.readFile.mockResolvedValue('{ invalid json }');

      await expect(db.getCollection('invalid')).rejects.toThrow();
    });

    test('should construct correct file path', async () => {
      fs.readFile.mockResolvedValue('[]');

      await db.getCollection('test-collection');

      expect(fs.readFile).toHaveBeenCalledWith(
        path.join(process.cwd(), testDataFolder, 'test-collection.json'),
        'utf-8'
      );
    });
  });

  describe('saveCollection', () => {
    test('should save collection to file', async () => {
      const testData = [{ id: 1, name: 'Test' }];
      fs.writeFile.mockResolvedValue(undefined);

      const result = await db.saveCollection('users', testData);

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(process.cwd(), testDataFolder, 'users.json'),
        JSON.stringify(testData, null, 2),
        'utf-8'
      );
      expect(result).toBe(true);
    });

    test('should format JSON with proper indentation', async () => {
      const testData = { key: 'value' };
      fs.writeFile.mockResolvedValue(undefined);

      await db.saveCollection('formatted', testData);

      const expectedJson = JSON.stringify(testData, null, 2);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expectedJson,
        'utf-8'
      );
    });

    test('should handle save errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      fs.writeFile.mockRejectedValue(new Error('Disk full'));

      const result = await db.saveCollection('users', []);

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save collection users:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    test('should save empty array', async () => {
      fs.writeFile.mockResolvedValue(undefined);

      const result = await db.saveCollection('empty', []);

      expect(result).toBe(true);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        '[]',
        'utf-8'
      );
    });

    test('should save complex nested data', async () => {
      const complexData = {
        users: [
          { id: 1, profile: { name: 'Test', tags: ['a', 'b'] } }
        ]
      };
      fs.writeFile.mockResolvedValue(undefined);

      const result = await db.saveCollection('complex', complexData);

      expect(result).toBe(true);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify(complexData, null, 2),
        'utf-8'
      );
    });

    test('should construct correct file path', async () => {
      fs.writeFile.mockResolvedValue(undefined);

      await db.saveCollection('test-collection', []);

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(process.cwd(), testDataFolder, 'test-collection.json'),
        expect.any(String),
        'utf-8'
      );
    });
  });

  describe('Integration', () => {
    test('should handle init, save, and get workflow', async () => {
      const testData = [{ id: 1, name: 'Integration Test' }];
      
      fs.mkdir.mockResolvedValue(undefined);
      fs.writeFile.mockResolvedValue(undefined);
      fs.readFile.mockResolvedValue(JSON.stringify(testData));

      // Initialize
      const initResult = await db.init();
      expect(initResult).toBe(true);

      // Save
      const saveResult = await db.saveCollection('integration', testData);
      expect(saveResult).toBe(true);

      // Get
      const getData = await db.getCollection('integration');
      expect(getData).toEqual(testData);
    });

    test('should handle multiple collections independently', async () => {
      const users = [{ id: 1, type: 'user' }];
      const posts = [{ id: 1, type: 'post' }];

      fs.writeFile.mockResolvedValue(undefined);
      fs.readFile
        .mockResolvedValueOnce(JSON.stringify(users))
        .mockResolvedValueOnce(JSON.stringify(posts));

      await db.saveCollection('users', users);
      await db.saveCollection('posts', posts);

      const usersData = await db.getCollection('users');
      const postsData = await db.getCollection('posts');

      expect(usersData).toEqual(users);
      expect(postsData).toEqual(posts);
      expect(fs.writeFile).toHaveBeenCalledTimes(2);
      expect(fs.readFile).toHaveBeenCalledTimes(2);
    });

    test('should handle get before save returns empty array', async () => {
      const error = new Error('File not found');
      error.code = 'ENOENT';
      fs.readFile.mockRejectedValue(error);

      const result = await db.getCollection('not-yet-created');

      expect(result).toEqual([]);
    });
  });
});

describe('getDatabase Factory', () => {
  test('should return FileDatabase instance by default', () => {
    const db = getDatabase();
    expect(db).toBeInstanceOf(FileDatabase);
  });

  test('should return FileDatabase instance for "file" type', () => {
    const db = getDatabase('file');
    expect(db).toBeInstanceOf(FileDatabase);
  });

  test('should return FileDatabase instance for unknown types', () => {
    const db = getDatabase('unknown');
    expect(db).toBeInstanceOf(FileDatabase);
  });

  test('should create independent instances', () => {
    const db1 = getDatabase('file');
    const db2 = getDatabase('file');
    expect(db1).not.toBe(db2);
  });

  test('should handle null type parameter', () => {
    const db = getDatabase(null);
    expect(db).toBeInstanceOf(FileDatabase);
  });

  test('should handle undefined type parameter', () => {
    const db = getDatabase(undefined);
    expect(db).toBeInstanceOf(FileDatabase);
  });
});
