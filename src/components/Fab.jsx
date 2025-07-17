import { PlusIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Fab() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-label="Add options"
        >
          <div
            className="absolute bottom-24 right-4 space-y-2"
            onClick={e => e.stopPropagation()}
          >
            <Link
              to="/add"
              className="block px-4 py-2 bg-accent text-white rounded shadow"
            >
              Add Plant
            </Link>
            <Link
              to="/room/add"
              className="block px-4 py-2 bg-accent text-white rounded shadow"
            >
              Add Room
            </Link>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-20 right-4 bg-accent text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700"
        aria-label="Add"
      >
        <PlusIcon className="w-6 h-6" aria-hidden="true" />
      </button>
    </>
  )
}
