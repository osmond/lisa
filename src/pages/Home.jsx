import TaskItem from '../components/TaskItem'
import { usePlants } from '../PlantContext.jsx'

import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'


export default function Home() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()
  const forecast = weatherCtx?.forecast
  const weatherData = { rainTomorrow: forecast?.rainfall || 0 }

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })


  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{today}</h1>
          <p className="text-sm text-gray-600">
            {forecast
              ? `${forecast.temp} - ${forecast.condition}`
              : 'Loading...'}
          </p>
        </div>
      </header>
      <section>
        <h2 className="font-semibold mb-2">Today’s Tasks</h2>
        <div className="space-y-2">
          {plants
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
            .map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
        </div>
      </section>
    </div>
  )
}
