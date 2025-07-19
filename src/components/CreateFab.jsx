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
    { to: '/add', label: 'Add Plant', Icon: Leaf, color: 'green' },
    { to: '/room/add', label: 'Add Room', Icon: Door, color: 'violet' },
  ]

  const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
  }

  return (
    <div className="fixed bottom-24 right-20 z-30">
      {open && (
        <div
          className="modal-overlay bg-black/50 z-30 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Add menu"
          onClick={() => setOpen(false)}
        >
          <ul
            className="modal-box relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 w-52 grid grid-cols-2 gap-2 animate-fade-in-up"
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
            {items.map(({ to, label, Icon, color }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  onClick={() => setOpen(false)}
                  title={label}
                  className="flex items-center gap-4 w-full rounded-lg p-2 hover:bg-green-50 dark:hover:bg-gray-600 transition"
                >
                  <span className={`p-2 rounded-full ${colorClasses[color].bg}`}>
                    <Icon className={`w-5 h-5 ${colorClasses[color].text}`} aria-hidden="true" />
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">{label}</span>
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
