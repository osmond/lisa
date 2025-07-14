import { useState, useRef, useEffect } from 'react'
import { PlusIcon } from '@radix-ui/react-icons'

export default function AddActionsMenu({
  onAddPlant,
  onAddNote,
  onAddPhoto,
  onAddLog,
}) {
  const [open, setOpen] = useState(false)
  const firstRef = useRef(null)

  useEffect(() => {
    if (open) {
      const handler = e => {
        if (e.key === 'Escape') setOpen(false)
      }
      window.addEventListener('keydown', handler)
      firstRef.current?.focus()
      return () => window.removeEventListener('keydown', handler)
    }
  }, [open])

  const handle = callback => {
    setOpen(false)
    callback && callback()
  }

  return (
    <div className="relative">
      <button
        aria-label="Add"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="w-12 h-12 bg-[var(--km-accent)] rounded-full flex items-center justify-center text-white"
      >
        <PlusIcon aria-hidden="true" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 shadow rounded p-2 flex flex-col z-50"
        >
          <button ref={firstRef} onClick={() => handle(onAddPlant)} className="px-4 py-1 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            Add Plant
          </button>
          <button onClick={() => handle(onAddNote)} className="px-4 py-1 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            Add Note
          </button>
          <button onClick={() => handle(onAddPhoto)} className="px-4 py-1 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            Add Photo
          </button>
          <button onClick={() => handle(onAddLog)} className="px-4 py-1 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            Add Entry
          </button>
        </div>
      )}
    </div>
  )
}
