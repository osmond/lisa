import { useState, useEffect, useRef } from 'react'

import Button from "./Button.jsx"
export default function NoteModal({ onSave, onClose }) {
  const [note, setNote] = useState('')
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
    onSave(note)
    onClose()
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <form ref={dialogRef} onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3 focus:outline-none">
        <div>
          <label htmlFor="note-input" className="block text-sm font-medium">Note</label>
          <textarea id="note-input" className="border rounded p-1 w-full" rows="3" value={note} onChange={e => setNote(e.target.value)} />
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
