import type { Status } from '../types'
import clsx from 'clsx'

export default function StatusBadge({ status }: { status: Status }) {
  const styles = {
    'In Stock': 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    'New': 'bg-blue-50 text-blue-700 ring-blue-600/20',
    'Updated': 'bg-amber-50 text-amber-800 ring-amber-600/20',
    'Discontinued': 'bg-gray-100 text-gray-700 ring-gray-500/20',
  } as const

  return (
    <span className={clsx('inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset', styles[status])}>
      {status}
    </span>
  )
}
