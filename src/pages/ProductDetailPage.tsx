import { Link, useParams } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import ProductGallery from '../components/ProductGallery'
import SpecsTable from '../components/SpecsTable'

export default function ProductDetailPage() {
  const { id } = useParams()
  const product = PRODUCTS.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-gray-600">The product you are looking for does not exist.</p>
        <Link to="/catalog" className="mt-4 inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white">Back to catalog</Link>
      </div>
    )
  }

  return (
    <div>
      <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link to="/" className="hover:text-gray-900">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link to={`/catalog?category=${encodeURIComponent(product.category)}`} className="hover:text-gray-900">{product.category}</Link></li>
          <li aria-hidden>›</li>
          <li aria-current="page" className="text-gray-900 font-medium truncate max-w-[40ch]">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductGallery images={product.images} />
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{product.name}</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">SKU: {product.sku}</p>
          {product.shortDescription && <p className="mt-3 text-gray-700">{product.shortDescription}</p>}

          {/* Variants */}
          {product.colors && product.colors.length > 0 && (
            <section className="mt-6">
              <h2 className="text-sm font-medium text-gray-900">Available Colors</h2>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.colors.map((v) => (
                  <div key={v.sku} className="rounded border bg-white p-2">
                    {v.image ? (
                      <img src={v.image.url} alt={v.image.alt} className="h-24 w-full object-cover rounded" />
                    ) : (
                      <div className="h-24 w-full grid place-items-center text-gray-400 bg-gray-100 rounded">No image</div>
                    )}
                    <div className="mt-1 text-xs text-gray-700 font-medium">{v.label}</div>
                    <div className="text-[11px] text-gray-500">SKU: {v.sku}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {product.packaging && product.packaging.length > 0 && (
            <section className="mt-6">
              <h2 className="text-sm font-medium text-gray-900">Packaging</h2>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.packaging.map((v) => (
                  <div key={v.sku} className="rounded border bg-white p-2">
                    {v.image ? (
                      <img src={v.image.url} alt={v.image.alt} className="h-24 w-full object-cover rounded" />
                    ) : (
                      <div className="h-24 w-full grid place-items-center text-gray-400 bg-gray-100 rounded">No image</div>
                    )}
                    <div className="mt-1 text-xs text-gray-700 font-medium">{v.label}</div>
                    <div className="text-[11px] text-gray-500">SKU: {v.sku}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {product.pouches && product.pouches.length > 0 && (
            <section className="mt-6">
              <h2 className="text-sm font-medium text-gray-900">Empty Pouches</h2>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.pouches.map((v) => (
                  <div key={v.sku} className="rounded border bg-white p-2">
                    {v.image ? (
                      <img src={v.image.url} alt={v.image.alt} className="h-24 w-full object-cover rounded" />
                    ) : (
                      <div className="h-24 w-full grid place-items-center text-gray-400 bg-gray-100 rounded">No image</div>
                    )}
                    <div className="mt-1 text-xs text-gray-700 font-medium">{v.label}</div>
                    <div className="text-[11px] text-gray-500">SKU: {v.sku}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {product.specs && (
            <section className="mt-6">
              <h2 className="text-sm font-medium text-gray-900">Specifications</h2>
              <div className="mt-2">
                <SpecsTable specs={product.specs} />
              </div>
            </section>
          )}

          {product.description && (
            <section className="mt-6">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>
              <p className="mt-2 text-sm text-gray-700">{product.description}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
