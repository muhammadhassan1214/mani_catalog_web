import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Product } from '../types'
import { fetchProduct, fetchProducts } from '../lib/api'
import { useToast } from '../components/ToastProvider'
import ProductCard from '../components/ProductCard'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { notify } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [similar, setSimilar] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (!id) return
    const ac = new AbortController()
    setLoading(true)
    setError(null)
    fetchProduct(id, ac.signal)
      .then((p) => setProduct(p))
      .catch((e) => {
        if (e.name !== 'AbortError') {
          const msg = e.message || 'Failed to load product'
          setError(msg)
          notify(msg, 'error')
        }
      })
      .finally(() => setLoading(false))
    return () => ac.abort()
  }, [id, refresh, notify])

  useEffect(() => {
    if (!product) return
    const ac = new AbortController()
    // Fetch a pool of same-category products and sample up to 4 excluding current
    fetchProducts({ category: product.baseCategory, sort: 'DATE_NEW', page: 1, perPage: 24 }, ac.signal)
      .then(res => {
        const pool = res.items.filter(p => p.id !== product.id)
        function sample<T>(arr: T[], n: number): T[] {
          if (arr.length <= n) return arr.slice(0, n)
          const out: T[] = []
            , used = new Set<number>()
          while (out.length < n) {
            const i = Math.floor(Math.random() * arr.length)
            if (used.has(i)) continue
            used.add(i)
            out.push(arr[i])
          }
          return out
        }
        setSimilar(sample(pool, 8))
      })
      .catch(() => {/* silent */})
    return () => ac.abort()
  }, [product])

  if (loading) {
    return <div className="text-sm text-gray-600">Loading…</div>
  }

  if (error === 'Not found' || !product) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-gray-600">The product you are looking for does not exist.</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Link to="/catalog" className="inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white">Back to catalog</Link>
          {error && error !== 'Not found' && (
            <button onClick={() => setRefresh((x) => x + 1)} className="inline-block rounded-md border px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50">Retry</button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link to="/" className="hover:text-gray-900">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link to={`/catalog?category=${encodeURIComponent(product.baseCategory)}`} className="hover:text-gray-900">{product.baseCategory}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="text-gray-900 font-medium truncate max-w-[40ch]">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
            ) : (
              <div className="h-full w-full grid place-items-center text-gray-400">No image</div>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{product.name}</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">SKU: {product.sku}</p>

          {product.description && (
            <section className="mt-6">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>
              <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {product.description.size && (
                  <div>
                    <dt className="text-gray-500">Size</dt>
                    <dd className="text-gray-800">{product.description.size}</dd>
                  </div>
                )}
                {product.description.category && (
                  <div>
                    <dt className="text-gray-500">Category</dt>
                    <dd className="text-gray-800">{product.description.category}, {product.name}</dd>
                  </div>
                )}
                {product.description.finish && (
                  <div>
                    <dt className="text-gray-500">Finish</dt>
                    <dd className="text-gray-800">{product.description.finish}</dd>
                  </div>
                )}
                {product.description.details && (
                  <div className="sm:col-span-2">
                    <dt className="text-gray-500">Details</dt>
                    <dd className="text-gray-800 whitespace-pre-wrap">{product.description.details}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">Similar Products</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map(s => <ProductCard key={s.id} product={s} />)}
          </div>
        </section>
      )}
    </div>
  )
}
