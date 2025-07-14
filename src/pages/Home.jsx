import TaskCard from '../components/TaskCard.jsx'
import { useState, useEffect } from 'react'
import Button from "../components/Button.jsx"
import { usePlants } from '../PlantContext.jsx'

import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'

import { Sun, CloudSun, Moon } from 'phosphor-react'
import PlantSpotlightCard from '../components/PlantSpotlightCard.jsx'

import SummaryStrip from '../components/SummaryStrip.jsx'
import ProgressRing from '../components/ProgressRing.jsx'

export default function Home() {
  const { plants, markWatered } = usePlants()
  const weatherCtx = useWeather()
  const forecast = weatherCtx?.forecast
  const weatherError = weatherCtx?.error
  const timezone = weatherCtx?.timezone || 'UTC'
  const weatherData = { rainTomorrow: forecast?.rainfall || 0 }

  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: timezone })
  )
  const hour = now.getHours()
  let greeting = 'Good evening'
  let GreetingIcon = Moon
  if (hour < 12) {
    greeting = 'Good morning'
    GreetingIcon = Sun
  } else if (hour < 18) {
    greeting = 'Good afternoon'
    GreetingIcon = CloudSun
  }

  const todayIso = now.toISOString().slice(0, 10)
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
        date,
      })
    }
    if (p.nextFertilize && p.nextFertilize <= todayIso) {
      fertilizeTasks.push({
        id: `f-${p.id}`,
        plantId: p.id,
        plantName: p.name,
        image: p.image,
        type: 'Fertilize',
        date: p.nextFertilize,
      })
    }
  })
  const tasks = [...waterTasks, ...fertilizeTasks]
  const waterCount = waterTasks.length
  const fertilizeCount = fertilizeTasks.length

  const [completedCount, setCompletedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(waterCount + fertilizeCount)

  const showRainSuggestion =
    (forecast?.rainfall || 0) > 50 ||
    waterTasks.some(t => t.reason === 'rain expected tomorrow')

  useEffect(() => {
    setTotalCount(waterCount + fertilizeCount + completedCount)
  }, [waterCount, fertilizeCount, completedCount])

  const handleTaskComplete = task => {
    if (task.type === 'Water') {
      const note = window.prompt('Optional note') || ''
      markWatered(task.plantId, note)
    }
    setCompletedCount(c => c + 1)
  }

  const handleCompleteAll = type => {
    const list = type === 'Water' ? waterTasks : fertilizeTasks
    if (type === 'Water') {
      list.forEach(t => markWatered(t.plantId, ''))
    }
    setCompletedCount(c => c + list.length)
  }

  const [focusIndex, setFocusIndex] = useState(() =>
    plants.length > 0 ? now.getDate() % plants.length : 0
  )
  const spotlightPlant = plants[focusIndex]
  const nextPlant = plants.length > 1 ? plants[(focusIndex + 1) % plants.length] : null

  const handleSkip = () => {
    if (plants.length > 0) {
      setFocusIndex((focusIndex + 1) % plants.length)
    }
  }

  const today = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  })

  return (
    <div className="space-y-4">
      <header className="flex flex-col items-start space-y-3 py-4 px-4 bg-white rounded-xl">

        <h1 className="text-headline leading-heading tracking-heading font-bold font-display flex items-center">
          {greeting}
          <GreetingIcon
            data-testid="greeting-icon"
            className="w-5 h-5 ml-2 animate-fade-in-up"
          />
        </h1>

        <p className="flex items-center text-sm text-gray-600">

          <CloudSun className="w-5 h-5 mr-1 text-[var(--km-accent)]" />
          {forecast ? `${forecast.temp} - ${forecast.condition}` : 'Loading...'}

          {showRainSuggestion && (
            <span className="ml-2" aria-label="rain forecasted">
              💧Skip watering if it rains tomorrow
            </span>
          )}
        </p>
        <p className="text-subhead text-gray-500">{today}</p>
      </header>

      <PlantSpotlightCard plant={spotlightPlant} nextPlant={nextPlant} onSkip={handleSkip} />

      <SummaryStrip total={totalCount} watered={waterCount} fertilized={fertilizeCount} />
      <div className="flex justify-center">
        <ProgressRing completed={completedCount} total={totalCount} />
      </div>
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold font-display text-subhead leading-heading tracking-heading">Watering</h2>
          {waterTasks.length > 1 && (
            <Button
              type="button"
              onClick={() => handleCompleteAll('Water')}
              className="bg-[var(--km-accent)] text-white px-3 py-1"
              data-testid="complete-all-water"
            >
              Complete All
            </Button>
          )}
        </div>
        <div
          className="space-y-4 divide-y divide-gray-200 p-4 shadow-sm bg-stone rounded-xl"
          data-testid="water-list"
        >
          {waterTasks.length > 0 ? (
            <>
              {waterTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleTaskComplete}
                />
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-500">No watering needed</p>
          )}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between mb-2 mt-4">
          <h2 className="font-semibold font-display text-subhead leading-heading tracking-heading">Fertilizing</h2>
          {fertilizeTasks.length > 1 && (
            <Button
              type="button"
              onClick={() => handleCompleteAll('Fertilize')}
              className="bg-[var(--km-accent)] text-white px-3 py-1"
              data-testid="complete-all-fertilize"
            >
              Complete All
            </Button>
          )}
        </div>
        <div
          className="space-y-4 divide-y divide-gray-200 p-4 shadow-sm bg-stone rounded-xl"
          data-testid="fertilize-list"
        >
          {fertilizeTasks.length > 0 ? (
            <>
              {fertilizeTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleTaskComplete}
                />
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-500">No fertilizing needed</p>
          )}
        </div>
      </section>
    </div>
  )
}
