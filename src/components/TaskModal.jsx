import { useEffect, useRef, useState } from 'react'

import Button from "./Button.jsx"
export default function TaskModal({ onSave, onClose }) {
  const [amount, setAmount] = useState('')
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
    onSave({ amount, note })
    onClose()
  }

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
          <label className="block text-sm font-medium" htmlFor="water-amount">Amount (ml)</label>
          <input
            id="water-amount"
            type="number"
            className="border rounded p-1 w-full"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="water-note">Note</label>
          <textarea
            id="water-note"
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
          <Button type="submit" className="px-3 py-1 bg-primary-green text-white">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}
