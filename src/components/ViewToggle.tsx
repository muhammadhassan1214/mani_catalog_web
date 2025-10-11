import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List } from 'lucide-react'

export default function ViewToggle() {
  const [params, setParams] = useSearchParams()
  const view = (params.get('view') as 'grid' | 'list') || 'grid'

  const setView = (v: 'grid' | 'list') => {
    const sp = new URLSearchParams(params)
    sp.set('view', v)
    setParams(sp)
  }

  return (
    <div className="inline-flex rounded-md border border-gray-300 bg-white shadow-sm" role="group" aria-label="Toggle view">
      <button type="button" onClick={() => setView('grid')} aria-pressed={view === 'grid'} className={`px-2 py-1 rounded-l-md ${view === 'grid' ? 'bg-brand-700 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
        <LayoutGrid className="size-4" />
      </button>
      <button type="button" onClick={() => setView('list')} aria-pressed={view === 'list'} className={`px-2 py-1 rounded-r-md ${view === 'list' ? 'bg-brand-700 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
        <List className="size-4" />
      </button>
    </div>
  )
}

