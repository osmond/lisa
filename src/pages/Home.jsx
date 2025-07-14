import TaskCard from '../components/TaskCard.jsx'
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
import happyPlant from '/happy-plant.svg'



export default function Home() {
  const { plants } = usePlants()
  const [showSummary, setShowSummary] = useState(false)
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
        urgent: plantUrgent || p.nextFertilize === todayIso,

        date: p.nextFertilize,

        overdue: p.nextFertilize < todayIso,

      })
    }
  })
  const tasks = [...waterTasks, ...fertilizeTasks].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )
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
      <section>
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
        <h2 className="font-semibold font-headline">Today’s Tasks</h2>
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                urgent={task.urgent}
                overdue={task.overdue}
              />
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
                  to="/gallery"
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs"
                >
                  View gallery
                </Link>
                <Link
                  to="/timeline"
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs"
                >
                  Add a journal entry
                </Link>
                <Link
                  to="/settings"
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
  )
}
