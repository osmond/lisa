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
        className="flex justify-around px-4 pt-2 border-b border-gray-200 dark:border-gray-600"
      >
        {tabs.map(tab => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleClick(tab.id)}
              className={`relative flex-1 px-3 py-1 text-sm focus:outline-none ${
                isActive
                  ? 'font-semibold text-gray-900 dark:text-gray-100 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-green-600'
                  : 'text-gray-500'
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
