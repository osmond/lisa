import React from 'react'

export default function CareRings({
  waterCompleted = 0,
  waterTotal = 0,
  fertCompleted = 0,
  fertTotal = 0,
  size = 48,
  strokeWidth = 4,
  onClick,
}) {
  const totalCompleted = waterCompleted + fertCompleted
  const totalTasks = waterTotal + fertTotal
  const noTasks = totalTasks === 0
  const outerRadius = size / 2 - strokeWidth / 2
  const innerRadius = outerRadius - strokeWidth - 2
  const outerCirc = 2 * Math.PI * outerRadius
  const innerCirc = 2 * Math.PI * innerRadius

  const waterPct = waterTotal > 0 ? Math.min(waterCompleted / waterTotal, 1) : 0
  const fertPct = fertTotal > 0 ? Math.min(fertCompleted / fertTotal, 1) : 0

  const waterOffset = outerCirc * (1 - waterPct)
  const fertOffset = innerCirc * (1 - fertPct)

  const label = `${Math.round(waterPct * 100)}% watered, ${Math.round(
    fertPct * 100
  )}% fertilized`

  const center = size / 2
  const rotate = `rotate(-90 ${center} ${center})`

  const allComplete = totalTasks > 0 && totalCompleted === totalTasks
  const progressText = noTasks
    ? 'Rest Day'
    : allComplete
    ? '🎉 All done!'
    : `${totalCompleted} / ${totalTasks} tasks done`

  const displaySize = noTasks ? size * 0.8 : size

  return (
    <div
      className={`inline-flex flex-col items-center ${onClick ? 'cursor-pointer' : ''}`}
      style={{ width: displaySize }}
      onClick={onClick}
    >
      <div className="relative" style={{ width: displaySize, height: displaySize }}>
        <svg
          width={displaySize}
          height={displaySize}
          viewBox={`0 0 ${displaySize} ${displaySize}`}
          role="img"
          aria-label={label}
          className={allComplete ? 'swirl-once' : noTasks ? '' : 'ring-pulse'}
        >
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={outerCirc}
            strokeDashoffset={waterOffset}
            className="text-blue-500 transition-[stroke-dashoffset] duration-300"
            transform={rotate}
          />
          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={innerCirc}
            strokeDashoffset={fertOffset}
            className="text-green-500 transition-[stroke-dashoffset] duration-300"
            transform={rotate}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-body font-semibold drop-shadow">
          {progressText}
        </div>
      </div>
      <div className="text-xs text-gray-500 font-body mt-1">
        <div>Water: {waterCompleted}/{waterTotal}</div>
        <div>Fertilizer: {fertCompleted}/{fertTotal}</div>
      </div>
    </div>
  )
}
