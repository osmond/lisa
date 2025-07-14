import TaskCard from '../components/TaskCard.jsx'
import { usePlants } from '../PlantContext.jsx'
import CareSummaryModal from '../components/CareSummaryModal.jsx'
import { useState } from 'react'

import { useWeather } from '../WeatherContext.jsx'
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



export default function Home() {
  const { plants } = usePlants()
  const [showSummary, setShowSummary] = useState(false)
  const weatherCtx = useWeather()
  const forecast = weatherCtx?.forecast
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
    if (date <= todayIso) {
      waterTasks.push({
        id: `w-${p.id}`,
        plantId: p.id,
        plantName: p.name,
        image: p.image,
        type: 'Water',
        reason,
      })
    }
    if (p.nextFertilize && p.nextFertilize <= todayIso) {
      fertilizeTasks.push({
        id: `f-${p.id}`,
        plantId: p.id,
        plantName: p.name,
        image: p.image,
        type: 'Fertilize',
      })
    }
  })
  const tasks = [...waterTasks, ...fertilizeTasks]
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
      <header className="flex flex-col items-center text-center space-y-2">
        <p className="text-xs text-gray-400 font-body flex items-center justify-center gap-1">
          {weekday}, {monthDay}
          {forecast && (
            <>
              <span aria-hidden="true">·</span>
              <span>{forecast.temp}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                {(() => {
                  const Icon = weatherIcons[forecast.condition] || Sun
                  return (
                    <Icon className="w-4 h-4 text-gray-400" aria-label={forecast.condition} />
                  )
                })()}
                {forecast.condition}
              </span>
            </>
          )}
        </p>
        <p className="text-lg font-semibold">Hi Jon, Let’s check on your plants.</p>
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
      <section className="space-y-4">
        <h2 className="font-semibold font-headline">Today’s Tasks</h2>
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map(task => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="text-sm text-gray-500 space-y-1 text-center">
              <p>
                <span role="img" aria-label="Happy plant">🪴</span> All plants are
                happy today!
              </p>
              <p>Want to add a note or photo today?</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
