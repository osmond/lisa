import { useState } from 'react'

export default function DetailTabs({ tabs = [], value, onChange }) {
  const [internal, setInternal] = useState(value ?? tabs[0]?.id)
  const active = value ?? internal

  const handleClick = id => {
    onChange?.(id)
    if (value === undefined) {
      setInternal(id)
    }
  }

  const activeTab = tabs.find(t => t.id === active)

  return (
    <div>
      <div role="tablist" className="flex justify-center gap-2 py-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleClick(tab.id)}
              className={`px-3 py-1 text-sm border-b-2 focus:outline-none ${
                isActive
                  ? 'border-green-600 font-semibold'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {Icon && <Icon className="inline w-4 h-4 mr-1" aria-hidden="true" />}
              {tab.label}
            </button>
          )
        })}
      </div>
      <div className="mt-4">{activeTab?.content}</div>
    </div>
  )
}
