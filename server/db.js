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
      baseCategory TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT
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
  `)

  // Migration: if products table has legacy columns (e.g., sku, category, price, images, colors, etc.),
  // recreate it with the new minimal schema and DROP all old product data as requested.
  try {
    const cols = db.prepare('PRAGMA table_info(products)')?.all?.() || []
    const colNames = new Set(cols.map((c) => c.name))
    const isNewSchema = colNames.has('id') && colNames.has('name') && colNames.has('baseCategory') && colNames.has('description') && colNames.has('image') && colNames.size === 7
    if (!isNewSchema) {
      const migrate = db.transaction(() => {
        db.exec(`
          DROP TABLE IF EXISTS products;
          CREATE TABLE products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            baseCategory TEXT NOT NULL,
            description TEXT NOT NULL,
            image TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT
          );
        `)
      })
      migrate()
    } else {
      // Ensure minimal indexes
      try { db.exec(`CREATE INDEX idx_products_baseCategory ON products(baseCategory);`) } catch {}
      try { db.exec(`CREATE INDEX idx_products_createdAt ON products(createdAt);`) } catch {}
      try { db.exec(`CREATE INDEX idx_products_name ON products(name);`) } catch {}
    }
  } catch {}

  // Indexes for messages
  try { db.exec(`CREATE INDEX idx_messages_createdAt ON messages(createdAt);`) } catch {}
  try { db.exec(`CREATE INDEX idx_messages_isRead ON messages(isRead);`) } catch {}
}

export function parseRow(row) {
  if (!row) return null
  let desc
  try { desc = row.description ? JSON.parse(row.description) : null } catch { desc = null }
  // Validate description keys to avoid empty values on frontend
  const description = desc && typeof desc === 'object' ? {
    size: desc.size || undefined,
    category: desc.category || undefined,
    finish: desc.finish || undefined,
    details: desc.details || undefined,
  } : undefined
  return {
    id: row.id,
    sku: row.id,
    name: row.name,
    baseCategory: row.baseCategory,
    description,
    image: row.image || undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt || undefined,
  }
}

export function serializeProduct(p) {
  // p: { id, name, baseCategory, description: {size, category, finish, details}, image, createdAt, updatedAt }
  return {
    id: p.id,
    name: p.name,
    baseCategory: p.baseCategory,
    description: JSON.stringify({
      ...(p.description?.size ? { size: p.description.size } : {}),
      ...(p.description?.category ? { category: p.description.category } : {}),
      ...(p.description?.finish ? { finish: p.description.finish } : {}),
      ...(p.description?.details ? { details: p.description.details } : {}),
    }),
    image: p.image ?? null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt ?? null,
  }
}
