import { useMemo, useState } from 'react'
import { usePlants } from '../PlantContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'
import TaskTabs from '../components/TaskTabs.jsx'

export default function Tasks() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()
  const weather = { rainTomorrow: weatherCtx?.forecast?.rainfall || 0 }
  const [viewMode, setViewMode] = useState('Upcoming')

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

  const upcomingEvents = useMemo(
    () => events.filter(e => e.type === 'task'),
    [events]
  )

  const pastEvents = useMemo(
    () =>
      events
        .filter(e => e.type === 'past')
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [events]
  )

  const eventsByPlant = useMemo(() => {
    const map = new Map()
    events.forEach(e => {
      if (e.type !== 'task') return
      if (!map.has(e.plantId)) map.set(e.plantId, [])
      map.get(e.plantId).push(e)
    })
    return Array.from(map.entries()).map(([id, list]) => ({
      plant: plants.find(p => p.id === id),
      list: list.sort((a, b) => new Date(a.date) - new Date(b.date)),
    }))
  }, [events, plants])

  const groupedEvents = useMemo(() => {
    const source = viewMode === 'Past' ? pastEvents : upcomingEvents
    const map = new Map()
    source.forEach(e => {
      if (!map.has(e.date)) map.set(e.date, [])
      map.get(e.date).push(e)
    })
    return Array.from(map.entries()).sort(
      (a, b) => new Date(a[0]) - new Date(b[0])
    )
  }, [upcomingEvents, pastEvents, viewMode])

  const colors = {
    water: 'bg-blue-500',
    fertilize: 'bg-orange-500',
  }

  const statusClasses = {
    overdue: 'bg-red-100 text-red-600',
    today: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-green-100 text-green-700',
  }

  const today = new Date().toISOString().slice(0, 10)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().slice(0, 10)

  return (
    <div className="overflow-y-auto max-h-full p-4">
      <TaskTabs value={viewMode} onChange={setViewMode} />
      {viewMode === 'By Plant' ? (
        eventsByPlant.length === 0 ? (
          <p className="text-center text-gray-500">No tasks coming up.</p>
        ) : (
          eventsByPlant.map(({ plant, list }) => (
            <div key={plant?.id ?? 'none'}>
              <h3 className="mt-4 text-sm font-semibold text-gray-500">{plant?.name || 'Unknown'}</h3>
              <ul className="relative border-l border-gray-300 pl-4 space-y-6">
                {list.map((e, i) => {
                  const overdue = e.date < today
                  const color = colors[e.taskType] || 'bg-green-500'
                  return (
                    <li key={`${e.date}-${i}`} className="relative animate-fade-in-up">
                      <span
                        className={`absolute -left-2 top-1 w-3 h-3 rounded-full ${
                          overdue ? 'bg-red-500 animate-pulse' : color
                        }`}
                      ></span>
                      <p className="text-xs text-gray-500 font-body">{e.date}</p>
                      <p className={`font-medium font-body ${overdue ? 'text-red-600' : ''}`}>{e.label}</p>
                      {e.reason && (
                        <p className="text-xs text-gray-500 font-body">{e.reason}</p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))
        )
      ) : groupedEvents.length === 0 ? (
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
            <ul className="relative border-l border-gray-300 pl-4 space-y-6">
              {list.map((e, i) => {
                const overdue = e.type === 'task' && e.date < today
                const dueToday = e.type === 'task' && e.date === today
                const status = overdue
                  ? 'overdue'
                  : dueToday
                  ? 'today'
                  : e.type === 'task'
                  ? 'scheduled'
                  : null
                const color = colors[e.taskType] || 'bg-green-500'
                return (
                  <li key={`${e.date}-${i}`} className="relative animate-fade-in-up">
                    <span
                      className={`absolute -left-2 top-1 w-3 h-3 rounded-full ${
                        overdue ? 'bg-red-500 animate-pulse' : color
                      }`}
                    ></span>
                    <p className="text-xs text-gray-500 font-body">{e.date}</p>
                    <p className={`font-medium font-body ${overdue ? 'text-red-600' : ''}`}>{e.label}</p>
                    {status && (
                      <span
                        className={`ml-2 px-1.5 py-0.5 rounded text-xs font-body ${statusClasses[status]}`}
                      >
                        {status === 'today'
                          ? 'Due today'
                          : status === 'overdue'
                          ? 'Overdue'
                          : 'Scheduled'}
                      </span>
                    )}
                    {e.reason && (
                      <p className="text-xs text-gray-500 font-body">{e.reason}</p>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )

              : dateKey === tomorrowStr
              ? 'Tomorrow'
              : dateKey < today
              ? `Past Due - ${dateKey}`
              : dateKey
          return (
            <div key={dateKey}>
              <h3 className="mt-4 text-sm font-semibold text-gray-500">{heading}</h3>
              <ul className="relative border-l border-gray-300 pl-4 space-y-6">
                {list.map((e, i) => {
                  const overdue = e.type === 'task' && e.date < today
                  const color = colors[e.taskType] || 'bg-green-500'
                  return (
                    <li key={`${e.date}-${i}`} className="relative animate-fade-in-up">
                      <span
                        className={`absolute -left-2 top-1 w-3 h-3 rounded-full ${
                          overdue ? 'bg-red-500 animate-pulse' : color
                        }`}
                      ></span>
                      <p className="text-xs text-gray-500 font-body">{e.date}</p>
                      <p className={`font-medium font-body ${overdue ? 'text-red-600' : ''}`}>{e.label}</p>
                      {e.reason && (
                        <p className="text-xs text-gray-500 font-body">{e.reason}</p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )

        })
      )}
    </div>
  )
}
