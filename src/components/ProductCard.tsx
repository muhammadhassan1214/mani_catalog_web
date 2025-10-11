import { Link } from 'react-router-dom'
import type { Product } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0]
  return (
    <article className="group rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-brand-500">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-gray-100">
          {img ? (
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
          ) : (
            <div className="h-full w-full grid place-items-center text-gray-400">No image</div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          </div>
          <p className="mt-1 text-xs text-gray-500">SKU: {product.sku}</p>
          <p className="mt-1 text-xs text-gray-500">{product.category}</p>
          {product.shortDescription && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.shortDescription}</p>
          )}
          <div className="mt-3 text-brand-700 text-sm font-medium">View details →</div>
        </div>
      </Link>
    </article>
  )
}
