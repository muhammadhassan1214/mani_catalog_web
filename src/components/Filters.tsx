import { useSearchParams } from 'react-router-dom'
import { CATEGORIES } from '../data/products'
import type { Status } from '../types'

const STATUSES: (Status | 'ALL')[] = ['ALL', 'In Stock', 'New', 'Updated', 'Discontinued']

export default function Filters() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'ALL'
  const status = params.get('status') || 'ALL'

  const setParam = (key: string, value: string) => {
    const sp = new URLSearchParams(params)
    sp.set(key, value)
    sp.set('page', '1')
    setParams(sp)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm text-gray-700 inline-flex items-center gap-2">
        Category
        <select value={category} onChange={(e) => setParam('category', e.target.value)} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
          <option value="ALL">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="text-sm text-gray-700 inline-flex items-center gap-2">
        Status
        <select value={status} onChange={(e) => setParam('status', e.target.value)} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
    </div>
  )
}

