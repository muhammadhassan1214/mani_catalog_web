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

  const baseBtn = 'px-3 py-1.5 rounded-full text-sm transition-colors'

  return (
    <nav className="mt-8 flex items-center justify-between" aria-label="Pagination">
      <Link to={mk(Math.max(1, page - 1))} aria-disabled={page === 1} className={`${baseBtn} ${page === 1 ? 'pointer-events-none text-gray-400 bg-gray-100' : 'text-gray-700 bg-white ring-1 ring-gray-300 hover:bg-gray-50'}`}>Previous</Link>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: end - start + 1 }).map((_, i) => {
          const p = start + i
          const active = p === page
          return (
            <Link key={p} to={mk(p)} aria-current={active}
              className={`${baseBtn} ${active ? 'bg-brand-700 text-white ring-1 ring-brand-700' : 'text-gray-700 bg-white ring-1 ring-gray-300 hover:bg-gray-50'}`}>
              {p}
            </Link>
          )
        })}
      </div>
      <Link to={mk(Math.min(pages, page + 1))} aria-disabled={page === pages} className={`${baseBtn} ${page === pages ? 'pointer-events-none text-gray-400 bg-gray-100' : 'text-gray-700 bg-white ring-1 ring-gray-300 hover:bg-gray-50'}`}>Next</Link>
    </nav>
  )
}
