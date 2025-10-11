import { useSearchParams } from 'react-router-dom'

const options = [
  { value: 'ALPHA_ASC', label: 'Alphabetical (A–Z)' },
  { value: 'ALPHA_DESC', label: 'Alphabetical (Z–A)' },
  { value: 'DATE_NEW', label: 'Date (Newest)' },
  { value: 'DATE_OLD', label: 'Date (Oldest)' },
  { value: 'PRICE_ASC', label: 'Price (Low to High)' },
  { value: 'PRICE_DESC', label: 'Price (High to Low)' },
]

export default function SortSelect() {
  const [params, setParams] = useSearchParams()
  const sort = params.get('sort') || 'ALPHA_ASC'

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sp = new URLSearchParams(params)
    sp.set('sort', e.target.value)
    sp.set('page', '1')
    setParams(sp)
  }

  return (
    <label className="text-sm text-gray-700 inline-flex items-center gap-2">
      Sort by
      <select value={sort} onChange={onChange} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}

