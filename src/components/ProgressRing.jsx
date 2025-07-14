import React from 'react'

export default function ProgressRing({
  percent = 0,
  size = 48,
  strokeWidth = 5,
  colorClass = '',
  displayMode = 'ring',
  displayText = '',
}) {
  const clamped = Math.min(Math.max(percent, 0), 1)
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - clamped)
  const center = size / 2
  const rotate = `rotate(-90 ${center} ${center})`
  const isComplete = clamped === 1

  if (displayMode === 'count') {
    const thin = 2
    const r = size / 2 - thin / 2
    const circ = 2 * Math.PI * r
    const off = circ * (1 - clamped)
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={thin}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={off}
          className={`${colorClass} transition-[stroke-dashoffset] duration-300 ${isComplete ? 'ring-complete' : ''}`}
          transform={rotate}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-xs font-semibold font-body fill-current"
          data-testid="stat-text"
        >
          {displayText}
        </text>
      </svg>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="absolute inset-0"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={`${colorClass} transition-[stroke-dashoffset] duration-300 ${isComplete ? 'ring-complete' : ''}`}
        transform={rotate}
      />
    </svg>
  )
}
