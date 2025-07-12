import TaskItem from '../components/TaskItem'
import { usePlants } from '../PlantContext.jsx'

export default function Home() {
  const { plants } = usePlants()

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  // placeholder weather data
  const weather = { temp: '72°F', condition: 'Sunny' }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{today}</h1>
          <p className="text-sm text-gray-600">
            {weather.temp} - {weather.condition}
          </p>
        </div>
      </header>
      <section>
        <h2 className="font-semibold mb-2">Today’s Tasks</h2>
        <div className="space-y-2">
          {plants.map(p => (
            <TaskItem
              key={p.id}
              task={{
                id: p.id,
                plantId: p.id,
                plantName: p.name,
                image: p.image,
                type: 'Water',
              }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
