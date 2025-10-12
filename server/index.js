// Minimal Express API server for catalog
// filepath: d:\Beauty-Catelog\catalog-frontend\server\index.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { db, ensureSchema, parseRow, serializeProduct } from './db.js'
import { randomUUID } from 'node:crypto'

const app = express()
const PORT = Number(process.env.PORT || 3000)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

app.use(cors())
app.use(express.json({ limit: '1mb' }))

ensureSchema()

app.get('/api/health', (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() })
})

// Categories
app.get('/api/categories', (req, res) => {
  const rows = db.prepare('SELECT name FROM categories ORDER BY name').all()
  res.json(rows.map(r => r.name))
})

// Products list with search/filter/sort/pagination
app.get('/api/products', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const category = typeof req.query.category === 'string' ? req.query.category : ''
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'ALPHA_ASC'
  const page = Math.max(1, Number(req.query.page || 1) || 1)
  const perPage = Math.min(100, Math.max(1, Number(req.query.perPage || 12) || 12))

  const where = []
  const params = {}
  if (category && category !== 'ALL') {
    where.push('category = @category')
    params.category = category
  }
  if (q) {
    where.push('(name LIKE @q OR sku LIKE @q OR category LIKE @q OR description LIKE @q OR shortDescription LIKE @q)')
    params.q = `%${q.replace(/[%_]/g, s => '\\' + s)}%`
  }
  const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : ''

  let orderBy = 'ORDER BY name COLLATE NOCASE ASC'
  switch (sort) {
    case 'ALPHA_DESC':
      orderBy = 'ORDER BY name COLLATE NOCASE DESC'; break
    case 'DATE_NEW':
      orderBy = 'ORDER BY datetime(createdAt) DESC'; break
    case 'DATE_OLD':
      orderBy = 'ORDER BY datetime(createdAt) ASC'; break
    case 'PRICE_ASC':
      orderBy = 'ORDER BY (price IS NULL), price ASC'; break
    case 'PRICE_DESC':
      orderBy = 'ORDER BY (price IS NULL), price DESC'; break
  }

  const offset = (page - 1) * perPage
  const countSql = `SELECT COUNT(*) as n FROM products ${whereSql}`
  const total = db.prepare(countSql).get(params).n

  const itemsSql = `
    SELECT * FROM products
    ${whereSql}
    ${orderBy}
    LIMIT @perPage OFFSET @offset
  `
  const items = db.prepare(itemsSql).all({ ...params, perPage, offset }).map(parseRow)

  res.json({ total, page, perPage, items })
})

// Product detail
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(parseRow(row))
})

// Contact form: create message
app.post('/api/contact/messages', (req, res) => {
  const { name, email, company, message } = req.body || {}
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' })
  const id = randomUUID()
  const createdAt = new Date().toISOString()
  db.prepare(`
    INSERT INTO messages (id, name, email, company, body, createdAt, isRead)
    VALUES (@id, @name, @email, @company, @body, @createdAt, 0)
  `).run({ id, name, email, company: company || null, body: message, createdAt })
  res.status(201).json({ id, createdAt })
})

// Admin auth middleware
function requireAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) return res.status(503).json({ error: 'Server not configured' })
  const header = req.headers['x-admin-password']
  if (typeof header !== 'string' || header !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  return next()
}

// Admin: list messages
app.get('/api/admin/messages', requireAdmin, (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : 'all'
  const where = status === 'unread' ? 'WHERE isRead = 0' : status === 'read' ? 'WHERE isRead = 1' : ''
  const rows = db.prepare(`SELECT * FROM messages ${where} ORDER BY datetime(createdAt) DESC`).all()
  res.json(rows.map(r => ({
    id: r.id,
    name: r.name,
    email: r.email,
    company: r.company ?? undefined,
    message: r.body,
    createdAt: r.createdAt,
    isRead: !!r.isRead,
  })))
})

// Admin: mark read/unread
app.patch('/api/admin/messages/:id/read', requireAdmin, (req, res) => {
  const id = req.params.id
  const { isRead } = req.body || {}
  if (typeof isRead !== 'boolean') return res.status(400).json({ error: 'isRead boolean required' })
  const info = db.prepare('UPDATE messages SET isRead = ? WHERE id = ?').run(isRead ? 1 : 0, id)
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

// Admin: delete message
app.delete('/api/admin/messages/:id', requireAdmin, (req, res) => {
  const id = req.params.id
  const info = db.prepare('DELETE FROM messages WHERE id = ?').run(id)
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

// Admin: create product
app.post('/api/admin/products', requireAdmin, (req, res) => {
  const p = req.body || {}
  // basic validation
  const required = ['id', 'name', 'sku', 'category', 'images']
  for (const k of required) {
    if (!(k in p)) return res.status(400).json({ error: `Missing field: ${k}` })
  }
  // ensure category exists (create if missing)
  db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)').run(p.category)
  // timestamps
  const now = new Date().toISOString()
  p.createdAt = p.createdAt || now
  const data = serializeProduct(p)
  try {
    db.prepare(`
      INSERT INTO products (
        id, name, sku, category, price, shortDescription, description,
        images, colors, packaging, pouches, createdAt, updatedAt, specs
      ) VALUES (
        @id, @name, @sku, @category, @price, @shortDescription, @description,
        @images, @colors, @packaging, @pouches, @createdAt, @updatedAt, @specs
      )
    `).run(data)
  } catch (e) {
    return res.status(400).json({ error: 'Insert failed', detail: String(e) })
  }
  res.status(201).json({ id: p.id })
})

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`)
})
