// filepath: d:\Beauty-Catelog\catalog-frontend\src\lib\api.ts
import type { Product } from '../types'

const BASE = '' // use Vite dev proxy for /api in dev; empty base works in production if served together

export interface ProductsResponse {
  total: number
  page: number
  perPage: number
  items: Product[]
}

let categoriesCache: string[] | null = null

export async function fetchCategories(signal?: AbortSignal): Promise<string[]> {
  if (categoriesCache) return categoriesCache
  const res = await fetch(`${BASE}/api/categories`, { signal })
  if (!res.ok) throw new Error(`Failed to load categories: ${res.status}`)
  const data: string[] = await res.json()
  categoriesCache = data
  return data
}

export interface ProductsQuery {
  q?: string
  category?: string
  sort?: 'ALPHA_ASC' | 'ALPHA_DESC' | 'DATE_NEW' | 'DATE_OLD'
  page?: number
  perPage?: number
}

export async function fetchProducts(query: ProductsQuery, signal?: AbortSignal): Promise<ProductsResponse> {
  const sp = new URLSearchParams()
  if (query.q) sp.set('q', query.q)
  if (query.category) sp.set('category', query.category)
  if (query.sort) sp.set('sort', query.sort)
  if (query.page != null) sp.set('page', String(query.page))
  if (query.perPage != null) sp.set('perPage', String(query.perPage))
  const url = `${BASE}/api/products${sp.size ? `?${sp.toString()}` : ''}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Failed to load products: ${res.status}`)
  return res.json()
}

export async function fetchProduct(id: string, signal?: AbortSignal): Promise<Product> {
  const res = await fetch(`${BASE}/api/products/${encodeURIComponent(id)}`, { signal })
  if (res.status === 404) throw new Error('Not found')
  if (!res.ok) throw new Error(`Failed to load product: ${res.status}`)
  return res.json()
}

export function clearCategoriesCache() {
  categoriesCache = null
}

export interface ContactMessageInput {
  name: string
  email: string
  company?: string
  message: string
}

export async function submitContactMessage(input: ContactMessageInput, signal?: AbortSignal) {
  const res = await fetch(`${BASE}/api/contact/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal,
  })
  if (!res.ok) throw new Error(`Failed to submit message: ${res.status}`)
  return res.json() as Promise<{ id: string; createdAt: string }>
}

export interface AdminMessage {
  id: string
  name: string
  email: string
  company?: string
  message: string
  createdAt: string
  isRead: boolean
}

function adminHeaders(password: string) {
  return { 'Content-Type': 'application/json', 'x-admin-password': password }
}

export async function adminListMessages(password: string, status: 'all' | 'read' | 'unread' = 'all', signal?: AbortSignal): Promise<AdminMessage[]> {
  const sp = new URLSearchParams()
  if (status) sp.set('status', status)
  const res = await fetch(`${BASE}/api/admin/messages?${sp.toString()}`, { headers: adminHeaders(password), signal })
  if (res.status === 401) throw new Error('Unauthorized')
  if (!res.ok) throw new Error(`Failed to load messages: ${res.status}`)
  return res.json()
}

export async function adminSetMessageRead(password: string, id: string, isRead: boolean) {
  const res = await fetch(`${BASE}/api/admin/messages/${encodeURIComponent(id)}/read`, {
    method: 'PATCH',
    headers: adminHeaders(password),
    body: JSON.stringify({ isRead }),
  })
  if (res.status === 401) throw new Error('Unauthorized')
  if (!res.ok) throw new Error(`Failed to update message: ${res.status}`)
  return res.json()
}

export async function adminDeleteMessage(password: string, id: string) {
  const res = await fetch(`${BASE}/api/admin/messages/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(password),
  })
  if (res.status === 401) throw new Error('Unauthorized')
  if (!res.ok) throw new Error(`Failed to delete message: ${res.status}`)
  return res.json()
}

export interface AdminCreateProductInput {
  id: string // SKU and ID
  name: string
  image?: string
  description?: { size?: string; category?: string; finish?: string; details?: string }
}

export async function adminCreateProduct(password: string, input: AdminCreateProductInput) {
  const res = await fetch(`${BASE}/api/admin/products`, {
    method: 'POST',
    headers: adminHeaders(password),
    body: JSON.stringify(input),
  })
  if (res.status === 401) throw new Error('Unauthorized')
  if (!res.ok) throw new Error(`Failed to create product: ${res.status}`)
  return res.json() as Promise<{ id: string }>
}
