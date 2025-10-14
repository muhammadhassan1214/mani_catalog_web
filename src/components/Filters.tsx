import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { clearCategoriesCache, fetchCategories } from '../lib/api'
import { useToast } from './ToastProvider'

export default function Filters() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'ALL'

  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)
  const { notify } = useToast()

  useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    setError(null)
    fetchCategories(ac.signal)
      .then((cats) => setCategories(cats))
      .catch((e) => {
        if (e.name !== 'AbortError') {
          setError('Failed to load categories')
          notify('Failed to load categories', 'error')
        }
      })
      .finally(() => setLoading(false))
    return () => ac.abort()
  }, [refresh, notify])

  const setParam = (key: string, value: string) => {
    const sp = new URLSearchParams(params)
    sp.set(key, value)
    sp.set('page', '1')
    setParams(sp)
  }

  const retry = () => {
    clearCategoriesCache()
    setRefresh((x) => x + 1)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm text-gray-700 inline-flex items-center gap-2">
        Category
        <select value={category} onChange={(e) => setParam('category', e.target.value)} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
          <option value="ALL">All</option>
          {loading ? (
            <option disabled>Loading…</option>
          ) : error ? (
            <option disabled>Error loading</option>
          ) : (
            categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))
          )}
        </select>
      </label>
      {error && (
        <button onClick={retry} className="text-sm rounded-md border px-2 py-1 border-gray-300 text-gray-700 hover:bg-gray-50">Retry</button>
      )}
    </div>
  )
}
