import { Link } from 'react-router-dom'
import type { Product } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  const img = product.image
  return (
    <article className="group rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-brand-500">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image container: switched bg-gray-100 to bg-white for seamless background */}
        <div className="aspect-[4/3] w-full rounded-t-lg bg-white flex items-center justify-center p-2">
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
        <div className="p-4 bg-gray-50">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          </div>
          <p className="mt-1 text-xs text-gray-600">SKU: {product.sku}</p>
          <p className="mt-1 text-xs text-gray-600">{product.baseCategory}</p>
          <div className="mt-3 text-brand-700 text-sm font-medium">View details →</div>
        </div>
      </Link>
    </article>
  )
}
