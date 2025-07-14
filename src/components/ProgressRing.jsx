import React from 'react'

export default function ProgressRing({ completed = 0, total = 0, radius = 36, stroke = 4 }) {
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const progress = total === 0 ? 0 : completed / total
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div
      className="relative inline-block"
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemax={total}
    >
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#15803d"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {completed}/{total}
      </span>
    </div>
  )
}
