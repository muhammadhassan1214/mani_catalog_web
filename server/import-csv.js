// filepath: d:\Beauty-Catelog\catalog-frontend\server\import-csv.js
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'
import { db, ensureSchema, serializeProduct } from './db.js'

function deriveBaseCategory(name) {
  const lc = String(name || '').toLowerCase()
  return lc.includes('eye') ? 'EYELASH PRODUCTS' : 'BEAUTY CARE INSTRUMENTS'
}

function sanitizeDescription(obj) {
  if (!obj || typeof obj !== 'object') return {}
  const out = {}
  if (obj.size) out.size = String(obj.size)
  if (obj.category) out.category = String(obj.category)
  if (obj.finish) out.finish = String(obj.finish)
  if (obj.details) out.details = String(obj.details)
  return out
}

function hasHeader(firstRow) {
  if (!Array.isArray(firstRow)) return false
  const joined = firstRow.join(',').toLowerCase()
  return joined.includes('name') && joined.includes('sku')
}

function main() {
  ensureSchema()
  const args = process.argv.slice(2)
  const reset = args.includes('--reset')
  const argPath = args.find((a) => !a.startsWith('--'))
  let csvPath = argPath || process.env.CSV_PATH || 'D:/Beauty-Catelog/scraper/products_updated.csv'

  console.log(`[import-csv] csvPath arg: ${csvPath}`)
  if (!fs.existsSync(csvPath)) {
    console.error(`[import-csv] File not found: ${csvPath}`)
    process.exit(1)
  }
  const stat = fs.statSync(csvPath)
  if (stat.isDirectory()) {
    const candidate = path.join(csvPath, 'products_updated.csv')
    console.warn(`[import-csv] Provided path is a directory. Trying: ${candidate}`)
    if (!fs.existsSync(candidate)) {
      console.error(`[import-csv] CSV file not found inside directory: ${candidate}`)
      process.exit(1)
    }
    csvPath = candidate
  }

  const content = fs.readFileSync(csvPath, 'utf8')
  const rows = parse(content, { skip_empty_lines: true })
  if (!rows || rows.length === 0) {
    console.warn('[import-csv] Parsed zero rows from CSV')
  }
  const header = rows[0]
  const headerPresent = hasHeader(header)
  const startIndex = headerPresent ? 1 : 0
  console.log(`[import-csv] Rows: ${rows.length} (header: ${headerPresent ? 'yes' : 'no'})`)

  let inserted = 0
  let updated = 0
  const tx = db.transaction((items) => {
    if (reset) {
      db.prepare('DELETE FROM products').run()
    }
    const stmt = db.prepare(`
      INSERT INTO products (id, name, baseCategory, description, image, createdAt, updatedAt)
      VALUES (@id, @name, @baseCategory, @description, @image, @createdAt, @updatedAt)
    `)
    for (let i = startIndex; i < items.length; i++) {
      const row = items[i]
      if (!Array.isArray(row)) continue
      // Expected columns: 0 Name, 1 SKU, 2 Image URL, 4 Description JSON
      const name = row[0]
      const sku = row[1]
      const image = row[2] || null
      const descStr = row[4] || ''
      if (!name || !sku) continue
      let desc
      try { desc = JSON.parse(descStr) } catch { desc = {} }
      const description = sanitizeDescription(desc)
      const baseCategory = deriveBaseCategory(name)
      const now = new Date().toISOString()
      const data = serializeProduct({
        id: String(sku),
        name: String(name),
        baseCategory,
        description,
        image: image ? String(image) : null,
        createdAt: now,
        updatedAt: null,
      })
      try {
        stmt.run(data)
        inserted++
      } catch (e) {
        db.prepare(`
          UPDATE products SET name=@name, baseCategory=@baseCategory, description=@description, image=@image, updatedAt=@now
          WHERE id=@id
        `).run({ ...data, now })
        updated++
      }
    }
  })

  tx(rows)
  console.log(`[import-csv] Imported ${inserted} inserted, ${updated} updated from ${csvPath}${reset ? ' (after reset)' : ''}`)
}

// Execute import
main()
