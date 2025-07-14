import TaskCard from '../components/TaskCard.jsx'
import { usePlants } from '../PlantContext.jsx'

import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'


import SummaryStrip from '../components/SummaryStrip.jsx'



export default function Home() {
  const { plants } = usePlants()
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

  const wateredTodayCount = plants.filter(p => p.lastWatered === todayIso).length
  const totalWaterToday = wateredTodayCount + waterTasks.length
  const waterPercent = totalWaterToday
    ? Math.round((wateredTodayCount / totalWaterToday) * 100)
    : 0

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })


  return (
    <div className="space-y-6">
      <header className="flex flex-col items-start space-y-2">
        <h1 className="text-3xl font-bold font-headline flex items-center space-x-1 border-b border-gray-100 pb-1">
          <span className="text-xl">☀️</span>
          <span>{today}</span>
        </h1>
        <p className="text-sm text-gray-500 font-body">
          {forecast
            ? `${forecast.temp} and ${(forecast.condition || '').toLowerCase()} — great day to water!`
            : 'Loading...'}
        </p>
        <p className="text-sm text-gray-600 font-body mt-2">Hi Jon 🌿 Let’s check on your plants.</p>
      </header>
      <SummaryStrip total={totalCount} watered={waterCount} fertilized={fertilizeCount} />
      {totalWaterToday > 0 && (

        <div data-testid="water-progress" className="space-y-1 px-1">
          <p className="text-sm">💧 {wateredTodayCount} of {totalWaterToday} watered</p>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">

            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${waterPercent}%` }}
            ></div>
          </div>
        </div>
      )}
      <section className="space-y-4">
        <h2 className="font-semibold font-display">Today’s Tasks</h2>
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
