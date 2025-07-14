import { useState } from 'react'
import { Drop } from 'phosphor-react'
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
  const [bouncing, setBouncing] = useState(false)
  const [, createRipple] = useRipple()
  const { timezone } = useWeather() || {}
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: tz })
  )

  const daysDiff = task.date
    ? Math.round((new Date(task.date) - now) / (1000 * 60 * 60 * 24))
    : 0
  const overdue = task.date && daysDiff < 0
  const dueColor = task.date
    ? daysDiff < 0
      ? 'text-red-600'
      : daysDiff <= 2
      ? 'text-orange-600'
      : 'text-green-600'
    : ''

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task)
    } else if (task.type === 'Water') {
      const note = window.prompt('Optional note') || ''
      markWatered(task.plantId, note)
    }
    setChecked(true)
    setBouncing(true)
    setTimeout(() => {
      setChecked(false)
      setBouncing(false)
    }, 400)
  }

  const pillColors = {
    Water: 'bg-blue-100 text-blue-700',
    Fertilize: 'bg-orange-100 text-orange-700',
    Overdue: 'bg-red-100 text-red-700',
  }
  const pillClass = overdue
    ? pillColors.Overdue
    : pillColors[task.type] || 'bg-green-100 text-green-700'

  return (
    <div
      className="relative flex items-center gap-3 p-5 rounded-2xl shadow-sm bg-white dark:bg-gray-800 overflow-hidden"
      onMouseDown={createRipple}
      onTouchStart={createRipple}
    >
      <Link to={`/plant/${task.plantId}`} className="flex items-center flex-1 gap-3">
        <img
          src={task.image}
          alt={task.plantName}
          className={`w-16 h-16 object-cover rounded ${bouncing ? 'bounce-once' : ''}`}
        />
        <div className="flex-1">
          <p className="font-medium">{task.type} {task.plantName}</p>
          {task.date && (
            <p className={`text-xs ${dueColor}`}>{relativeDate(task.date, now, tz)}</p>
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
          <Drop aria-hidden="true" className="w-8 h-8 text-blue-600 water-drop" />
        </div>
      )}
    </div>
  )
}
