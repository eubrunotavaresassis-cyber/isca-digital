-- SQL initialization for PLAN INVEST (optional)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  created_at TEXT
);

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
);

CREATE TABLE IF NOT EXISTS reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  token TEXT,
  expires_at TEXT
);
