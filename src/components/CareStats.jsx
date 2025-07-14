import React from 'react'
import { ListChecks, Drop, Sun } from 'phosphor-react'
import ProgressRing from './ProgressRing.jsx'

function StatBlock({ label, Icon, completed, total, ringClass }) {
  const pct = total > 0 ? Math.min(completed / total, 1) : 0
  return (
    <div className="flex flex-col items-center" data-testid={`stat-${label.toLowerCase()}`}> 
      <div className="relative" style={{ width: 80, height: 80 }}>
        <ProgressRing percent={pct} size={80} colorClass={ringClass} />
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
          <span className="text-lg font-semibold font-body">{completed}</span>
          <span className="text-xs text-gray-500 font-body">done</span>
          {total > 0 && (
            <span className="text-[10px] text-gray-400 font-body">of {total}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <Icon className="w-4 h-4 text-gray-500" aria-hidden="true" />
        <span className="text-xs font-medium text-gray-600 font-body">{label}</span>
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
