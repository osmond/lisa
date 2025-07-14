import React from 'react'

export default function CareGraph({ events = [] }) {
  if (!events.length) {
    return <p>No watering events</p>
  }
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
  const month = sorted[0].date.slice(0, 7)
  const [yearStr, monthStr] = month.split('-')
  const year = Number(yearStr)
  const monthNum = Number(monthStr) - 1
  const start = new Date(year, monthNum, 1)
  const daysInMonth = new Date(year, monthNum + 1, 0).getDate()
  const offset = start.getDay()
  const eventDays = new Set(sorted.map(e => Number(e.date.slice(8, 10))))
  const cells = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div role="grid" className="grid grid-cols-7 gap-1 text-center text-xs">
      {cells.map((day, i) => (
        <div
          key={i}
          role="gridcell"
          className={`w-6 h-6 flex items-center justify-center rounded ${
            day && eventDays.has(day) ? 'bg-blue-400 text-white' : 'bg-gray-100'
          }`}
        >
          {day || ''}
        </div>
      ))}
    </div>
  )
}
