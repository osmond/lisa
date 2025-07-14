import { Link, useLocation } from 'react-router-dom'
import { PlusIcon } from '@radix-ui/react-icons'

export default function FloatingAddButton() {
  const { pathname } = useLocation()
  if (pathname === '/add') return null
  return (
    <Link
      to="/add"
      aria-label="Add plant"
      className="fixed bottom-20 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 focus:outline-none"
    >
      <PlusIcon className="w-6 h-6" aria-hidden="true" />
    </Link>
  )
}
