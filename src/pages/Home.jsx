import TaskCard from '../components/TaskCard.jsx'
import { usePlants } from '../PlantContext.jsx'
import WaterProgress from '../components/WaterProgress.jsx'

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


import SummaryStrip from '../components/SummaryStrip.jsx'
import FeaturedCard from '../components/FeaturedCard.jsx'



export default function Home() {
  const { plants } = usePlants()
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
  const waterPercent = totalWaterToday
    ? Math.round((wateredTodayCount / totalWaterToday) * 100)
    : 0

  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  )
  const featuredIndex = plants.length ? dayOfYear % plants.length : 0

  const weekday = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
  })
  const monthDay = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  })


  return (
    <div className="space-y-6">
      <header className="flex flex-col items-start space-y-2">
        <h1 className="font-headline border-b border-gray-100 pb-1">
          <span className="flex items-center space-x-1 text-3xl font-bold">
            <span className="text-xl">☀️</span>
            <span className="tracking-tight">{weekday}</span>
          </span>
          <div className="text-xl tracking-tight">{monthDay}</div>
        </h1>
        <p className="text-sm text-gray-500 font-body flex items-center gap-1">
          {forecast ? (
            <>
              {(() => {
                const Icon = weatherIcons[forecast.condition] || Sun
                return (
                  <Icon className="w-4 h-4 text-gray-400" aria-label={forecast.condition} />
                )
              })()}
              <span>{forecast.temp}, {forecast.condition}</span>
            </>
          ) : (
            'Loading...'
          )}
        </p>
        <p className="text-sm text-gray-500 font-body mt-2">Hi Jon 🌿 Let’s check on your plants.</p>
      </header>
    {plants.length > 0 && (
      <FeaturedCard plants={plants} startIndex={featuredIndex} />
    )}
    <SummaryStrip total={totalCount} watered={waterCount} fertilized={fertilizeCount} />
      {totalWaterToday > 0 && (
        <div data-testid="water-progress" className="space-y-1 px-1">
          <p className="text-sm">💧 {wateredTodayCount} of {totalWaterToday} watered</p>
          <WaterProgress completed={wateredTodayCount} total={totalWaterToday} />
        </div>
      )}
      <section className="space-y-4">
        <h2 className="font-semibold font-headline">Today’s Tasks</h2>
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map(task => <TaskCard key={task.id} task={task} />)
          ) : (
            <p className="text-sm text-gray-500">All plants are happy today!</p>
          )}
        </div>
      </section>
    </div>
  )
}
