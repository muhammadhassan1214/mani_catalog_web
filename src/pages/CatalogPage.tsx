import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, type ProductsQuery } from '../lib/api'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import ProductListItem from '../components/ProductListItem'
import Pagination from '../components/Pagination'
import SortSelect from '../components/SortSelect'
import ViewToggle from '../components/ViewToggle'
import Filters from '../components/Filters'
import PerPageSelect from '../components/PerPageSelect'
import { useToast } from '../components/ToastProvider'

function normalizeView(v: string | null): 'grid' | 'list' {
  return v === 'list' ? 'list' : 'grid'
}

function normalizeSort(v: string | null): ProductsQuery['sort'] {
  switch (v) {
    case 'ALPHA_ASC':
    case 'ALPHA_DESC':
    case 'DATE_NEW':
    case 'DATE_OLD':
      return v
    default:
      return 'ALPHA_ASC'
  }
}

export default function CatalogPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const category = params.get('category') || 'ALL'
  const sort = normalizeSort(params.get('sort'))
  const view = normalizeView(params.get('view'))
  const page = Number(params.get('page') || '1')
  const perPage = Number(params.get('perPage') || '12')

  const [items, setItems] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)
  const { notify } = useToast()

  // Memoize the query object to avoid unnecessary effects
  const query = useMemo(() => ({ q, category, sort, page, perPage }), [q, category, sort, page, perPage])

  useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    setError(null)
    fetchProducts({
      q: query.q,
      category: query.category,
      sort: query.sort,
      page: query.page,
      perPage: query.perPage,
    }, ac.signal)
      .then((res) => {
        setItems(res.items)
        setTotal(res.total)
      })
      .catch((e) => {
        if (e.name !== 'AbortError') {
          const msg = 'Failed to load products'
          setError(msg)
          notify(msg, 'error')
        }
      })
      .finally(() => setLoading(false))
    return () => ac.abort()
  }, [query.q, query.category, query.sort, query.page, query.perPage, refresh, notify])

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Catalog</h1>
      <p className="mt-1 text-sm text-gray-600">Browse and search across our product catalog.</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Filters />
        <div className="flex items-center gap-3">
          <PerPageSelect />
          <SortSelect />
          <ViewToggle />
        </div>
      </div>

      {loading && (
        <div className="mt-3 text-sm text-gray-600">Loading…</div>
      )}
      {error && (
        <div className="mt-3 flex items-center gap-3">
          <div className="text-sm text-red-600">{error}</div>
          <button onClick={() => setRefresh((x) => x + 1)} className="text-sm rounded-md border px-2 py-1 border-gray-300 text-gray-700 hover:bg-gray-50">Retry</button>
        </div>
      )}

      <div className="mt-3 text-sm text-gray-600">{total} result{total === 1 ? '' : 's'} found</div>

      {total === 0 ? (
        <div className="mt-6 rounded-lg border bg-white p-6 text-center text-gray-600">No products found. Try adjusting filters or search terms.</div>
      ) : view === 'grid' ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((p) => (
            <ProductListItem key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination total={total} perPage={perPage} />
    </div>
  )
}
