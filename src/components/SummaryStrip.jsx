import React from 'react'
import { ListChecks, Drop, Sun } from 'phosphor-react'
import ProgressRing from './ProgressRing.jsx'

const colors = {
  green: { bg: 'bg-green-50', text: 'text-green-600', ring: 'text-green-500' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'text-blue-500' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', ring: 'text-yellow-500' },
}

export default function SummaryStrip({
  total,
  watered,
  fertilized,
  waterCompleted = 0,
  waterTotal = 0,
  fertCompleted = 0,
  fertTotal = 0,
  onClick,
}) {
  const size = 60
  const items = [
    {
      label: 'Total',
      count: total,
      Icon: ListChecks,
      color: 'green',
      completed: waterCompleted + fertCompleted,
      totalTasks: waterTotal + fertTotal,
    },
    {
      label: 'Water',
      count: watered,
      Icon: Drop,
      color: 'blue',
      completed: waterCompleted,
      totalTasks: waterTotal,
    },
    {
      label: 'Fertilize',
      count: fertilized,
      Icon: Sun,
      color: 'yellow',
      completed: fertCompleted,
      totalTasks: fertTotal,
    },
  ]
  return (
    <div
      className={`flex flex-wrap gap-2 rounded-2xl shadow-sm bg-white p-3 font-body ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {items.map(item => {
        const pct = item.totalTasks > 0 ? Math.min(item.completed / item.totalTasks, 1) : 0
        return (
          <div key={item.label} className="flex-1 flex justify-center">
            <div className="relative" style={{ width: size, height: size }}>
              <ProgressRing percent={pct} size={size} colorClass={colors[item.color].ring} />
              <div className={`${colors[item.color].bg} absolute inset-2 rounded-full flex flex-col items-center justify-center space-y-1`}>
                <div className="flex items-center justify-center gap-1">
                  <item.Icon className={`w-4 h-4 ${colors[item.color].text}`} aria-hidden="true" />
                  <p className="text-xs text-gray-500 font-medium font-body">{item.label}</p>
                </div>
                <p className={`text-lg font-semibold font-body ${colors[item.color].text}`} data-testid={`summary-${item.label.toLowerCase()}`}>{item.count}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
