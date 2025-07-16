import { useState } from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import { Image, Note } from 'phosphor-react'

export default function PlantDetailFab({ onAddNote, onAddPhoto }) {
  const [open, setOpen] = useState(false)

  const handleNote = () => {
    setOpen(false)
    onAddNote?.()
  }

  const handlePhoto = () => {
    setOpen(false)
    onAddPhoto?.()
  }

  return (
    <div className="fixed bottom-20 right-4 flex flex-col items-end z-20">
      {open && (
        <ul className="mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg text-sm overflow-hidden py-2">
          <li>
            <button
              type="button"
              onClick={handleNote}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
            >
              <Note className="w-4 h-4" aria-hidden="true" />
              Add Note
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={handlePhoto}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
            >
              <Image className="w-4 h-4" aria-hidden="true" />
              Add Photo
            </button>
          </li>
        </ul>
      )}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Add"
        className="bg-accent text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700"
      >
        <PlusIcon className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  )
}

