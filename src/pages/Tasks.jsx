import { useMemo, useState } from 'react'
import { usePlants } from '../PlantContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'
import TaskCard from '../components/TaskCard.jsx'

export default function Tasks() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()
  const weather = { rainTomorrow: weatherCtx?.forecast?.rainfall || 0 }
  const timezone = weatherCtx?.timezone

  const [urgencyFilter, setUrgencyFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  const tasks = useMemo(() => {
    const all = []
    plants.forEach(p => {
      if (p.lastWatered) {
        const { date, reason } = getNextWateringDate(p.lastWatered, weather)
        all.push({
          id: `w-${p.id}`,
          plantId: p.id,
          plantName: p.name,
          image: p.image,
          date,
          type: 'Water',
          reason,
          urgency: p.urgency,
          plantType: p.type,
        })
      }
      if (p.nextFertilize) {
        all.push({
          id: `f-${p.id}`,
          plantId: p.id,
          plantName: p.name,
          image: p.image,
          date: p.nextFertilize,
          type: 'Fertilize',
          urgency: p.urgency,
          plantType: p.type,
        })
      }
    })
    return all.sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [plants, weather])

  const filtered = tasks.filter(
    t =>
      (urgencyFilter === 'All' || t.urgency === urgencyFilter) &&
      (typeFilter === 'All' || t.plantType === typeFilter)
  )

  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: timezone })
  )
  const todayIso = now.toISOString().slice(0, 10)

  const overdue = filtered.filter(t => t.date < todayIso)
  const today = filtered.filter(t => t.date === todayIso)
  const upcoming = filtered.filter(t => t.date > todayIso)

  const urgencies = useMemo(
    () => [...new Set(plants.map(p => p.urgency).filter(Boolean))],
    [plants]
  )
  const types = useMemo(
    () => [...new Set(plants.map(p => p.type).filter(Boolean))],
    [plants]
  )

  return (
    <div className="overflow-y-auto max-h-full p-4 space-y-6">
      <div className="flex flex-wrap gap-2">
        <select
          className="border rounded p-1"
          value={urgencyFilter}
          onChange={e => setUrgencyFilter(e.target.value)}
        >
          <option value="All">All Urgencies</option>
          {urgencies.map(u => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <select
          className="border rounded p-1"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          {types.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-700">No tasks remaining</p>
      ) : (
        <>
      {overdue.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">Needs attention</h2>
          <div className="space-y-4">
            {overdue.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {today.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">Today</h2>
          <div className="space-y-4">
            {today.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">Upcoming</h2>
          <div className="space-y-4">
            {upcoming.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}
        </>
      )}
    </div>
  )
}
