import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCategories, fetchProducts } from '../lib/api'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import { useToast } from '../components/ToastProvider'

export default function HomePage() {
  const { notify } = useToast()
  const [categories, setCategories] = useState<string[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ac = new AbortController()
    function sample<T>(arr: T[], n: number): T[] {
      if (arr.length <= n) return arr.slice()
      const picked: T[] = []
      const used = new Set<number>()
      while (picked.length < n) {
        const idx = Math.floor(Math.random() * arr.length)
        if (used.has(idx)) continue
        used.add(idx)
        picked.push(arr[idx])
      }
      return picked
    }
    Promise.all([
      fetchCategories(ac.signal).catch(() => []),
      // Fetch a larger pool to randomize from
      fetchProducts({ sort: 'DATE_NEW', page: 1, perPage: 40 }, ac.signal).catch(() => ({ total: 0, page: 1, perPage: 40, items: [] })),
    ])
      .then(([cats, prods]) => {
        setCategories(cats || [])
        const pool = (prods.items) || []
        setFeatured(sample(pool, 8))
      })
      .catch(() => notify('Failed to load homepage data', 'error'))
      .finally(() => setLoading(false))
    return () => ac.abort()
  }, [notify])

  return (
    <div>
      <section className="rounded-xl bg-gradient-to-br from-brand-50 to-white border p-6 sm:p-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Professional Product Catalog</h1>
          <p className="mt-3 text-lg text-gray-600">Explore our manufacturing catalog across Beauty Care and Eyelash categories.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to="/catalog" className="inline-flex items-center rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Browse Catalog</Link>
            <a href="#categories" className="text-sm font-medium text-brand-700 hover:text-brand-800">Browse by Category →</a>
          </div>
        </div>
      </section>

      <section id="categories" className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
        {loading ? (
          <div className="mt-3 text-sm text-gray-600">Loading…</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <Link key={c} to={`/catalog?category=${encodeURIComponent(c)}`} className="rounded-lg border bg-white p-4 shadow-sm hover:shadow">
                <div className="text-sm font-medium text-gray-900">{c}</div>
                <div className="mt-1 text-xs text-gray-500">Explore products →</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Featured Products</h2>
          <Link to="/catalog" className="text-sm font-medium text-brand-700 hover:text-brand-800">View all →</Link>
        </div>
        {loading ? (
          <div className="mt-3 text-sm text-gray-600">Loading…</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
