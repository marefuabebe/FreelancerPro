import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-semibold mb-2">404</h1>
      <p className="text-slate-600 mb-4">Page not found</p>
      <Link to="/" className="text-indigo-600">Go back home</Link>
    </div>
  )
}


