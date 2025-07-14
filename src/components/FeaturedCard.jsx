import { Link } from 'react-router-dom'

export default function FeaturedCard({ task }) {
  if (!task) return null
  return (
    <Link
      to={`/plant/${task.plantId}`}
      data-testid="featured-card"
      className="relative block overflow-hidden rounded-2xl shadow bg-sage dark:bg-gray-800"
    >
      <img
        src={task.image}
        alt={task.plantName}
        className="w-full h-64 object-cover"
      />
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent text-white space-y-1 backdrop-blur-sm">
        <span className="text-xs uppercase tracking-wide opacity-90">🪴 Plant of the Day</span>
        <h2 className="font-display text-2xl font-semibold">{task.plantName}</h2>
        <p className="text-sm opacity-90">
          {task.type} today{task.reason ? ` — ${task.reason}` : ''}
        </p>
      </div>
    </Link>
  )
}
