import { NavLink } from 'react-router-dom'
import { Plus, Note } from 'phosphor-react'

export default function AddMenu({ open = false, onClose = () => {} }) {
  if (!open) return null
  const items = [
    { to: '/add', label: 'Add Plant', Icon: Plus },
    { to: '/room/add', label: 'Add Room', Icon: Plus },
    // Future: { to: '/note/add', label: 'Add Note', Icon: Note }
  ]
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Add menu"
      onClick={onClose}
    >
      <ul
        className="relative bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 space-y-4 bloom-pop text-lg"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="modal-close"
        >
          &times;
        </button>
        {items.map(({ to, label, Icon }) => (
          <li key={label}>
            <NavLink
              to={to}
              onClick={onClose}
              title={label}
              className="flex items-center gap-3 hover:text-accent"
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
