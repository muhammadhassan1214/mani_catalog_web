import { useSearchParams } from 'react-router-dom'

const options = [12, 24, 48]

export default function PerPageSelect() {
  const [params, setParams] = useSearchParams()
  const perPage = Number(params.get('perPage') || '12')

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sp = new URLSearchParams(params)
    sp.set('perPage', e.target.value)
    sp.set('page', '1')
    setParams(sp)
  }

  return (
    <label className="text-sm text-gray-700 inline-flex items-center gap-2">
      Per page
      <select value={perPage} onChange={onChange} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
        {options.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </label>
  )
}

