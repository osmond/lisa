import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold font-display">Page Not Found</h1>
      <p className="text-gray-600">Sorry, we couldn\'t find that page.</p>
      <Link to="/" className="text-green-600 underline">
        Go to Home
      </Link>
    </div>
  )
}
