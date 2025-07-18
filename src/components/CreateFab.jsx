import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Plus, Leaf, Door } from 'phosphor-react'

export default function CreateFab() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const handleKey = e => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  const items = [
    { to: '/add', label: 'Add Plant', Icon: Leaf },
    { to: '/room/add', label: 'Add Room', Icon: Door },
  ]

  return (
    <div className="fixed bottom-24 right-20 z-30">
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Add menu"
          onClick={() => setOpen(false)}
        >
          <ul
            className="relative bg-white dark:bg-gray-700 rounded-xl shadow-xl p-8 space-y-4 animate-fade-in-up"
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
            {items.map(({ to, label, Icon }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  onClick={() => setOpen(false)}
                  title={label}
                  className="flex items-center gap-3 hover:text-accent"
                >
                  <Plus className="w-5 h-5" aria-hidden="true" />
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
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
