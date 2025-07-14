import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from './ActionIcons.jsx'
import useRipple from '../utils/useRipple.js'

export default function HeroTaskCard({ task, onComplete }) {
  const { markWatered } = usePlants()
  const Icon = actionIcons[task.type]
  const [checked, setChecked] = useState(false)
  const [, createRipple] = useRipple()

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task)
    } else if (task.type === 'Water') {
      const note = window.prompt('Optional note') || ''
      markWatered(task.plantId, note)
    }
    setChecked(true)
    setTimeout(() => setChecked(false), 400)
  }

  return (
    <div
      className="relative p-4 rounded-3xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden flex flex-col gap-3"
      onMouseDown={createRipple}
      onTouchStart={createRipple}
    >
      <Link to={`/plant/${task.plantId}`} className="flex flex-col items-center gap-2 text-center flex-1">
        <img
          src={task.image}
          alt={task.plantName}
          className="w-full h-48 object-cover rounded-xl"
        />
        <div>
          <p className="font-medium text-lg">
            {task.type} {task.plantName}
          </p>
          {task.reason && (
            <p className="text-sm text-gray-500">{task.reason}</p>
          )}
        </div>
        {Icon && <Icon />}
      </Link>
      <button
        onMouseDown={createRipple}
        onTouchStart={createRipple}
        onClick={handleComplete}
        className="self-center bg-green-100 text-green-700 px-4 py-1 rounded relative overflow-hidden mt-1"
        aria-label="Mark complete"
      >
        <input type="checkbox" checked={checked} readOnly className="task-checkbox" />
      </button>
      {checked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="w-10 h-10 text-green-600 check-pop"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      )}
    </div>
  )
}
