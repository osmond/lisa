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
      <div role="tablist" className="flex justify-center gap-2 my-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => handleClick(tab.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none ${
              active === tab.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{activeTab?.content}</div>
    </div>
  )
}
