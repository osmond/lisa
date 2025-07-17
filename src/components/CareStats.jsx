import React from 'react'
import { ListChecks, Drop, Sun } from 'phosphor-react'
import ProgressRing from './ProgressRing.jsx'

function StatBlock({ id, label, Icon, completed, total, ringClass, onClick }) {
  const pct = total > 0 ? Math.min(completed / total, 1) : 0
  const display = `${completed}/${total}`

  const size = 64

  const ariaLabel =
    label === 'All Tasks'
      ? `${completed} of ${total} tasks done`
      : `${completed} of ${total} ${label.toLowerCase()} tasks done`

  return (
    <div
      className={`flex flex-col items-center ${onClick ? 'cursor-pointer' : ''}`}
      style={{ width: size }}
      data-testid={`stat-${id}`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <ProgressRing percent={pct} size={size} colorClass={ringClass} />
        <div className="bg-white absolute inset-2 rounded-full flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center">
            <Icon className="w-3 h-3" aria-hidden="true" />
            <span
              className="text-sm font-semibold font-body"
              data-testid="stat-text"
            >
              {display}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-[11px] font-semibold text-gray-700 font-body">
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
  onTotalClick,
  onWaterClick,
  onFertClick,
}) {
  const totalCompleted = waterCompleted + fertCompleted
  const totalTasks = waterTotal + fertTotal
  const stats = [
    {
      id: 'total',
      label: 'All Tasks',
      Icon: ListChecks,
      completed: totalCompleted,
      total: totalTasks,
      ringClass: 'text-green-600',
      onClick: onTotalClick,
    },
    {
      id: 'water',
      label: 'Water',
      Icon: Drop,
      completed: waterCompleted,
      total: waterTotal,
      ringClass: 'text-blue-500',
      onClick: onWaterClick,
    },
    {
      id: 'fertilize',
      label: 'Fertilize',
      Icon: Sun,
      completed: fertCompleted,
      total: fertTotal,
      ringClass: 'text-yellow-700',
      onClick: onFertClick,
    },
  ]
  return (
    <div
      className="flex justify-around gap-4 flex-wrap my-4"
      data-testid="care-stats"
    >
      {stats.map(s => (
        <StatBlock key={s.label} {...s} />
      ))}
    </div>
  )
}
