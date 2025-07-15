import { useEffect, useRef, useState } from 'react'

export default function NoteModal({ label = 'Add Note', onSave, onCancel }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleKey = e => {
      if (e.key === 'Escape') {
        onCancel?.()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 w-72 max-w-full">
        <label className="block mb-2 font-headline" htmlFor="note-input">
          {label}
        </label>
        <textarea
          id="note-input"
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full border rounded p-2 dark:bg-gray-600"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => onCancel?.()}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(text)}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
