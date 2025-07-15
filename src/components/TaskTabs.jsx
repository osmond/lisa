import React from 'react'

export default function TaskTabs({ value = 'Upcoming', onChange }) {
  const tabs = ['Upcoming', 'Past', 'By Plant']
  return (
    <div role="tablist" className="flex justify-center gap-2 my-2">
      {tabs.map(tab => (
        <button
          key={tab}
          role="tab"
          aria-selected={value === tab}
          onClick={() => onChange?.(tab)}
          className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none ${
            value === tab
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
