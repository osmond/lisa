import { Link } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from './ActionIcons.jsx'


export default function TaskItem({ task, onComplete }) {
  const { markWatered } = usePlants()
  const Icon = actionIcons[task.type]

  const handleComplete = e => {
    e.preventDefault()
    e.stopPropagation()
    if (onComplete) {
      onComplete(task)
    } else if (task.type === 'Water') {
      const note = window.prompt('Optional note') || ''
      markWatered(task.plantId, note)
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
      <Link to={`/plant/${task.plantId}`} className="flex items-center flex-1 gap-2">
        <img
          src={task.image}
          alt={task.plantName}
          className="w-12 h-12 object-cover rounded"
        />
        <div className="flex-1">
          <p className="font-medium">
            {task.type} {task.plantName}
          </p>
          {task.reason && (
            <p className="text-xs text-gray-500">{task.reason}</p>
          )}
        </div>
        {Icon && <Icon />}
      </Link>
      <button
        onClick={handleComplete}
        className="ml-2 px-3 py-1 bg-green-100 text-green-700 rounded text-sm"
      >
        Done
      </button>
    </div>
  )
}
