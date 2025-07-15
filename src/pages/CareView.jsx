import { usePlants } from '../PlantContext.jsx'
import { useState } from 'react'
import { useWeather } from '../WeatherContext.jsx'
import TaskCard from '../components/TaskCard.jsx'
import { getNextWateringDate } from '../utils/watering.js'

export default function CareView() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()
  const [sort, setSort] = useState('urgent')
  const today = new Date().toISOString().slice(0, 10)

  const weather = { rainTomorrow: weatherCtx?.forecast?.rainfall || 0 }

  const tasks = []
  plants.forEach(p => {
    const imageSrc =
      typeof p.image === 'string' && p.image.trim() !== ''
        ? p.image
        : '/demo-image-01.jpg'

    if (p.lastWatered) {
      const { date, reason } = getNextWateringDate(p.lastWatered, weather)
      if (date <= today) {
        tasks.push({
          id: `water-${p.id}`,
          plantId: p.id,
          plantName: p.name,
          image: imageSrc,
          type: 'Water',
          reason,
          lastWatered: p.lastWatered,
          urgent: p.urgency === 'high' || date === today,
          overdue: date < today,
          completed: p.lastWatered === today,
        })
      }
    }
    if (p.nextFertilize && p.nextFertilize <= today) {
      tasks.push({
        id: `fertilize-${p.id}`,
        plantId: p.id,
        plantName: p.name,
        image: imageSrc,
        type: 'Fertilize',
        lastWatered: p.lastWatered,
        urgent: p.urgency === 'high' || p.nextFertilize === today,
        overdue: p.nextFertilize < today,
        completed: p.lastFertilized === today,
      })
    }
  })

  const sorted = [...tasks].sort((a, b) => {
    if (sort === 'urgent') {
      return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0)
    }
    return a.plantName.localeCompare(b.plantName)
  })

  if (sorted.length === 0) {
    return <p className="text-gray-700">All plants are happy today!</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-headline mb-4">Today’s Plants</h1>
      <div className="flex gap-2 mb-4">
        <select className="border rounded p-1" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="urgent">Most Urgent</option>
          <option value="name">A–Z</option>
        </select>
      </div>
      <div className="space-y-4">
        {sorted.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            urgent={task.urgent}
            overdue={task.overdue}
            completed={task.completed}
          />
        ))}
      </div>
    </div>
  )
}
