import React from 'react'
import { ListChecks, Drop, Sun } from 'phosphor-react'
import ProgressRing from './ProgressRing.jsx'

function StatBlock({ label, Icon, completed, total, ringClass }) {
  const pct = total > 0 ? Math.min(completed / total, 1) : 0
  const display = `${completed}/${total}`
  const size = 64
  return (
    <div
      className="flex flex-col items-center"
      data-testid={`stat-${label.toLowerCase()}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <ProgressRing percent={pct} size={size} colorClass={ringClass} />
        <div className="bg-white absolute inset-2 rounded-full flex items-center justify-center">
          <span
            className="text-sm font-semibold font-body"
            data-testid="stat-text"
          >
            {display}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <Icon className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
        <span className="text-[11px] font-medium text-gray-600 font-body">
          {label}
        </span>
      </div>
    </div>
  )
}

export default function CareStats({
  waterCompleted = 0,
  waterTotal = 0,
  fertCompleted = 0,
  fertTotal = 0,
}) {
  const totalCompleted = waterCompleted + fertCompleted
  const totalTasks = waterTotal + fertTotal
  const stats = [
    {
      label: 'Total',
      Icon: ListChecks,
      completed: totalCompleted,
      total: totalTasks,
      ringClass: 'text-green-500',
    },
    {
      label: 'Water',
      Icon: Drop,
      completed: waterCompleted,
      total: waterTotal,
      ringClass: 'text-blue-500',
    },
    {
      label: 'Fertilize',
      Icon: Sun,
      completed: fertCompleted,
      total: fertTotal,
      ringClass: 'text-yellow-500',
    },
  ]
  return (
    <div className="flex justify-around gap-4 flex-wrap" data-testid="care-stats">
      {stats.map(s => (
        <StatBlock key={s.label} {...s} />
      ))}
    </div>
  )
}
