import { useState } from 'react'

export default function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border rounded-xl divide-y">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex justify-between items-center px-4 py-2 font-semibold text-left"
      >
        <span>{title}</span>
        <span className="text-sm text-green-600">
          {open ? 'Hide Details' : 'Show Details'}
        </span>
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  )
}
