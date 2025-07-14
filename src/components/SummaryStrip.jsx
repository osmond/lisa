import React from 'react'
import { ListChecks, Drop, Sun } from 'phosphor-react'

const colors = {
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
}

export default function SummaryStrip({ total, watered, fertilized }) {
  const items = [
    { label: 'Total', count: total, Icon: ListChecks, color: 'green' },
    { label: 'Water', count: watered, Icon: Drop, color: 'blue' },
    { label: 'Fertilize', count: fertilized, Icon: Sun, color: 'yellow' },
  ]
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl shadow-sm bg-white p-3 font-body">
      {items.map(item => (
        <div key={item.label} className="flex-1">
          <div className={`${colors[item.color].bg} rounded-full text-center py-2 space-y-1`}>
            <div className="flex items-center justify-center gap-1">
              <item.Icon className={`w-4 h-4 ${colors[item.color].text}`} aria-hidden="true" />
              <p className="text-xs text-gray-500 font-medium font-body">{item.label}</p>
            </div>
            <p className={`text-lg font-semibold font-body ${colors[item.color].text}`} data-testid={`summary-${item.label.toLowerCase()}`}>{item.count}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
