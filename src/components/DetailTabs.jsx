import { useState } from 'react'

export default function DetailTabs({ tabs = [], value, onChange, className = '' }) {
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
    <div className={`bg-white dark:bg-gray-700 rounded-xl shadow ${className}`.trim()}>
      <div
        role="tablist"
        className="flex justify-center gap-2 px-4 pt-2"
      >
        {tabs.map(tab => {
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
              {tab.label}
            </button>
          )
        })}
      </div>
      <div className="px-4 pb-4 pt-2">{activeTab?.content}</div>
    </div>
  )
}
