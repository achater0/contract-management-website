// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'contracts.db');
const db = new sqlite3.Database(dbPath);

// db.js
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contracts (
      id TEXT PRIMARY KEY,
      sequence INTEGER NOT NULL,
      data TEXT NOT NULL,  -- This will store your entire JSON formData object
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;