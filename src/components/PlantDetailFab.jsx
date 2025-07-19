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
    { label: 'Mark Watered', Icon: Drop, action: onWater, color: 'blue', section: 'Care' },
    {
      label: 'Mark Fertilized',
      Icon: Flower,
      action: onFertilize,
      color: 'yellow',
      section: 'Care',
    },
    { label: 'Add Photo', Icon: ImageIcon, action: onAddPhoto, color: 'green', section: 'Journal' },
    { label: 'Add Note', Icon: Note, action: onAddNote, color: 'violet', section: 'Journal' },
  ]

  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
  }

  return (
    <div className="absolute bottom-4 right-4 z-30">
      {open && (
        <div
          className="modal-overlay bg-black/50 z-30 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Log new care"
          onClick={() => setOpen(false)}
        >
          <ul
            className="modal-box relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl px-5 py-4 w-[90%] max-w-[360px] space-y-2 animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            <li className="flex items-center justify-between">
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
            </li>
            <li className="list-none text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mt-2">
              Care
            </li>
            {items
              .filter(i => i.section === 'Care')
              .map(({ label, Icon, action, color }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      action?.()
                    }}
                    title={label}
                    className="flex items-center gap-3 w-full rounded-md px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <span className={`p-2 rounded-full ${colorClasses[color].bg}`}> 
                      <Icon className={`w-5 h-5 ${colorClasses[color].text}`} aria-hidden="true" />
                    </span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {label}
                    </span>
                  </button>
                </li>
              ))}
            <hr className="border-t border-gray-200 dark:border-gray-700" />
            <li className="list-none text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mt-2">
              Journal
            </li>
            {items
              .filter(i => i.section === 'Journal')
              .map(({ label, Icon, action, color }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      action?.()
                    }}
                    title={label}
                    className="flex items-center gap-3 w-full rounded-md px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <span className={`p-2 rounded-full ${colorClasses[color].bg}`}> 
                      <Icon className={`w-5 h-5 ${colorClasses[color].text}`} aria-hidden="true" />
                    </span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {label}
                    </span>
                  </button>
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
