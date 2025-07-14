import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from './ActionIcons.jsx'
import useRipple from '../utils/useRipple.js'
import { relativeDate } from '../utils/relativeDate.js'
import { useWeather } from '../WeatherContext.jsx'

export default function TaskCard({ task, onComplete }) {
  const { markWatered } = usePlants()
  const Icon = actionIcons[task.type]
  const [checked, setChecked] = useState(false)
  const [, createRipple] = useRipple()
  const { timezone } = useWeather() || {}
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: tz })
  )

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

  const pillColors = {
    Water: 'bg-blue-100 text-blue-700',
    Fertilize: 'bg-orange-100 text-orange-700',
  }
  const pillClass = pillColors[task.type] || 'bg-green-100 text-green-700'

  return (
    <div
      className="relative flex items-center gap-3 p-5 rounded-2xl shadow-sm bg-white dark:bg-gray-800 overflow-hidden"
      onMouseDown={createRipple}
      onTouchStart={createRipple}
    >
      <Link to={`/plant/${task.plantId}`} className="flex items-center flex-1 gap-3">
        <img src={task.image} alt={task.plantName} className="w-16 h-16 object-cover rounded" />
        <div className="flex-1">
          <p className="font-medium">{task.type} {task.plantName}</p>
          {task.date && (
            <p
              className={`text-xs ${
                (() => {
                  const d = Math.round(
                    (new Date(task.date) - now) / (1000 * 60 * 60 * 24)
                  )
                  return d < 0
                    ? 'text-red-600'
                    : d <= 2
                    ? 'text-orange-600'
                    : 'text-green-600'
                })()
              }`}
            >
              {relativeDate(task.date, now, tz)}
            </p>
          )}
          {task.reason && (
            <p className="text-xs text-gray-500">{task.reason}</p>
          )}
        </div>
        {Icon && <Icon />}
      </Link>
      <button
        onMouseDown={createRipple}
        onTouchStart={createRipple}
        onClick={handleComplete}
        className={`ml-2 px-3 py-1 rounded relative overflow-hidden ${pillClass}`}
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
