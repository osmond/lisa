import { Link } from 'react-router-dom'
import { Robot } from 'phosphor-react'

export default function CoachCard({ plantId }) {
  return (
    <div
      className="bg-white dark:bg-gray-700 rounded-2xl shadow p-4 space-y-2"
      data-testid="coach-card"
    >
      <Link
        to={`/plant/${plantId}/coach`}
        className="flex items-center gap-2 font-semibold"
      >
        <Robot className="w-5 h-5" aria-hidden="true" />
        Coach
      </Link>
    </div>
  )
}
