import { Link } from 'react-router-dom'
import type { Product } from '../types'

export default function ProductListItem({ product }: { product: Product }) {
  const img = product.image
  return (
    <article className="flex gap-4 rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`} className="flex-shrink-0 w-40 h-28 overflow-hidden rounded-md bg-gray-100">
        {img ? (
          <img src={img} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center text-gray-400">No image</div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            <Link to={`/product/${product.id}`} className="hover:underline">{product.name}</Link>
          </h3>
        </div>
        <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-3">
          <span>SKU: {product.sku}</span>
          <span>Category: {product.baseCategory}</span>
        </div>
        <div className="mt-2">
          <Link to={`/product/${product.id}`} className="text-sm font-medium text-brand-700 hover:text-brand-800">View details →</Link>
        </div>
      </div>
    </article>
  )
}
