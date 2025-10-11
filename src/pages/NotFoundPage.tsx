import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-4 inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white">Go home</Link>
    </div>
  )
}
