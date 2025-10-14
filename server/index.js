// Minimal Express API server for catalog
// filepath: d:\Beauty-Catelog\catalog-frontend\server\index.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { db, ensureSchema, parseRow, serializeProduct } from './db.js'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const app = express()
const PORT = Number(process.env.PORT || 3000)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json({ limit: '1mb' }))

ensureSchema()

app.get('/api/health', (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() })
})

// Categories: fixed base categories only
app.get('/api/categories', (req, res) => {
  res.json(['BEAUTY CARE INSTRUMENTS', 'EYELASH PRODUCTS'])
})

// Products list with search/filter/sort/pagination (new schema)
app.get('/api/products', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const category = typeof req.query.category === 'string' ? req.query.category : ''
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'ALPHA_ASC'
  const page = Math.max(1, Number(req.query.page || 1) || 1)
  const perPage = Math.min(100, Math.max(1, Number(req.query.perPage || 12) || 12))

  const where = []
  const params = {}
  if (category && category !== 'ALL') {
    where.push('baseCategory = @category')
    params.category = category
  }
  if (q) {
    where.push('(name LIKE @q OR id LIKE @q OR baseCategory LIKE @q)')
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
    default:
      orderBy = 'ORDER BY name COLLATE NOCASE ASC'; break
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

// Admin: create product (id=sku, baseCategory auto-derived from name)
app.post('/api/admin/products', requireAdmin, (req, res) => {
  const p = req.body || {}
  // basic validation
  const required = ['id', 'name']
  for (const k of required) {
    if (!(k in p) || !p[k]) return res.status(400).json({ error: `Missing field: ${k}` })
  }
  // Prepare record
  const now = new Date().toISOString()
  const nameLc = String(p.name).toLowerCase()
  const baseCategory = nameLc.includes('eye') ? 'EYELASH PRODUCTS' : 'BEAUTY CARE INSTRUMENTS'
  const description = p.description && typeof p.description === 'object' ? {
    ...(p.description.size ? { size: p.description.size } : {}),
    ...(p.description.category ? { category: p.description.category } : {}),
    ...(p.description.finish ? { finish: p.description.finish } : {}),
    ...(p.description.details ? { details: p.description.details } : {}),
  } : {}

  const data = serializeProduct({
    id: p.id,
    name: p.name,
    baseCategory,
    description,
    image: p.image || null,
    createdAt: now,
    updatedAt: null,
  })
  try {
    db.prepare(`
      INSERT INTO products (id, name, baseCategory, description, image, createdAt, updatedAt)
      VALUES (@id, @name, @baseCategory, @description, @image, @createdAt, @updatedAt)
    `).run(data)
  } catch (e) {
    return res.status(400).json({ error: 'Insert failed', detail: String(e) })
  }
  res.status(201).json({ id: p.id })
})

// Static frontend (production): serve dist if present
const distDir = path.resolve(process.cwd(), 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`)
})
