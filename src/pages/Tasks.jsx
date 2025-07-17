import { useMemo, useState, useEffect } from 'react'
import { usePlants } from '../PlantContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'

import TaskCard from '../components/TaskCard.jsx'
import UnifiedTaskCard from '../components/UnifiedTaskCard.jsx'
import BaseCard from '../components/BaseCard.jsx'
import TaskTabs from '../components/TaskTabs.jsx'
import CareRings from '../components/CareRings.jsx'
import { ListBullets, SquaresFour } from 'phosphor-react'
import useTaskLayout from '../hooks/useTaskLayout.js'



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
  const [layout, toggleLayout] = useTaskLayout()

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('tasksTypeFilter', typeFilter)
      localStorage.setItem('tasksUrgencyFilter', urgencyFilter)
      localStorage.setItem('tasksSortBy', sortBy)
    }
  }, [typeFilter, urgencyFilter, sortBy])

  const handleResetFilters = () => {
    setTypeFilter('All')
    setUrgencyFilter('All')
    setSortBy('date')
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('tasksTypeFilter')
      localStorage.removeItem('tasksUrgencyFilter')
      localStorage.removeItem('tasksSortBy')
    }
  }

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
          completed: p.lastWatered === todayIso,
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
          completed: p.lastFertilized === todayIso,
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

  const noUpcomingTasks = upcomingEvents.length === 0

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
  }, [events, sortBy, viewMode])

  const today = new Date().toISOString().slice(0, 10)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().slice(0, 10)

  const wateredTodayCount = plants.filter(p => p.lastWatered === todayIso).length
  const fertilizedTodayCount = plants.filter(
    p => p.lastFertilized === todayIso
  ).length
  const dueWaterCount = plants.filter(p => {
    const { date } = getNextWateringDate(p.lastWatered, weather)
    return date <= todayIso
  }).length
  const dueFertCount = plants.filter(
    p => p.nextFertilize && p.nextFertilize <= todayIso
  ).length
  const totalWaterToday = wateredTodayCount + dueWaterCount
  const totalFertilizeToday = fertilizedTodayCount + dueFertCount

  const handleWaterRingClick = () => setTypeFilter('water')
  const handleFertRingClick = () => setTypeFilter('fertilize')

  return (
    <div className="overflow-y-auto max-h-full p-4 pb-24">

      <div className="flex justify-center mb-4">
        <CareRings
          waterCompleted={wateredTodayCount}
          waterTotal={totalWaterToday}
          fertCompleted={fertilizedTodayCount}
          fertTotal={totalFertilizeToday}
          onWaterClick={handleWaterRingClick}
          onFertClick={handleFertRingClick}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <label className="flex items-center gap-1">
          <span>Filter by type</span>
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
        </label>
        <label className="flex items-center gap-1">
          <span>Filter by urgency</span>
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
        </label>
        <label className="flex items-center gap-1">
          <span>Sort by</span>
          <select
            className="border rounded p-1"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="date">By Date</option>
            <option value="name">By Plant Name</option>
          </select>
        </label>
        <button
          type="button"
          onClick={toggleLayout}
          className="border rounded p-1 flex items-center"
          aria-label={`Switch to ${layout === 'list' ? 'grid' : 'list'} view`}
        >
          {layout === 'list' ? (
            <SquaresFour className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ListBullets className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={handleResetFilters}
          className="border rounded p-1"
          aria-label="Reset filters"
        >
          Reset Filters
        </button>
      </div>

      <TaskTabs value={viewMode} onChange={setViewMode} />
      {viewMode === 'By Plant' ? (
        eventsByPlant.length === 0 ? (
          <p className="text-center text-gray-500">
            {noUpcomingTasks
              ? 'All caught up! Your plants are feeling great 🌞'
              : 'No tasks coming up.'}
          </p>
        ) : (
          <div className={layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
          {eventsByPlant.map(({ plant, list }, i) => {
            const dueWater = list.some(
              e =>
                e.taskType === 'water' &&
                !e.completed &&
                (e.overdue || e.date <= todayIso)
            )
            const dueFertilize = list.some(
              e =>
                e.taskType === 'fertilize' &&
                !e.completed &&
                (e.overdue || e.date <= todayIso)
            )
            const urgent = list.some(e => e.urgent)
            const overdue = list.some(e => e.overdue)
            const lastCared = [plant?.lastWatered, plant?.lastFertilized]
              .filter(Boolean)
              .sort((a, b) => new Date(b) - new Date(a))[0]
            return (
              <BaseCard
                key={plant?.id ?? 'none'}
                variant="task"
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <UnifiedTaskCard
                  plant={{
                    ...plant,
                    dueWater,
                    dueFertilize,
                    lastCared,
                  }}
                  urgent={urgent}
                  overdue={overdue}
                />
              </BaseCard>
            )
          })}
          </div>
        )
      ) : groupedEvents.length === 0 ? (
        <p className="text-center text-gray-500">
          {noUpcomingTasks
            ? 'All caught up! Your plants are feeling great 🌞'
            : 'No tasks coming up.'}
        </p>
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
                    completed: e.completed,
                  }
                  return (
                    <BaseCard
                      key={`${e.date}-${i}`}
                      variant="task"
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <TaskCard
                        task={task}
                        urgent={!!e.urgent}
                        overdue={!!e.overdue}
                        completed={e.completed}
                        compact={viewMode !== 'Past'}
                      />
                    </BaseCard>
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
