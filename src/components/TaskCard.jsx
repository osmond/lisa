import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from './ActionIcons.jsx'
import { CheckCircle } from 'phosphor-react'
import useToast from "../hooks/useToast.jsx"


import { createRipple } from '../utils/interactions.js'
import useSwipe from '../hooks/useSwipe.js'


import { getWateringInfo } from '../utils/watering.js'
import Badge from './Badge.jsx'

export default function TaskCard({
  task,
  onComplete,
  urgent = false,
  overdue = false,
  completed = false,
  compact = false,
}) {
  const { markWatered, markFertilized } = usePlants()
  const Icon = actionIcons[task.type]
  const { Toast, showToast } = useToast()
  const [checked, setChecked] = useState(false)
  const isChecked = checked || completed

  const handleKeyDown = e => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleComplete()
    }
  }

  const { daysSince, eto } = getWateringInfo(task.lastWatered, { eto: task.eto })
  const toastMsg =
    task.type === "Water"
      ? `Watered ${task.plantName} 🌿`
      : task.type === "Fertilize"
      ? `Fertilized ${task.plantName} 🌿`
      : `Completed ${task.plantName}`


  const handleComplete = () => {
    if (onComplete) {
      onComplete(task)
    } else {
      if (task.type === 'Water') {
        markWatered(task.plantId, '')
      } else if (task.type === 'Fertilize') {
        markFertilized(task.plantId, '')
      }
    }
    showToast(toastMsg)
    setChecked(true)
    setTimeout(() => setChecked(false), 400)
  }

  const { dx: deltaX, start, move, end } = useSwipe(diff => {
    if (diff > 75) {
      handleComplete()
    }
  })

  return (
    <>
    <div
      data-testid="task-card"
      tabIndex="0"
      aria-label={`Task card for ${task.plantName}`}
      onKeyDown={handleKeyDown}


      onPointerDown={e => { createRipple(e); start(e) }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      onMouseMove={move}
      onMouseUp={end}
      onMouseDown={e => {
        createRipple(e)
        start(e)
      }}
      onTouchStart={e => {
        createRipple(e)
        start(e)
      }}


      className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl overflow-hidden shadow-sm transition-transform duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500${completed ? ' bg-gray-100 dark:bg-gray-800 opacity-50 ring-1 ring-neutral-200' : ' bg-white dark:bg-gray-700 ring-1 ring-neutral-200 hover:bg-gray-50 dark:hover:bg-gray-600'}${urgent ? ' ring-green-300 dark:ring-green-400' : ''}${overdue ? ' ring-orange-300' : ''}`}


      onTouchMove={move}
      onTouchEnd={end}



      style={{
        transform: `translateX(${deltaX}px)`,
        transition: deltaX === 0 ? 'transform 0.2s' : 'none',
      }}
    >
      <Link
        to={`/plant/${task.plantId}`}
        className="flex items-center flex-1 gap-3"
      >
        <img
          src={task.image}
          alt={task.plantName}
          className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} object-cover rounded-md`}
        />
        <div className="flex-1">
          <p className={`${compact ? '' : 'text-lg'} font-bold font-headline`}>{task.plantName}</p>
          <p className={`${compact ? 'text-sm' : 'text-base'} font-body`}>
            <Badge
              colorClass={`text-xs ${
                task.type === 'Water'
                  ? 'bg-water-200 text-water-800'
                  : task.type === 'Fertilize'
                  ? 'bg-fertilize-200 text-fertilize-800'
                  : 'bg-healthy-200 text-healthy-800'
              }`}
            >
              {completed
                ? task.type === 'Water'
                  ? 'Watered'
                  : task.type === 'Fertilize'
                  ? 'Fertilized'
                  : task.type
                : task.type === 'Water'
                ? 'To Water'
                : task.type === 'Fertilize'
                ? 'To Fertilize'
                : task.type}
            </Badge>
          </p>
          {!compact && task.reason && (
            <p className="text-sm text-gray-500 font-body">{task.reason}</p>
          )}
        </div>
        {Icon && <Icon aria-hidden="true" />}
      </Link>
      <button
        type="button"
        onMouseDown={createRipple}
        onTouchStart={createRipple}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            createRipple(e)
          }
        }}
        onClick={handleComplete}
        disabled={completed}
        className="ml-auto relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-healthy-500"
        aria-label="Mark complete"
      >
        <input
          type="checkbox"
          checked={isChecked}
          readOnly
          className="sr-only task-checkbox"
        />
        <CheckCircle
          aria-hidden="true"
          className={`w-6 h-6 ${isChecked ? 'text-healthy-500' : 'text-gray-400'}`}
        />
        {overdue && (
          <span
            className="absolute -top-1 -right-1 bg-fertilize-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
            data-testid="overdue-badge"
          >
            !
          </span>
        )}
      </button>
      {(checked || completed) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none task-complete-fade">
          <svg
            className="w-8 h-8 text-healthy-600 check-pop"
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
      <Toast />
      {!compact && (
        <div className="mt-2">
          <span
            className="px-2 py-0.5 text-sm rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 opacity-70"
            aria-label={`Evapotranspiration (ET₀): ${eto ?? 'N/A'} mm | Last watered ${daysSince ?? '?'} days ago`}
            title="Evapotranspiration (ET₀) is water lost from soil and plants"
          >
            Evapotranspiration (ET₀): {eto ?? '—'} mm | Last watered {daysSince ?? '?'} days ago
          </span>
        </div>
      )}
    </div>
    </>
  )
}
