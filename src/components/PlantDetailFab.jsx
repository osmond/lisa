import { useState, useEffect } from 'react'
import { Plus, Image as ImageIcon, Note, Drop, Flower } from 'phosphor-react'

export default function PlantDetailFab({
  onAddPhoto,
  onAddNote,
  onWater,
  onFertilize,
}) {
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
    { label: 'Mark Watered', Icon: Drop, action: onWater, color: 'blue' },
    {
      label: 'Mark Fertilized',
      Icon: Flower,
      action: onFertilize,
      color: 'yellow',
    },
    { label: 'Add Photo', Icon: ImageIcon, action: onAddPhoto, color: 'green' },
    { label: 'Add Note', Icon: Note, action: onAddNote, color: 'violet' },
  ]

  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
  }

  return (
    <div className="absolute bottom-2 right-4 z-30 drop-shadow-md">
      {open && (
        <div
          className="modal-overlay bg-black/50 z-30 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Log new care"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal-box relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl px-5 py-4 min-w-[320px] max-w-[360px] animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex-1 text-center font-headline text-heading">
                Log new care
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-gray-500"
              >
                &times;
              </button>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {items.map(({ label, Icon, action, color }) => (
                <li key={label} className="list-none">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      action?.()
                    }}
                    title={label}
                    className="flex flex-col items-center gap-2 w-full rounded-md px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <span className={`p-2 rounded-full ${colorClasses[color].bg}`}>
                      <Icon className={`w-5 h-5 ${colorClasses[color].text}`} aria-hidden="true" />
                    </span>
                    <span className="text-sm text-gray-800 dark:text-gray-200 text-center">
                      {label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Log new care"
        title="Log New Care"
        aria-expanded={open}
        aria-haspopup="menu"
        className={`bg-accent text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-transform ${open ? 'ring-pulse' : ''}`}
      >
        <Plus className={`w-6 h-6 transition-transform ${open ? 'rotate-45' : ''}`} aria-hidden="true" />
      </button>
    </div>
  )
}
