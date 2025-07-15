import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from './ActionIcons.jsx'
import { CheckCircle, Clock, WarningCircle } from 'phosphor-react'
import useRipple from '../utils/useRipple.js'
import { getWateringInfo } from '../utils/watering.js'

export default function TaskCard({
  task,
  onComplete,
  urgent = false,
  overdue = false,
  completed = false,
}) {
  const { markWatered, markFertilized } = usePlants()
  const Icon = actionIcons[task.type]
  const [checked, setChecked] = useState(false)
  const isChecked = checked || completed
  const startX = useRef(0)
  const [deltaX, setDeltaX] = useState(0)
  const [, createRipple] = useRipple()

  const { daysSince, eto } = getWateringInfo(task.lastWatered, { eto: task.eto })

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task)
    } else if (task.type === 'Water') {
      const note = window.prompt('Optional note') || ''
      markWatered(task.plantId, note)
    } else if (task.type === 'Fertilize') {
      const note = window.prompt('Optional note') || ''
      markFertilized(task.plantId, note)
    }
    setChecked(true)
    setTimeout(() => setChecked(false), 400)
  }

  const handlePointerDown = e => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
  }

  const handlePointerMove = e => {
    if (!startX.current) return
    const currentX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    setDeltaX(currentX - startX.current)
  }

  const handlePointerEnd = e => {
    const currentX = e?.clientX ?? e?.changedTouches?.[0]?.clientX ?? startX.current
    const diff = deltaX || (currentX - startX.current)
    setDeltaX(0)
    startX.current = 0
    if (diff > 75) {
      handleComplete()
    }
  }

  return (
    <div
      data-testid="task-card"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerEnd}
      onMouseDown={e => {
        createRipple(e)
        handlePointerDown(e)
      }}
      onTouchStart={e => {
        createRipple(e)
        handlePointerDown(e)
      }}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerEnd}

      className={`relative flex items-start gap-3 p-4 rounded-2xl border dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 overflow-hidden transition-transform duration-150 hover:bg-gray-50 active:scale-95 animate-fade-in-up${urgent ? ' ring-2 ring-green-300 dark:ring-green-400' : ''}${overdue ? ' ring-orange-300' : ''}${completed ? ' opacity-50' : ''}`}

      style={{
        transform: `translateX(${deltaX}px)`,
        transition: deltaX === 0 ? 'transform 0.2s' : 'none',
      }}
    >
      {(urgent || overdue) && (
        <span
          className={`absolute inset-y-0 left-0 w-1 ${overdue ? 'bg-orange-400' : 'bg-green-400'}`}
          aria-hidden="true"
        ></span>
      )}
      <Link
        to={`/plant/${task.plantId}`}
        className="flex items-start flex-1 gap-3"
      >
        <div className="relative">
          <img
            src={task.image}
            alt={task.plantName}
            className={`w-12 h-12 object-cover rounded-md ${completed ? 'grayscale' : ''}`}
          />
          {completed && (
            <CheckCircle
              className="w-4 h-4 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="font-bold font-headline">{task.plantName}</p>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                task.type === 'Water'
                  ? 'bg-blue-200 text-blue-800'
                  : task.type === 'Fertilize'
                  ? 'bg-orange-200 text-orange-800'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {completed
                ? task.type === 'Water'
                  ? 'Watered'
                  : task.type === 'Fertilize'
                  ? 'Fertilized'
                  : task.type
                : task.type}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
            {Icon && <Icon aria-hidden="true" />}
            {completed ? (
              <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
            ) : overdue ? (
              <WarningCircle className="w-4 h-4 text-orange-500" aria-hidden="true" />
            ) : null}
          </div>
          {task.reason && (
            <p className="text-xs text-gray-500 font-body">{task.reason}</p>
          )}
        </div>
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
        className="ml-auto relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
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
          className={`w-6 h-6 ${isChecked ? 'text-green-500' : 'text-gray-400'}`}
        />
        {overdue && (
          <span
            className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
            data-testid="overdue-badge"
          >
            !
          </span>
        )}
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
      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
        <Clock className="w-4 h-4" aria-hidden="true" />
        <span aria-label={`ET₀: ${eto ?? 'N/A'} | Last watered ${daysSince ?? '?'} days ago`}>
          ET₀: {eto ?? '—'} | Last watered {daysSince ?? '?'} days ago
        </span>
      </div>
    </div>
  )
}
