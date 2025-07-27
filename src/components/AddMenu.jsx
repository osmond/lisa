import { NavLink } from 'react-router-dom'
import { Plus, Note, MagicWand } from 'phosphor-react'

export default function AddMenu({ open = false, onClose = () => {} }) {
  if (!open) return null
  const items = [
    { to: '/onboard', label: 'Add Plant', Icon: Plus },
    { to: '/room/add', label: 'Add Room', Icon: Plus },
    // Future: { to: '/note/add', label: 'Add Note', Icon: Note }
  ]
  return (
    <div
      className="modal-overlay bg-black/50 z-30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Add menu"
      onClick={onClose}
    >
      <ul
        className="modal-box relative p-6 space-y-4 bloom-pop text-lg"
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
              className="flex items-center gap-4 hover:text-accent"
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
