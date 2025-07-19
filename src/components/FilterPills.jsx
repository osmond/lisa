import React from 'react'

export default function FilterPills({ options = [], value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value ?? opt.label}
          type="button"
          onClick={() => onChange?.(opt.value)}
          className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none ${
            value === opt.value
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
