/**
 * Simple database abstraction layer
 * 
 * This file provides a foundation for adding database support.
 * Uncomment and modify the relevant sections when you're ready to add a database.
 */

// For JSON file-based storage
const fs = require('fs').promises;
const path = require('path');

class FileDatabase {
  constructor(dataFolder = 'data') {
    this.dataFolder = path.join(process.cwd(), dataFolder);
  }

  // Initialize the database (create folder if needed)
  async init() {
    try {
      await fs.mkdir(this.dataFolder, { recursive: true });
      return true;
    } catch (error) {
      console.error('Failed to initialize file database:', error);
      return false;
    }
  }

  // Get a collection (file)
  async getCollection(name) {
    const filePath = path.join(this.dataFolder, `${name}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  // Save a collection (file)
  async saveCollection(name, data) {
    const filePath = path.join(this.dataFolder, `${name}.json`);
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error(`Failed to save collection ${name}:`, error);
      return false;
    }
  }
}

// Export the file database by default
module.exports = {
  FileDatabase,
  
  // Factory method to get the appropriate database
  getDatabase: function(type = 'file') {
    switch (type) {
      case 'file':
        return new FileDatabase();
      // Add more database types here as needed
      // case 'mongodb':
      //   return new MongoDatabase();
      // case 'sqlite':
      //   return new SQLiteDatabase();
      default:
        return new FileDatabase();
    }
  }
};