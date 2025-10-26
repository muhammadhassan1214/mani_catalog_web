import { Link } from 'react-router-dom'
import type { Product } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  const img = product.image
  return (
    <article className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-brand-500">
      <Link to={`/product/${product.id}`} className="block rounded-xl overflow-hidden">
        {/* Image container on clean white to blend with cutouts */}
        <div className="aspect-[4/3] w-full bg-white flex items-center justify-center p-3 ring-1 ring-gray-100">
          {img ? (
            <img
              src={img}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-gray-400">No image</div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-800 transition-colors">{product.name}</h3>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
            <span className="px-2 py-0.5 rounded-full bg-gray-50 ring-1 ring-gray-200 text-gray-700">{product.baseCategory}</span>
            <span className="text-gray-500">SKU: {product.sku}</span>
          </div>
          <div className="mt-3 text-brand-700 text-sm font-medium">View details →</div>
        </div>
      </Link>
    </article>
  )
}
