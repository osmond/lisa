import TaskCard from '../components/TaskCard.jsx'
import BaseCard from '../components/BaseCard.jsx'
import { usePlants } from '../PlantContext.jsx'
import CareSummaryModal from '../components/CareSummaryModal.jsx'

import { useState } from 'react'

import { Link } from 'react-router-dom'

import { useWeather } from '../WeatherContext.jsx'
import { useUser } from '../UserContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
} from 'phosphor-react'
import CareStats from '../components/CareStats.jsx'
import FeaturedCard from '../components/FeaturedCard.jsx'
import useHappyPlant from '../hooks/useHappyPlant.js'
import Badge from '../components/Badge.jsx'



export default function Home() {
  const { plants } = usePlants()
  const [showSummary, setShowSummary] = useState(false)
  const happyPlant = useHappyPlant()


  const weatherCtx = useWeather()
  const forecast = weatherCtx?.forecast
  const { username } = useUser()
  const weatherData = { rainTomorrow: forecast?.rainfall || 0 }

  const weatherIcons = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
    Drizzle: CloudRain,
    Thunderstorm: CloudLightning,
    Snow: CloudSnow,
    Mist: CloudFog,
    Fog: CloudFog,
  }


  const todayIso = new Date().toISOString().slice(0, 10)
  const waterTasks = []
  const fertilizeTasks = []
  plants.forEach(p => {
    const { date, reason } = getNextWateringDate(p.lastWatered, weatherData)
    const plantUrgent = p.urgency === 'high'
    if (date <= todayIso) {
      waterTasks.push({
        id: `w-${p.id}`,
        plantId: p.id,
        plantName: p.name,
        image: p.image,
        type: 'Water',
        reason,
        lastWatered: p.lastWatered,
        urgent: plantUrgent || date === todayIso,

        date,

        overdue: date < todayIso,

      })
    }
    if (p.nextFertilize && p.nextFertilize <= todayIso) {
      fertilizeTasks.push({
        id: `f-${p.id}`,
        plantId: p.id,
        plantName: p.name,
        image: p.image,
        type: 'Fertilize',
        lastWatered: p.lastWatered,
        urgent: plantUrgent || p.nextFertilize === todayIso,

        date: p.nextFertilize,

        overdue: p.nextFertilize < todayIso,

      })
    }
  })
  const tasks = [...waterTasks, ...fertilizeTasks].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )
  const tasksByPlant = tasks.reduce((acc, t) => {
    if (!acc[t.plantId]) acc[t.plantId] = []
    acc[t.plantId].push(t)
    return acc
  }, {})
  const groupedTasks = Object.entries(tasksByPlant)
    .map(([plantId, list]) => ({
      plant: plants.find(p => p.id === Number(plantId)),
      list: list.sort((a, b) => new Date(a.date) - new Date(b.date)),
    }))
    .sort((a, b) => new Date(a.list[0].date) - new Date(b.list[0].date))
  const totalCount = tasks.length
  const waterCount = waterTasks.length
  const fertilizeCount = fertilizeTasks.length

  const wateredTodayCount = plants.filter(p => p.lastWatered === todayIso).length
  const totalWaterToday = wateredTodayCount + waterTasks.length
  const fertilizedTodayCount = plants.filter(
    p => p.lastFertilized === todayIso
  ).length
  const totalFertilizeToday = fertilizeTasks.length + fertilizedTodayCount

  const soonestPlant = [...plants]
    .sort((a, b) => {
      const nextA = Math.min(
        new Date(a.nextWater),
        a.nextFertilize ? new Date(a.nextFertilize) : new Date('9999-12-31')
      )
      const nextB = Math.min(
        new Date(b.nextWater),
        b.nextFertilize ? new Date(b.nextFertilize) : new Date('9999-12-31')
      )
      return nextA - nextB
    })[0]
  const featuredIndex = soonestPlant
    ? plants.findIndex(p => p.id === soonestPlant.id)
    : 0

  const weekday = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
  })
  const monthDay = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  })


  return (
    <div className="space-y-8">
      <header className="flex flex-col items-start text-left space-y-1">
        <p className="text-base font-medium text-gray-600">Hi {username}, let’s check on your plants.</p>
        <p className="text-xs text-gray-400 font-body flex items-center gap-1">
          {forecast && (() => {
            const Icon = weatherIcons[forecast.condition] || Sun
            return (
              <Icon
                className="w-4 h-4 text-gray-400 align-middle"
                aria-label={forecast.condition}
              />
            )
          })()}
          {weekday}, {monthDay}
          {forecast && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-gray-600">{forecast.temp}</span>
            </>
          )}
        </p>
      </header>
    {plants.length > 0 && (
      <section className="mb-4">
        <h2 className="sr-only">Featured Plant</h2>
        <FeaturedCard plants={plants} startIndex={featuredIndex} />
      </section>
    )}
    <CareStats
      waterCompleted={wateredTodayCount}
      waterTotal={totalWaterToday}
      fertCompleted={fertilizedTodayCount}
      fertTotal={totalFertilizeToday}
    />
      {showSummary && (
        <CareSummaryModal tasks={tasks} onClose={() => setShowSummary(false)} />
      )}

      {tasks.length > 0 && (
        <hr className="my-4 border-t border-neutral-200 dark:border-gray-600" />
      )}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold font-headline">Today’s Tasks</h2>
        </div>
        <div className="space-y-4">
          {groupedTasks.length > 0 ? (
            groupedTasks.map(({ plant, list }) => (
              <div
                key={plant?.id ?? list[0].id}
                data-testid="plant-task-card"
                className="bg-white dark:bg-gray-700 rounded-2xl shadow"
              >
                <details>
                  <summary className="flex items-center justify-between gap-2 cursor-pointer list-none p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={plant?.image}
                        alt={plant?.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {plant?.name || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {list.map(t => (
                        <Badge
                          key={t.id}
                          colorClass={`text-sm font-medium ${
                            t.type === 'Water'
                              ? 'bg-water-100 text-water-800'
                              : t.type === 'Fertilize'
                              ? 'bg-fertilize-100 text-fertilize-800'
                              : 'bg-healthy-100 text-healthy-800'
                          }`}
                        >
                          {t.type}
                        </Badge>
                      ))}
                    </div>
                  </summary>
                  <div className="mt-2 space-y-2 px-4 pb-4">
                    {list.map(t => (
                      <BaseCard key={t.id} variant="task">
                        <TaskCard
                          task={t}
                          urgent={t.urgent}
                          overdue={t.overdue}
                          compact
                        />
                      </BaseCard>
                    ))}
                  </div>
                </details>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 space-y-1 text-center flex flex-col items-center">
              <img
                src={happyPlant}
                alt="Happy plant"
                className="w-24 h-24 mb-2"
              />
              <p>All plants are happy today!</p>
              <p>Want to add a note or photo today?</p>
              <div className="flex gap-2 mt-2">
                <Link
                  to="/timeline"
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs"
                >
                  Add a journal entry
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs"
                >
                  Set a reminder
                </Link>

      <div
        data-testid="tasks-container"
        className="mt-4 border-t border-neutral-200 dark:border-gray-600 bg-sage dark:bg-gray-700 rounded-xl p-4"
      >
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold font-headline">Today’s Tasks</h2>
          </div>
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <BaseCard key={task.id} variant="task">
                  <TaskCard
                    task={task}
                    urgent={task.urgent}
                    overdue={task.overdue}
                    compact
                    swipeable={false}
                  />
                </BaseCard>
              ))
            ) : (
              <div className="text-sm text-gray-500 space-y-1 text-center flex flex-col items-center">
                <img
                  src={happyPlant}
                  alt="Happy plant"
                  className="w-24 h-24 mb-2"
                />
                <p>All plants are happy today!</p>
                <p>Want to add a note or photo today?</p>
                <div className="flex gap-2 mt-2">
                  <Link
                    to="/timeline"
                    className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs"
                  >
                    Add a journal entry
                  </Link>
                  <Link
                    to="/profile"
                    className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs"
                  >
                    Set a reminder
                  </Link>
                </div>

              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
