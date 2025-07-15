import { PlusIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'

export default function Fab() {
  return (
    <Link
      to="/add"
      className="fixed bottom-20 right-4 bg-accent text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700"
      aria-label="Add Plant"
    >
      <PlusIcon className="w-6 h-6" aria-hidden="true" />
    </Link>
  )
}
