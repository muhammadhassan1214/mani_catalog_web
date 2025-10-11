import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import { searchProducts } from '../lib/search'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import ProductListItem from '../components/ProductListItem'
import Pagination from '../components/Pagination'
import SortSelect from '../components/SortSelect'
import ViewToggle from '../components/ViewToggle'
import Filters from '../components/Filters'
import PerPageSelect from '../components/PerPageSelect'

function sortProducts(items: Product[], sort: string) {
  const byDate = (p: Product) => new Date(p.createdAt).getTime()
  const byName = (p: Product) => p.name.toLowerCase()
  switch (sort) {
    case 'ALPHA_DESC':
      return [...items].sort((a, b) => byName(b).localeCompare(byName(a)))
    case 'DATE_NEW':
      return [...items].sort((a, b) => byDate(b) - byDate(a))
    case 'DATE_OLD':
      return [...items].sort((a, b) => byDate(a) - byDate(b))
    case 'ALPHA_ASC':
    default:
      return [...items].sort((a, b) => byName(a).localeCompare(byName(b)))
  }
}

export default function CatalogPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const category = params.get('category')
  const sort = params.get('sort') || 'ALPHA_ASC'
  const view = (params.get('view') as 'grid' | 'list') || 'grid'
  const page = Number(params.get('page') || '1')
  const perPage = Number(params.get('perPage') || '12')

  const filtered = useMemo(() => {
    let items = PRODUCTS
    if (q) items = searchProducts(items, q)
    if (category && category !== 'ALL') items = items.filter((p) => p.category === category)
    items = sortProducts(items, sort)
    return items
  }, [q, category, sort])

  const total = filtered.length
  const start = (page - 1) * perPage
  const end = start + perPage
  const pageItems = filtered.slice(start, end)

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

      <div className="mt-3 text-sm text-gray-600">{total} result{total === 1 ? '' : 's'} found</div>

      {total === 0 ? (
        <div className="mt-6 rounded-lg border bg-white p-6 text-center text-gray-600">No products found. Try adjusting filters or search terms.</div>
      ) : view === 'grid' ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageItems.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {pageItems.map((p) => (
            <ProductListItem key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination total={total} perPage={perPage} />
    </div>
  )
}
