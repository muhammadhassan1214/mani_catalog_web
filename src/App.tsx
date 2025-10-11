import { Link, NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Boxes, PackageSearch } from 'lucide-react'
import './index.css'

function Header() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const query = (form.get('q') as string)?.trim() ?? ''
    const search = new URLSearchParams({ q: query })
    navigate(`/catalog?${search.toString()}`)
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="container-safe flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 group" aria-label="Go to homepage">
          <Boxes className="size-7 text-brand-700 group-hover:text-brand-800" aria-hidden="true" />
          <div className="leading-tight">
            <div className="text-lg font-semibold tracking-tight text-gray-900">Beauty Catalog</div>
            <div className="text-xs text-gray-500">Manufacturing Products</div>
          </div>
        </Link>
        <nav aria-label="Main" className="hidden sm:flex items-center gap-6">
          <NavLink to="/" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-brand-700' : 'text-gray-700 hover:text-gray-900'}`}>Home</NavLink>
          <NavLink to="/catalog" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-brand-700' : 'text-gray-700 hover:text-gray-900'}`}>Catalog</NavLink>
          <NavLink to="/contact" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-brand-700' : 'text-gray-700 hover:text-gray-900'}`}>Contact</NavLink>
        </nav>
        <form onSubmit={onSubmit} role="search" className="hidden md:flex items-center gap-2 w-1/3" aria-label="Site-wide search">
          <label htmlFor="q" className="sr-only">Search products</label>
          <div className="relative flex-1">
            <input id="q" name="q" defaultValue={q} type="search" placeholder="Search by name, SKU, category..." className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
          </div>
          <button type="submit" className="inline-flex items-center gap-1 rounded-md bg-brand-700 px-3 py-2 text-sm font-medium text-white shadow hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            <PackageSearch className="size-4" aria-hidden="true" />
            Search
          </button>
        </form>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container-safe py-8 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Beauty Catalog. All rights reserved.</p>
        <nav className="flex items-center gap-4" aria-label="Footer">
          <Link className="hover:text-gray-900" to="/catalog">All Products</Link>
          <Link className="hover:text-gray-900" to="/contact">Contact</Link>
          <a className="hover:text-gray-900" href="#top">Back to top</a>
        </nav>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-gray-900 px-3 py-2 rounded shadow">Skip to content</a>
      <Header />
      <main id="main" className="flex-1">
        <div className="container-safe py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
