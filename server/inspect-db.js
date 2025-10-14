// Quick DB inspector to print products table columns and sample
// filepath: d:\Beauty-Catelog\catalog-frontend\server\inspect-db.js
import { db, ensureSchema, parseRow } from './db.js'

ensureSchema()
const cols = db.prepare('PRAGMA table_info(products)').all()
console.log('products columns:', cols.map(c => c.name))
const count = db.prepare('SELECT COUNT(*) as n FROM products').get().n
console.log('products count:', count)
const rows = db.prepare('SELECT * FROM products ORDER BY datetime(createdAt) DESC LIMIT 3').all()
console.log('sample:', rows.map(parseRow))
