import UnifiedTaskCard from '../components/UnifiedTaskCard.jsx'
import BaseCard from '../components/BaseCard.jsx'
import { usePlants } from '../PlantContext.jsx'
import CareSummaryModal from '../components/CareSummaryModal.jsx'
import PageContainer from "../components/PageContainer.jsx"
import PageHeader from "../components/PageHeader.jsx"

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
import Card from '../components/Card.jsx'
import useHappyPlant from '../hooks/useHappyPlant.js'



export default function Home() {
  const { plants } = usePlants()
  const [showSummary, setShowSummary] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [showHeader, setShowHeader] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('hideHomeHeader') !== 'true'
    }
    return true
  })
  const happyPlant = useHappyPlant()


  const weatherCtx = useWeather()
  const forecast = weatherCtx?.forecast
  const { username, timeZone } = useUser()
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
        room: p.room,
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
        room: p.room,
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
  const taskGroups = plants
    .map(p => {
      const { date: waterDate } = getNextWateringDate(p.lastWatered, weatherData)
      const dueWater = waterDate <= todayIso
      const dueFertilize = p.nextFertilize && p.nextFertilize <= todayIso
      if (!dueWater && !dueFertilize) return null
      const urgent =
        p.urgency === 'high' ||
        (dueWater && waterDate === todayIso) ||
        (dueFertilize && p.nextFertilize === todayIso)
      const overdue =
        (dueWater && waterDate < todayIso) ||
        (dueFertilize && p.nextFertilize < todayIso)
      const lastCared = [p.lastWatered, p.lastFertilized]
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a))[0]
      return {
        plant: p,
        dueWater,
        dueFertilize,
        urgent,
        overdue,
        lastCared,
      }
    })
    .filter(Boolean)

  const visibleTasks =
    typeFilter === 'all'
      ? taskGroups
      : taskGroups.filter(g =>
          typeFilter === 'water' ? g.dueWater : g.dueFertilize
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
    timeZone,
  })
  const monthDay = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    timeZone,
  })

  const scrollToTasks = () =>
    document.getElementById('tasks-container')?.scrollIntoView({ behavior: 'smooth' })

  const handleTotalClick = () => {
    setTypeFilter('all')
    scrollToTasks()
  }

  const handleWaterClick = () => {
    setTypeFilter('water')
    scrollToTasks()
  }

  const handleFertClick = () => {
    setTypeFilter('fertilize')
    scrollToTasks()
  }


  return (
    <PageContainer>
      <PageHeader title="Home" />
      {showHeader && (
      <header className="relative flex flex-col items-start text-left space-y-1">
        <button
          type="button"
          aria-label="Dismiss header"
          onClick={() => {
            setShowHeader(false)
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('hideHomeHeader', 'true')
            }
          }}
          className="absolute top-0 right-0 text-gray-500"
        >
          &times;
        </button>
        <p className="text-base font-medium text-gray-600">Hi {username}, let’s check on your plants.</p>
        <p className="text-xs text-gray-500 font-body flex items-center gap-1">
          {forecast && (() => {
            const Icon = weatherIcons[forecast.condition] || Sun
            return (
              <Icon
                className="w-4 h-4 text-gray-500 align-middle"
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
      )}
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
      onTotalClick={handleTotalClick}
      onWaterClick={handleWaterClick}
      onFertClick={handleFertClick}
    />
      {showSummary && (
        <CareSummaryModal tasks={tasks} onClose={() => setShowSummary(false)} />
      )}
      <div
        data-testid="tasks-container"
        className="mt-4 border-t border-neutral-200 dark:border-gray-600 bg-sage dark:bg-gray-700 rounded-xl p-4"
      >
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold font-headline">Today’s Tasks</h2>
          </div>
          <div className="space-y-2">
            {visibleTasks.length > 0 ? (
              visibleTasks.map((group, i) => (
                <BaseCard
                  key={group.plant.id}
                  variant="task"
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <UnifiedTaskCard
                    plant={{
                      ...group.plant,
                      dueWater: group.dueWater,
                      dueFertilize: group.dueFertilize,
                      lastCared: group.lastCared,
                    }}
                    urgent={group.urgent}
                    overdue={group.overdue}
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
                <div className="flex gap-4 mt-2">
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
      <div className="mt-4">
        <Card className="p-0 text-center font-semibold">
          <Link to="/myplants" className="block px-4 py-2">
            All Plants
          </Link>
        </Card>
      </div>
    </PageContainer>
  )
}
