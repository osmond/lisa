import { useMemo, useState, useEffect } from 'react'
import { usePlants } from '../PlantContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'

import TaskCard from '../components/TaskCard.jsx'
import TaskTabs from '../components/TaskTabs.jsx'
import { ListBulletIcon, ViewGridIcon } from '@radix-ui/react-icons'



export default function Tasks() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()
  const weather = { rainTomorrow: weatherCtx?.forecast?.rainfall || 0 }
  const [viewMode, setViewMode] = useState('Upcoming')

  const [typeFilter, setTypeFilter] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('tasksTypeFilter') || 'All'
    }
    return 'All'
  })
  const [urgencyFilter, setUrgencyFilter] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('tasksUrgencyFilter') || 'All'
    }
    return 'All'
  })
  const [sortBy, setSortBy] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('tasksSortBy') || 'date'
    }
    return 'date'
  })
  const [layout, setLayout] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('tasksLayout') || 'list'
    }
    return 'list'
  })

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('tasksTypeFilter', typeFilter)
      localStorage.setItem('tasksUrgencyFilter', urgencyFilter)
      localStorage.setItem('tasksSortBy', sortBy)
      localStorage.setItem('tasksLayout', layout)
    }
  }, [typeFilter, urgencyFilter, sortBy, layout])

  const urgencies = [...new Set(plants.map(p => p.urgency).filter(Boolean))]

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

          plantUrgency: p.urgency,

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

          plantUrgency: p.urgency,

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

    const filtered = all.filter(e => {
      const typeMatch = typeFilter === 'All' || e.taskType === typeFilter
      const urgMatch =
        urgencyFilter === 'All' || e.plantUrgency === urgencyFilter
      return typeMatch && urgMatch
    })
    const sorted = [...filtered].sort((a, b) => {
      return sortBy === 'name'
        ? (a.plantName || '').localeCompare(b.plantName || '')
        : new Date(a.date) - new Date(b.date)
    })
    return sorted
  }, [plants, weather, todayIso, typeFilter, urgencyFilter, sortBy])



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

    const entries = Array.from(map.entries())
    if (sortBy === 'date') {
      return entries.sort((a, b) => new Date(a[0]) - new Date(b[0]))
    }
    return entries
  }, [events, sortBy])



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

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="border rounded p-1"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="water">Water</option>
          <option value="fertilize">Fertilize</option>
          <option value="note">Note</option>
        </select>
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
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="date">By Date</option>
          <option value="name">By Plant Name</option>
        </select>
        <button
          type="button"
          onClick={() => setLayout(prev => (prev === 'list' ? 'grid' : 'list'))}
          className="border rounded p-1 flex items-center"
          aria-label={`Switch to ${layout === 'list' ? 'grid' : 'list'} view`}
        >
          {layout === 'list' ? (
            <ViewGridIcon className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ListBulletIcon className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <TaskTabs value={viewMode} onChange={setViewMode} />
      {viewMode === 'By Plant' ? (
        eventsByPlant.length === 0 ? (
          <p className="text-center text-gray-500">No tasks coming up.</p>
        ) : (
          eventsByPlant.map(({ plant, list }) => (
            <div key={plant?.id ?? 'none'}>
              <h3 className="mt-4 text-sm font-semibold text-gray-500">
                {plant?.name || 'Unknown'}
              </h3>
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
              <div className={layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
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
