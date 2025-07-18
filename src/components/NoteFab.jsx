import { useState, useEffect } from 'react'
import { Plus, Note } from 'phosphor-react'

export default function NoteFab({ onAddNote }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const handleKey = e => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <div className="absolute bottom-4 right-4 z-30">
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Add menu"
          onClick={() => setOpen(false)}
        >
          <ul
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 w-52 space-y-3 animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              &times;
            </button>
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onAddNote?.()
                }}
                title="Add Note"
                className="flex items-center gap-3 w-full rounded-lg p-2 hover:bg-green-50 dark:hover:bg-gray-600 transition"
              >
                <span className="p-2 rounded-full bg-violet-100">
                  <Note className="w-5 h-5 text-violet-600" aria-hidden="true" />
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-200">Add Note</span>
              </button>
            </li>
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Open create menu"
        title="Open create menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className={`bg-accent text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-transform ${open ? 'ring-pulse' : ''}`}
      >
        <Plus className={`w-6 h-6 transition-transform ${open ? 'rotate-45' : ''}`} aria-hidden="true" />
      </button>
    </div>
  )
}
