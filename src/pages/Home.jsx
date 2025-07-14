import TaskCard from '../components/TaskCard.jsx'
import { useState, useEffect } from 'react'
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
  list.slice().forEach(t => handleTaskComplete(t))
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
      <header className="flex flex-col items-start space-y-1">

        <h1 className="text-2xl font-bold font-display flex items-center">
          {greeting}
          <GreetingIcon
            data-testid="greeting-icon"
            className="w-5 h-5 ml-2 animate-fade-in-up"
          />
        </h1>

        <p className="flex items-center text-sm text-gray-600">
          <CloudSun className="w-5 h-5 mr-1 text-green-600" />
          {forecast ? `${forecast.temp} - ${forecast.condition}` : 'Loading...'}
          {showRainSuggestion && (
            <span className="ml-2" aria-label="rain forecasted">
              💧Skip watering if it rains tomorrow
            </span>
          )}
        </p>
        <p className="text-sm text-gray-500">{today}</p>
      </header>

      <div className="flex justify-center space-x-3 overflow-x-auto py-2">
        {plants.map(p => (
          <img
            key={p.id}
            src={p.image}
            alt={p.name}
            className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
          />
        ))}
      </div>

      <PlantSpotlightCard plant={spotlightPlant} nextPlant={nextPlant} onSkip={handleSkip} />

      <SummaryStrip total={totalCount} watered={waterCount} fertilized={fertilizeCount} />
      <div className="flex justify-center">
        <ProgressRing completed={completedCount} total={totalCount} />
      </div>
      <section>
        <h2 className="font-semibold font-display text-subhead mb-2">Watering</h2>
        <div className="space-y-4 divide-y divide-gray-200 p-4 shadow-sm bg-stone rounded-xl">
          {waterTasks.length > 0 ? (
            <>
              {waterTasks.length > 1 && (
                <button type="button" onClick={() => handleCompleteAll('Water')} className="text-xs text-green-700 underline">
                  Complete All
                </button>
              )}
              {waterTasks.map(task => (
                <TaskCard key={task.id} task={task} onComplete={handleTaskComplete} />
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-500">No watering needed</p>
          )}
        </div>
      </section>
      <section>
        <h2 className="font-semibold font-display text-subhead mb-2 mt-4">Fertilizing</h2>
        <div className="space-y-4 divide-y divide-gray-200 p-4 shadow-sm bg-stone rounded-xl">
          {fertilizeTasks.length > 0 ? (
            <>
              {fertilizeTasks.length > 1 && (
                <button type="button" onClick={() => handleCompleteAll('Fertilize')} className="text-xs text-green-700 underline">
                  Complete All
                </button>
              )}
              {fertilizeTasks.map(task => (
                <TaskCard key={task.id} task={task} onComplete={handleTaskComplete} />
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
