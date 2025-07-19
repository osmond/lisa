import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useMenu } from '../MenuContext.jsx'
import useOverdueCount from '../hooks/useOverdueCount.js'

export default function PersistentBottomNav() {
  const [open, setOpen] = useState(false)
  const overdueCount = useOverdueCount()
  const { menu } = useMenu()

  const { items, Icon } = menu
  const maxVisible = 5
  const mainLinks = items.slice(0, maxVisible)
  const moreItems = items.slice(maxVisible)


  useEffect(() => {
    if (!open) return
    const handleKey = e => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 pb-safe z-20">
      <ul className="flex justify-around items-center py-2 text-xs">
        {mainLinks.map(({ to, label, Icon: LinkIcon }) => {
          const showBadge = label === 'All Plants' && overdueCount > 0
          return (
            <li key={to ?? label} className="relative">
              <NavLink
                to={to}
                title={label}
                aria-label={label}
                className={({ isActive }) =>
                  `flex flex-col items-center ${isActive ? 'text-accent' : 'text-gray-500'}`
                }
              >
                <LinkIcon className="w-6 h-6" aria-hidden="true" />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-badge rounded-full px-1">
                    {overdueCount}
                  </span>
                )}
              </NavLink>
            </li>
          )
        })}
        {moreItems.length > 0 && (
          <li>
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="flex flex-col items-center text-gray-500"
              title="More"
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
            </button>
          </li>
        )}
      </ul>
      {open && moreItems.length > 0 && (
        <div
          className="modal-overlay bg-black/50 z-30 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onClick={() => setOpen(false)}
        >
          <ul
            className="modal-box relative p-6 space-y-4 bloom-pop text-lg"
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
            {moreItems.map(({ to, onClick, label, Icon: ItemIcon }) => (
              <li key={to ?? label}>
                {to ? (
                  <NavLink
                    to={to}
                    onClick={() => setOpen(false)}
                    title={label}
                    className="flex items-center gap-3 hover:text-accent"
                  >
                    <ItemIcon className="w-5 h-5" aria-hidden="true" />
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
                    <ItemIcon className="w-5 h-5" aria-hidden="true" />
                    {label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
