import { usePlants } from '../PlantContext.jsx'
import { useState } from 'react'

import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'
import { useUser } from '../UserContext.jsx'

import { CloudSun } from 'phosphor-react'

import SummaryStrip from '../components/SummaryStrip.jsx'



export default function Home() {
  const { plants } = usePlants()
  const [completedIds, setCompletedIds] = useState([])
  const { username } = useUser()
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
          nickname: p.nickname,
          light: p.light,
          difficulty: p.difficulty,
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
          nickname: p.nickname,
          light: p.light,
          difficulty: p.difficulty,
          image: p.image,
          type: 'Fertilize',
        })
      }
  })
  const tasks = [...waterTasks, ...fertilizeTasks]
  const grouped = tasks.reduce((acc, t) => {
    acc[t.type] = acc[t.type] || []
    acc[t.type].push(t)
    return acc
  }, {})
  const groups = Object.entries(grouped)
  const totalCount = tasks.length
  const completedCount = completedIds.length

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })


  return (
    <div className="space-y-4">
      <header className="flex flex-col items-start space-y-1">
        <h1 className="text-2xl font-bold font-display">{today}</h1>
        <p className="flex items-center text-sm italic text-gray-500">
          <CloudSun aria-hidden="true" className="w-5 h-5 mr-1 text-green-600" />
          {forecast
            ? `${forecast.temp} and ${forecast.condition?.toLowerCase()} — great day to water!`
            : 'Loading...'}
        </p>
        <p className="font-display">Hi, {username}. Let’s check on your plants 🌱</p>
      </header>
      <SummaryStrip completed={completedCount} total={totalCount} />
      <section>
        <h2 className="font-semibold font-display mb-2">Today’s Tasks</h2>
        <div className="space-y-2">
          {groups.length > 0 ? (
            <ul className="space-y-1">
              {groups.map(([type, list]) => {
                const emojis = { Water: '💧', Fertilize: '🌱' }
                return (
                  <li key={type} className="animate-fade-in-up">
                    {emojis[type] || ''} {type} Today –{' '}
                    {list.map(t => t.plantName).join(', ')}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">All plants are happy today!</p>
          )}
        </div>
      </section>
    </div>
  )
}
