import { useState, useEffect, useRef } from 'react'

import Button from "./Button.jsx"
export default function LogModal({ onSave, onClose, defaultType = '', defaultDate }) {
  const today = new Date().toISOString().slice(0, 10)
  const [type, setType] = useState(defaultType)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(defaultDate || today)
  const [mood, setMood] = useState('')
  const dialogRef = useRef(null)

  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = e => {
    e.preventDefault()
    onSave({ type, note, date, mood })
    onClose()
  }

  const suggestions = ['Watered', 'Rotating', 'Pruned']

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      <form
        ref={dialogRef}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3 focus:outline-none"
      >
        <div>
          <label className="block text-sm font-medium" htmlFor="log-date">Date</label>
          <input
            id="log-date"
            type="date"
            className="border rounded p-1 w-full"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="log-type">Type</label>
          <input
            id="log-type"
            list="log-type-suggestions"
            className="border rounded p-1 w-full"
            value={type}
            onChange={e => setType(e.target.value)}
            required
          />
          <datalist id="log-type-suggestions">
            {suggestions.map(s => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="log-mood">Mood</label>
          <select
            id="log-mood"
            className="border rounded p-1 w-full"
            value={mood}
            onChange={e => setMood(e.target.value)}
          >
            <option value="">--</option>
            <option value="Happy">Happy 🌞</option>
            <option value="Droopy">Droopy 🥀</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="log-note">Note</label>
          <textarea
            id="log-note"
            className="border rounded p-1 w-full"
            value={note}
            onChange={e => setNote(e.target.value)}
            rows="3"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" onClick={onClose} className="px-3 py-1 bg-gray-200 dark:bg-gray-700">
            Cancel
          </Button>
          <Button type="submit" className="px-3 py-1 bg-[var(--km-accent)] text-white">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}
