import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from './ActionIcons.jsx'
import useRipple from '../utils/useRipple.js'

export default function TaskCard({ task, onComplete }) {
  const { markWatered } = usePlants()
  const Icon = actionIcons[task.type]
  const [checked, setChecked] = useState(false)
  const timeoutRef = useRef(null)
  const [, createRipple] = useRipple()

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task)
    } else if (task.type === 'Water') {
      const note = window.prompt('Optional note') || ''
      markWatered(task.plantId, note)
    }
    setChecked(true)
    timeoutRef.current = setTimeout(() => setChecked(false), 400)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className="relative flex items-center gap-3 p-4 rounded-2xl shadow-sm bg-white dark:bg-gray-800 overflow-hidden transition-shadow hover:shadow-md active:shadow-lg"
      onMouseDown={createRipple}
      onTouchStart={createRipple}
    >
      <Link to={`/plant/${task.plantId}`} className="flex items-center flex-1 gap-3">
        <img src={task.image} alt={task.plantName} className="w-12 h-12 object-cover rounded" />
        <div className="flex-1">
          <p className="font-medium flex items-center gap-1">
            {Icon && <Icon />}
            <span>{task.type} {task.plantName}</span>
          </p>
          {task.reason && (
            <p className="text-xs text-gray-500">{task.reason}</p>
          )}
        </div>
      </Link>
      <button
        onMouseDown={createRipple}
        onTouchStart={createRipple}
        onClick={handleComplete}
        className={`ml-2 bg-green-100 text-green-700 px-3 py-1 rounded relative overflow-hidden transition active:shadow-inner ${checked ? 'bounce-once' : ''}`}
        aria-label="Mark complete"
      >
        <input type="checkbox" checked={checked} readOnly className="task-checkbox" />
      </button>
      {checked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="w-8 h-8 text-green-600 check-pop"
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
