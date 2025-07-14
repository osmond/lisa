import TaskCard from '../components/TaskCard.jsx'
import { usePlants } from '../PlantContext.jsx'

import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'

import { CloudSun } from 'phosphor-react'

import SummaryStrip from '../components/SummaryStrip.jsx'



export default function Home() {
  const { plants } = usePlants()
  const username = 'Kay'
  const weatherCtx = useWeather()
  const forecast = weatherCtx?.forecast
  const weatherData = { rainTomorrow: forecast?.rainfall || 0 }

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

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })


  return (
    <div className="space-y-4">
      <header className="flex flex-col items-start space-y-1">
        <h1 className="text-2xl font-bold font-display">{today}</h1>
        <p className="flex items-center text-sm text-gray-600">
          <CloudSun className="w-5 h-5 mr-1 text-green-600" />
          {forecast ? `${forecast.temp} - ${forecast.condition}` : 'Loading...'}
        </p>
        <p className="font-display">Hi, {username}. Let’s check on your plants 🌱</p>
      </header>
      <SummaryStrip total={totalCount} watered={waterCount} fertilized={fertilizeCount} />
      <section>
        <h2 className="font-semibold font-display mb-2">Today’s Tasks</h2>
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
