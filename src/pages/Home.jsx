import TasksContainer from '../components/TasksContainer.jsx'
import { usePlants } from '../PlantContext.jsx'
import CareSummaryModal from '../components/CareSummaryModal.jsx'
import PageContainer from "../components/PageContainer.jsx"

import { useState, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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
  const [showFeatured, setShowFeatured] = useState(true)
  const firstGesture = useRef(false)
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


  const {
    taskGroups,
    waterTasks,
    fertilizeTasks,
    wateredTodayCount,
    fertilizedTodayCount,
    soonestPlant,
  } = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10)

    return plants.reduce(
      (acc, p) => {
        const { date: waterDate, reason } = getNextWateringDate(
          p.lastWatered,
          weatherData
        )
        const dueWater = waterDate <= todayIso
        const dueFertilize = p.nextFertilize && p.nextFertilize <= todayIso

        const urgent =
          p.urgency === 'high' ||
          (dueWater && waterDate === todayIso) ||
          (dueFertilize && p.nextFertilize === todayIso)
        const overdue =
          (dueWater && waterDate < todayIso) ||
          (dueFertilize && p.nextFertilize < todayIso)

        if (dueWater) {
          acc.waterTasks.push({
            id: `w-${p.id}`,
            plantId: p.id,
            plantName: p.name,
            image: p.image,
            room: p.room,
            type: 'Water',
            reason,
            lastWatered: p.lastWatered,
            urgent: urgent,
            date: waterDate,
            overdue: waterDate < todayIso,
          })
        }

        if (dueFertilize) {
          acc.fertilizeTasks.push({
            id: `f-${p.id}`,
            plantId: p.id,
            plantName: p.name,
            image: p.image,
            room: p.room,
            type: 'Fertilize',
            lastWatered: p.lastWatered,
            urgent: urgent,
            date: p.nextFertilize,
            overdue: p.nextFertilize < todayIso,
          })
        }

        if (dueWater || dueFertilize) {
          const lastCared = [p.lastWatered, p.lastFertilized]
            .filter(Boolean)
            .sort((a, b) => new Date(b) - new Date(a))[0]
          acc.taskGroups.push({
            plant: p,
            dueWater,
            dueFertilize,
            urgent,
            overdue,
            lastCared,
          })
        }

        if (p.lastWatered === todayIso) acc.wateredTodayCount++
        if (p.lastFertilized === todayIso) acc.fertilizedTodayCount++

        const nextDates = [p.nextWater, p.nextFertilize]
          .filter(Boolean)
          .map(d => new Date(d))
        if (nextDates.length) {
          const candidate = new Date(Math.min(...nextDates))
          if (!acc.soonestDate || candidate < acc.soonestDate) {
            acc.soonestDate = candidate
            acc.soonestPlant = p
          }
        }

        return acc
      },
      {
        taskGroups: [],
        waterTasks: [],
        fertilizeTasks: [],
        wateredTodayCount: 0,
        fertilizedTodayCount: 0,
        soonestPlant: null,
        soonestDate: null,
      }
    )
  }, [plants, weatherData])

  const tasks = [...waterTasks, ...fertilizeTasks].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  const visibleTasks =
    typeFilter === 'all'
      ? taskGroups
      : taskGroups.filter(g =>
          typeFilter === 'water' ? g.dueWater : g.dueFertilize
        )
  const totalCount = tasks.length
  const waterCount = waterTasks.length
  const fertilizeCount = fertilizeTasks.length

  const totalWaterToday = waterTasks.length + wateredTodayCount
  const totalFertilizeToday = fertilizeTasks.length + fertilizedTodayCount
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

  const handleFirstGesture = e => {
    if (firstGesture.current) return
    firstGesture.current = true
    if (!e.target.closest('[data-testid="featured-card"]')) {
      setShowFeatured(false)
    }
  }


  return (
    <PageContainer onPointerDown={handleFirstGesture}>
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
      <AnimatePresence initial={false}>
        {showFeatured && (
          <motion.section
            className="mb-4 space-y-2"
            initial={{ opacity: 1, height: 'auto' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <h2 className="sr-only">Featured Plant</h2>
            <FeaturedCard plants={plants} startIndex={featuredIndex} />
          </motion.section>
        )}
      </AnimatePresence>
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
      <TasksContainer visibleTasks={visibleTasks} happyPlant={happyPlant} />
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
