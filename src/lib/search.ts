import Fuse from 'fuse.js'
import type { Product } from '../types'

let fuse: Fuse<Product> | null = null

export function getFuse(products: Product[]) {
  if (fuse) return fuse
  fuse = new Fuse(products, {
    includeScore: true,
    threshold: 0.35,
    keys: [
      'name',
      'sku',
      'category',
      'description',
      'shortDescription',
      { name: 'specs', getFn: (p) => Object.values(p.specs || {}).join(' ') },
    ],
  })
  return fuse
}

export function searchProducts(products: Product[], query: string) {
  if (!query.trim()) return products
  const f = getFuse(products)
  return f.search(query).map(r => r.item)
}

