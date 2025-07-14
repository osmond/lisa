import React from 'react'

export default function CareRings({
  waterCompleted = 0,
  waterTotal = 0,
  fertCompleted = 0,
  fertTotal = 0,
  size = 48,
  strokeWidth = 4,
}) {
  const outerRadius = size / 2 - strokeWidth / 2
  const innerRadius = outerRadius - strokeWidth - 2
  const outerCirc = 2 * Math.PI * outerRadius
  const innerCirc = 2 * Math.PI * innerRadius

  const waterPct = waterTotal > 0 ? Math.min(waterCompleted / waterTotal, 1) : 0
  const fertPct = fertTotal > 0 ? Math.min(fertCompleted / fertTotal, 1) : 0

  const waterOffset = innerCirc * (1 - waterPct)
  const fertOffset = outerCirc * (1 - fertPct)

  const label = `${Math.round(waterPct * 100)}% watered, ${Math.round(
    fertPct * 100
  )}% fertilized`

  const center = size / 2
  const rotate = `rotate(-90 ${center} ${center})`

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
    >
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={outerCirc}
        strokeDashoffset={fertOffset}
        className="text-green-500 transition-[stroke-dashoffset] duration-300"
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
        strokeDashoffset={waterOffset}
        className="text-blue-500 transition-[stroke-dashoffset] duration-300"
        transform={rotate}
      />
    </svg>
  )
}
