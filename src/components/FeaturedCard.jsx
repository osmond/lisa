import { Link } from 'react-router-dom'

export default function FeaturedCard({ task }) {
  if (!task) return null
  return (
    <Link
      to={`/plant/${task.plantId}`}
      data-testid="featured-card"
      className="block overflow-hidden rounded-2xl shadow bg-sage dark:bg-gray-800"
    >
      <img
        src={task.image}
        alt={task.plantName}
        className="w-full h-56 object-cover"
      />
      <div className="p-4 space-y-1">
        <h2 className="font-display text-2xl font-semibold">{task.plantName}</h2>
        <p className="text-sm text-gray-500">
          {task.type} today{task.reason ? ` — ${task.reason}` : ''}
        </p>
      </div>
    </Link>
  )
}
