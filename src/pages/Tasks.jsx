import { useMemo } from 'react'
import { usePlants } from '../PlantContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'
import TaskCard from '../components/TaskCard.jsx'

export default function Tasks() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()
  const weather = { rainTomorrow: weatherCtx?.forecast?.rainfall || 0 }

  const todayIso = new Date().toISOString().slice(0, 10)

  const events = useMemo(() => {
    const all = []
    plants.forEach(p => {
      const plantUrgent = p.urgency === 'high'
      if (p.lastWatered) {
        const { date, reason } = getNextWateringDate(p.lastWatered, weather)
        all.push({
          date,
          label: `Water ${p.name}`,
          type: 'task',
          taskType: 'water',
          plantId: p.id,
          plantName: p.name,
          image: p.image,
          reason,
          urgent: plantUrgent || date === todayIso,
          overdue: date < todayIso,
        })
      }
      if (p.nextFertilize) {
        all.push({
          date: p.nextFertilize,
          label: `Fertilize ${p.name}`,
          type: 'task',
          taskType: 'fertilize',
          plantId: p.id,
          plantName: p.name,
          image: p.image,
          urgent: plantUrgent || p.nextFertilize === todayIso,
          overdue: p.nextFertilize < todayIso,
        })
      }
      ;(p.activity || []).forEach(a => {
        const m = a.match(/(\d{4}-\d{2}-\d{2})/)
        if (m) {
          all.push({
            date: m[1],
            label: `${p.name}: ${a}`,
            type: 'past',
            taskType: 'note',
            plantId: p.id,
            plantName: p.name,
            image: p.image,
            reason: `${p.name}: ${a}`,
          })
        }
      })
    })
    return all.sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [plants, weather, todayIso])

  const groupedEvents = useMemo(() => {
    const map = new Map()
    events.forEach(e => {
      if (!map.has(e.date)) map.set(e.date, [])
      map.get(e.date).push(e)
    })
    return Array.from(map.entries()).sort(
      (a, b) => new Date(a[0]) - new Date(b[0])
    )
  }, [events])

  const today = new Date().toISOString().slice(0, 10)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().slice(0, 10)

  return (
    <div className="overflow-y-auto max-h-full p-4">
      {groupedEvents.length === 0 ? (
        <p className="text-center text-gray-500">No tasks coming up.</p>
      ) : (
        groupedEvents.map(([dateKey, list]) => {
          const heading =
            dateKey === today
              ? 'Today'
              : dateKey === tomorrowStr
              ? 'Tomorrow'
              : dateKey < today
              ? `Past Due - ${dateKey}`
              : dateKey
          return (
            <div key={dateKey}>
              <h3 className="mt-4 text-sm font-semibold text-gray-500">{heading}</h3>
              <div className="space-y-4">
                {list.map((e, i) => {
                  const task = {
                    id: `${e.taskType}-${e.plantId}-${i}`,
                    plantId: e.plantId,
                    plantName: e.plantName,
                    image: e.image,
                    type:
                      e.taskType === 'water'
                        ? 'Water'
                        : e.taskType === 'fertilize'
                        ? 'Fertilize'
                        : 'Note',
                    reason: e.reason,
                  }
                  return (
                    <TaskCard
                      key={`${e.date}-${i}`}
                      task={task}
                      urgent={!!e.urgent}
                      overdue={!!e.overdue}
                    />
                  )
                })}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
