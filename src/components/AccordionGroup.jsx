import { useState } from 'react'

export default function AccordionGroup({ sections = [] }) {
  const [active, setActive] = useState(null)

  return (
    <div className="space-y-4">
      {sections.map(({ id, title, content }) => (
        <div key={id} className="border rounded-xl divide-y">
          <button
            type="button"
            onClick={() => setActive(active === id ? null : id)}
            aria-expanded={active === id}
            className="w-full flex justify-between items-center px-4 py-2 font-semibold text-left"
          >
            <span>{title}</span>
            <span className="text-sm text-green-600">
              {active === id ? 'Hide Details' : 'Show Details'}
            </span>
          </button>
          {active === id && <div className="p-4">{content}</div>}
        </div>
      ))}
    </div>
  )
}
