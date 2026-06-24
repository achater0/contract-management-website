// backend/db.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Connect to Neon using your secure .env connection URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for secure cloud infrastructure
  }
});

// Initialize the table in PostgreSQL if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY,
    sequence INTEGER NOT NULL,
    data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error("❌ Error initializing PostgreSQL table:", err.message);
  } else {
    console.log("🚀 Neon PostgreSQL database connected and initialized!");
  }
});

// Helper function to translate SQLite "?" placeholders into PostgreSQL "$1, $2" format
const convertPlaceholders = (sql) => {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
};

// SQLite-to-PostgreSQL Compatibility Layer
export default {
  all: (query, params, callback) => {
    pool.query(convertPlaceholders(query), params, (err, res) => {
      if (err) return callback(err);
      callback(null, res.rows);
    });
  },
  
  get: (query, params, callback) => {
    pool.query(convertPlaceholders(query), params, (err, res) => {
      if (err) return callback(err);
      const row = res.rows[0];
      
      // CRITICAL FIX: PostgreSQL forces unquoted aliases to lowercase (maxSequence -> maxsequence).
      // This duplicates it back to camelCase so your sequence calculation in server.js doesn't reset to 1!
      if (row && row.maxsequence !== undefined) {
        row.maxSequence = row.maxsequence;
      }
      
      callback(null, row);
    });
  },
  
  run: (query, params, callback) => {
    pool.query(convertPlaceholders(query), params, (err, res) => {
      if (err) return callback(err);
      callback(null);
    });
  }
};