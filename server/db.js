const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let dbPath = process.env.TEST_DB;
if (!dbPath) {
  dbPath = path.join(__dirname, 'data.db');
}

// If NODE_ENV=test and no TEST_DB provided, use in-memory DB
if (process.env.NODE_ENV === 'test' && !process.env.TEST_DB) {
  dbPath = ':memory:';
}

const db = new sqlite3.Database(dbPath);

function init() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        created_at TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS entries (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        date TEXT,
        category TEXT,
        description TEXT,
        type TEXT,
        value REAL,
        payment_method TEXT,
        necessary INTEGER,
        notes TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS reset_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        token TEXT,
        expires_at TEXT
      )
    `);
  });
}

module.exports = { db, init };
