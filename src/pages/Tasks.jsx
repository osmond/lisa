import { useMemo } from 'react'
import { usePlants } from '../PlantContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'
import { relativeDate } from '../utils/relativeDate.js'

export default function Tasks() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()
  const weather = { rainTomorrow: weatherCtx?.forecast?.rainfall || 0 }
  const timezone = weatherCtx?.timezone

  const events = useMemo(() => {
    const all = []
    plants.forEach(p => {
      if (p.lastWatered) {
        const { date, reason } = getNextWateringDate(p.lastWatered, weather)
        all.push({
          date,
          label: `Water ${p.name}`,
          type: 'task',
          taskType: 'water',
          plantId: p.id,
          reason,
        })
      }
      if (p.nextFertilize) {
        all.push({
          date: p.nextFertilize,
          label: `Fertilize ${p.name}`,
          type: 'task',
          taskType: 'fertilize',
        })
      }
      ;(p.activity || []).forEach(a => {
        const m = a.match(/(\d{4}-\d{2}-\d{2})/)
        if (m) {
          all.push({ date: m[1], label: `${p.name}: ${a}`, type: 'past' })
        }
      })
    })
    return all.sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [plants, weather])

  const colors = {
    water: 'bg-blue-500',
    fertilize: 'bg-orange-500',
  }
  return (
    <div className="overflow-y-auto max-h-full p-4">
      <ul className="relative border-l border-gray-300 pl-4 space-y-6">
        {events.map((e, i) => {
          const now = new Date(
            new Date().toLocaleString('en-US', { timeZone: timezone })
          )
          const diff = Math.round(
            (new Date(e.date) - now) / (1000 * 60 * 60 * 24)
          )
          const overdue = e.type === 'task' && diff < 0
          const dueSoon = e.type === 'task' && diff >= 0 && diff <= 2
          const baseColor = colors[e.taskType] || 'bg-green-500'
          const dotColor = overdue
            ? 'bg-red-500 animate-pulse'
            : dueSoon
            ? 'bg-orange-500'
            : baseColor
          const textColor = overdue
            ? 'text-red-600 font-medium'
            : dueSoon
            ? 'text-orange-600 font-medium'
            : 'text-green-600'
          return (
            <li key={i} className="relative animate-fade-in-up">
              <span
                className={`absolute -left-2 top-1 w-3 h-3 rounded-full ${dotColor}`}
              ></span>
              <p className={`text-xs ${textColor}`}>{relativeDate(e.date, now, timezone)}</p>
              <p className={textColor}>{e.label}</p>
              {e.reason && (
                <p className="text-xs text-gray-500">{e.reason}</p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
