import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { useMenu } from '../MenuContext.jsx'

export default function BottomNav() {
  const [open, setOpen] = useState(false)
  const { menu } = useMenu()
  const { items, Icon } = menu

  useEffect(() => {
    if (!open) return
    const handleKey = e => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <div className="fixed bottom-4 right-4 z-20">
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-30"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onClick={() => setOpen(false)}
        >
          <ul
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 space-y-4 bloom-pop text-lg"
            onClick={e => e.stopPropagation()}
          >
            {items.map(({ to, onClick, label, Icon }) => (
              <li key={label}>
                {to ? (
                  <NavLink
                    to={to}
                    onClick={() => setOpen(false)}
                    title={label}
                    className="flex items-center gap-3 hover:text-accent"
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    {label}
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      onClick?.()
                    }}
                    title={label}
                    className="flex items-center gap-3 w-full text-left hover:text-accent"
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    {label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Open navigation menu"
        title="Open navigation menu"
        className="bg-accent text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700"
      >
        <Icon className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  )
}
