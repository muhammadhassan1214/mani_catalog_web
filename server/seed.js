// Seed the SQLite database with initial categories and products
// filepath: d:\Beauty-Catelog\catalog-frontend\server\seed.js
import fs from 'node:fs'
import path from 'node:path'
import { db, ensureSchema, serializeProduct } from './db.js'

const seedPath = path.resolve(process.cwd(), 'server', 'seed-data.json')

function run() {
  ensureSchema()
  const raw = fs.readFileSync(seedPath, 'utf-8')
  const seed = JSON.parse(raw)

  const tx = db.transaction(() => {
    // Clear existing data
    db.prepare('DELETE FROM products').run()
    db.prepare('DELETE FROM categories').run()

    // Insert categories
    const insertCat = db.prepare('INSERT INTO categories (name) VALUES (?)')
    for (const name of seed.categories) insertCat.run(name)

    // Insert products
    const insertProd = db.prepare(`
      INSERT INTO products (
        id, name, sku, category, price, shortDescription, description,
        images, packaging, pouches, createdAt, updatedAt, specs
      ) VALUES (
        @id, @name, @sku, @category, @price, @shortDescription, @description,
        @images, @packaging, @pouches, @createdAt, @updatedAt, @specs
      )
    `)

    for (const p of seed.products) {
      insertProd.run(serializeProduct(p))
    }
  })

  tx()
  console.log('Seed complete: inserted', db.prepare('SELECT COUNT(*) as n FROM products').get().n, 'products')
}

run()
