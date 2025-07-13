import TaskItem from '../components/TaskItem'
import { usePlants } from '../PlantContext.jsx'

import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'
import { CloudSun } from 'phosphor-react'


export default function Home() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()
  const forecast = weatherCtx?.forecast
  const weatherData = { rainTomorrow: forecast?.rainfall || 0 }

  const tasks = plants
    .map(p => {
      const { date, reason } = getNextWateringDate(p.lastWatered, weatherData)
      const todayIso = new Date().toISOString().slice(0, 10)
      if (date <= todayIso) {
        return {
          id: p.id,
          plantId: p.id,
          plantName: p.name,
          image: p.image,
          type: 'Water',
          reason,
        }
      }
      return null
    })
    .filter(Boolean)

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
      </header>
      <section>
        <h2 className="font-semibold font-display mb-2">Today’s Tasks</h2>
        <div className="space-y-2">
          {tasks.length > 0 ? (
            tasks.map(task => <TaskItem key={task.id} task={task} />)
          ) : (
            <p className="text-sm text-gray-500">All plants are happy today!</p>
          )}
        </div>
      </section>
    </div>
  )
}
