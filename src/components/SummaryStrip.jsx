import React from 'react'

export default function SummaryStrip({ total, watered, fertilized }) {
  const items = [
    { label: 'Total', count: total },
    { label: 'Water', count: watered },
    { label: 'Fertilize', count: fertilized },
  ]
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl shadow-sm bg-white p-3">
      {items.map(item => (
        <div key={item.label} className="flex-1">
          <div className="bg-sage rounded-full text-center py-2">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-lg font-semibold" data-testid={`summary-${item.label.toLowerCase()}`}>{item.count}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
