import React from 'react'
import { ListChecks, Drop, Sun } from 'phosphor-react'
import ProgressRing from './ProgressRing.jsx'

function StatBlock({
  id,
  label,
  Icon,
  completed,
  total,
  ringClass,
  onClick,
  display,
  size = 64,
  subLabel,
}) {
  const pct = total > 0 ? Math.min(completed / total, 1) : 0
  const displayText = display ?? `${completed}/${total}`

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
      <div className="relative drop-shadow-sm" style={{ width: size, height: size }}>
        <ProgressRing percent={pct} size={size} colorClass={ringClass} />
        <div className="absolute inset-2 rounded-full flex items-center justify-center overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
          <div className="flex flex-col items-center">
            <Icon className="w-3 h-3" aria-hidden="true" />
            <span
              className="text-sm font-semibold font-body"
              data-testid="stat-text"
            >
              {displayText}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-[11px] font-semibold text-gray-700 font-body">
          {label}
        </span>
        {subLabel && (
          <span className="text-[11px] text-gray-500" data-testid="stat-sublabel">
            {subLabel}
          </span>
        )}
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
  waterDisplay,
  fertDisplay,
  totalDisplay,
  size = 64,
  summary = false,
}) {
  const totalCompleted = waterCompleted + fertCompleted
  const totalTasks = waterTotal + fertTotal

  if (summary && totalTasks > 0 && totalCompleted === totalTasks) {
    return (
      <div className="flex justify-center my-4" data-testid="care-stats">
        <span className="px-3 py-2 rounded-full bg-green-500 text-white text-sm font-semibold flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M229.66 77.66a8 8 0 0 1 0 11.31l-112 112a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.31L112 185.37l106.34-106.35a8 8 0 0 1 11.32 0Z" />
          </svg>
          {`All ${totalTasks} tasks complete today`}
        </span>
      </div>
    )
  }
  const stats = [
    {
      id: 'total',
      label: 'All Tasks',
      Icon: ListChecks,
      completed: totalCompleted,
      total: totalTasks,
      ringClass: 'text-emerald-600',
      onClick: onTotalClick,
      display: totalDisplay,
      size,
      subLabel: undefined,
    },
    {
      id: 'water',
      label: 'Water',
      Icon: Drop,
      completed: waterCompleted,
      total: waterTotal,
      ringClass: 'text-sky-500',
      onClick: onWaterClick,
      display: waterDisplay,
      size,
      subLabel: 'Watered',
    },
    {
      id: 'fertilize',
      label: 'Fertilize',
      Icon: Sun,
      completed: fertCompleted,
      total: fertTotal,
      ringClass: 'text-amber-600',
      onClick: onFertClick,
      display: fertDisplay,
      size,
      subLabel: 'Fertilized',
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
