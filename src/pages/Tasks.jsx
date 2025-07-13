import { useMemo } from 'react'
import { usePlants } from '../PlantContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'

export default function Tasks() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()
  const weather = { rainTomorrow: weatherCtx?.forecast?.rainfall || 0 }

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

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="overflow-y-auto max-h-full p-4">
      <ul className="relative border-l border-gray-300 pl-4 space-y-6">
        {events.map((e, i) => {
          const overdue = e.type === 'task' && e.date < today
          const color = colors[e.taskType] || 'bg-green-500'
          return (
            <li key={i} className="relative animate-fade-in-up">
              <span
                className={`absolute -left-2 top-1 w-3 h-3 rounded-full ${
                  overdue ? 'bg-red-500 animate-pulse' : color
                }`}
              ></span>
              <p className="text-xs text-gray-500">{e.date}</p>
              <p className={overdue ? 'text-red-600 font-medium' : ''}>{e.label}</p>
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
