export default function SpecsTable({ specs }: { specs?: Record<string, string | number | boolean> }) {
  if (!specs || Object.keys(specs).length === 0) return null
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border divide-y divide-gray-200">
        <tbody className="divide-y divide-gray-200">
          {Object.entries(specs).map(([k, v]) => (
            <tr key={k} className="bg-white">
              <th scope="row" className="w-1/3 whitespace-nowrap bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700">{k}</th>
              <td className="px-4 py-2 text-sm text-gray-700">{String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

