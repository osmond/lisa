import TaskCard from '../components/TaskCard.jsx'
import { usePlants } from '../PlantContext.jsx'

import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'

import { Sun, CloudSun, Moon } from 'phosphor-react'

import SummaryStrip from '../components/SummaryStrip.jsx'



export default function Home() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()
  const forecast = weatherCtx?.forecast
  const timezone = weatherCtx?.timezone
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
  const totalCount = tasks.length
  const waterCount = waterTasks.length
  const fertilizeCount = fertilizeTasks.length

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
        </p>
        <p className="text-sm text-gray-500">{today}</p>
      </header>
      <div className="flex space-x-3 overflow-x-auto py-2">
        {plants.map(p => (
          <img
            key={p.id}
            src={p.image}
            alt={p.name}
            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          />
        ))}
      </div>
      <SummaryStrip total={totalCount} watered={waterCount} fertilized={fertilizeCount} />
      <section>
        <h2 className="font-semibold font-display mb-2">Watering</h2>
        <div className="space-y-4">
          {waterTasks.length > 0 ? (
            waterTasks.map(task => <TaskCard key={task.id} task={task} />)
          ) : (
            <p className="text-sm text-gray-500">No watering needed</p>
          )}
        </div>
      </section>
      <section>
        <h2 className="font-semibold font-display mb-2 mt-4">Fertilizing</h2>
        <div className="space-y-4">
          {fertilizeTasks.length > 0 ? (
            fertilizeTasks.map(task => <TaskCard key={task.id} task={task} />)
          ) : (
            <p className="text-sm text-gray-500">No fertilizing needed</p>
          )}
        </div>
      </section>
    </div>
  )
}
