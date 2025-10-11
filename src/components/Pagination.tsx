import { Link, useSearchParams } from 'react-router-dom'

export default function Pagination({ total, perPage }: { total: number; perPage: number }) {
  const [params] = useSearchParams()
  const page = Number(params.get('page') || '1')
  const pages = Math.max(1, Math.ceil(total / perPage))
  if (pages <= 1) return null

  const mk = (p: number) => {
    const sp = new URLSearchParams(params)
    sp.set('page', String(p))
    return `?${sp.toString()}`
  }

  const windowSize = 5
  const start = Math.max(1, page - Math.floor(windowSize / 2))
  const end = Math.min(pages, start + windowSize - 1)

  return (
    <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
      <Link to={mk(Math.max(1, page - 1))} aria-disabled={page === 1} className={`px-3 py-2 rounded border text-sm ${page === 1 ? 'pointer-events-none text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Previous</Link>
      <div className="flex items-center gap-1">
        {Array.from({ length: end - start + 1 }).map((_, i) => {
          const p = start + i
          return (
            <Link key={p} to={mk(p)} aria-current={p === page}
              className={`px-3 py-2 rounded border text-sm ${p === page ? 'bg-brand-700 text-white border-brand-700' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
              {p}
            </Link>
          )
        })}
      </div>
      <Link to={mk(Math.min(pages, page + 1))} aria-disabled={page === pages} className={`px-3 py-2 rounded border text-sm ${page === pages ? 'pointer-events-none text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Next</Link>
    </nav>
  )
}

