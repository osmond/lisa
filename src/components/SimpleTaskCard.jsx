import { Link } from 'react-router-dom'

export default function SimpleTaskCard({ plant, label }) {
  if (!plant) return null
  return (
    <Link
      to={`/plant/${plant.id}`}
      className="flex items-center gap-4 bg-white dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 rounded-xl px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
      data-testid="simple-task-card"
    >
      <img
        src={plant.image}
        alt={plant.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {plant.name}
        </h3>
        {label && <p className="text-xs text-gray-500">{label}</p>}
      </div>
    </Link>
  )
}
