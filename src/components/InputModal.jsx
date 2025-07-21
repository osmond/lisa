import { useEffect, useRef, useState } from 'react'

export default function InputModal({ label = 'Edit', initialValue = '', onSave, onCancel }) {
  const [value, setValue] = useState(initialValue)
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
    <div role="dialog" aria-modal="true" aria-label={label} className="modal-overlay bg-black bg-opacity-70 z-50">
      <div className="modal-box p-4 w-72 max-w-full">
        <label className="block mb-2 font-headline" htmlFor="input-modal">{label}</label>
        <input
          id="input-modal"
          ref={inputRef}
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full border rounded p-2 dark:bg-gray-600"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => onCancel?.()} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded">Cancel</button>
          <button onClick={() => onSave(value)} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  )
}
