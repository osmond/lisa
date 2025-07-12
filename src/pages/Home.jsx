import TaskItem from '../components/TaskItem'
import tasks from '../tasks.json'

export default function Home() {
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
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </section>
    </div>
  )
}
