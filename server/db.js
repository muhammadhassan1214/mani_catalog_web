// Simple SQLite DB setup using better-sqlite3
// filepath: d:\Beauty-Catelog\catalog-frontend\server\db.js
import Database from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'

const DB_DIR = path.resolve(process.cwd(), 'server')
const DB_FILE = path.join(DB_DIR, 'data.sqlite')

// Ensure server directory exists
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })

export const db = new Database(DB_FILE)

// Pragmas for performance/consistency in a local single-user context
try {
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
} catch {}

// Create tables if not exist
export function ensureSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      name TEXT PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      price REAL,
      shortDescription TEXT,
      description TEXT,
      images TEXT,
      colors TEXT,
      packaging TEXT,
      pouches TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT,
      specs TEXT,
      FOREIGN KEY(category) REFERENCES categories(name) ON UPDATE CASCADE ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      body TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      isRead INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_createdAt ON products(createdAt);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
    CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
    CREATE INDEX IF NOT EXISTS idx_messages_createdAt ON messages(createdAt);
    CREATE INDEX IF NOT EXISTS idx_messages_isRead ON messages(isRead);
  `)
}

export function parseRow(row) {
  if (!row) return null
  return {
    ...row,
    price: row.price == null ? undefined : row.price,
    images: row.images ? JSON.parse(row.images) : [],
    colors: row.colors ? JSON.parse(row.colors) : undefined,
    packaging: row.packaging ? JSON.parse(row.packaging) : undefined,
    pouches: row.pouches ? JSON.parse(row.pouches) : undefined,
    specs: row.specs ? JSON.parse(row.specs) : undefined,
  }
}

export function serializeProduct(p) {
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    category: p.category,
    price: p.price ?? null,
    shortDescription: p.shortDescription ?? null,
    description: p.description ?? null,
    images: p.images ? JSON.stringify(p.images) : null,
    colors: p.colors ? JSON.stringify(p.colors) : null,
    packaging: p.packaging ? JSON.stringify(p.packaging) : null,
    pouches: p.pouches ? JSON.stringify(p.pouches) : null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt ?? null,
    specs: p.specs ? JSON.stringify(p.specs) : null,
  }
}
