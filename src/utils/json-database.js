/**
 * Database utility for simple JSON-based storage
 * Can be easily replaced with a real database later
 */

const fs = require('fs');
const path = require('path');

class JsonDatabase {
  constructor(dataDir = 'data') {
    this.dataDir = path.join(process.cwd(), dataDir);
    this.ensureDataDir();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  getFilePath(collection) {
    return path.join(this.dataDir, `${collection}.json`);
  }

  read(collection) {
    try {
      const filePath = this.getFilePath(collection);
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
      return [];
    }
  }

  write(collection, data) {
    try {
      const filePath = this.getFilePath(collection);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`Error writing ${collection}:`, error);
      return false;
    }
  }

  insert(collection, item) {
    const data = this.read(collection);
    const newItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...item
    };
    data.push(newItem);
    this.write(collection, data);
    return newItem;
  }

  findById(collection, id) {
    const data = this.read(collection);
    return data.find(item => item.id === id);
  }

  findBy(collection, criteria) {
    const data = this.read(collection);
    return data.filter(item => {
      return Object.keys(criteria).every(key => item[key] === criteria[key]);
    });
  }

  update(collection, id, updates) {
    const data = this.read(collection);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.write(collection, data);
    return data[index];
  }

  delete(collection, id) {
    const data = this.read(collection);
    const filteredData = data.filter(item => item.id !== id);
    this.write(collection, filteredData);
    return data.length !== filteredData.length;
  }
}

module.exports = JsonDatabase;
