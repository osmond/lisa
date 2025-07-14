import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from './ActionIcons.jsx'
import { CheckCircle } from 'phosphor-react'
import useRipple from '../utils/useRipple.js'

export default function TaskCard({ task, onComplete, urgent = false, overdue = false }) {
  const { markWatered, markFertilized } = usePlants()
  const Icon = actionIcons[task.type]
  const [checked, setChecked] = useState(false)
  const startX = useRef(0)
  const [deltaX, setDeltaX] = useState(0)
  const [, createRipple] = useRipple()

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

      className={`relative flex items-center gap-3 p-3 rounded-xl border dark:border-gray-600 shadow bg-stone dark:bg-gray-700 overflow-hidden transition-transform duration-150 hover:bg-gray-50 active:scale-95${urgent ? ' ring-2 ring-green-300 dark:ring-green-400' : ''}${overdue ? ' ring-orange-300' : ''}`}

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
          className="w-12 h-12 object-cover rounded-md"
        />
        <div className="flex-1">
          <p className="font-bold font-headline">{task.plantName}</p>
          <p className="text-sm text-gray-500 font-body">{task.type}</p>
          {task.reason && (
            <p className="text-xs text-gray-500 font-body">{task.reason}</p>
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
        className="ml-auto relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
        aria-label="Mark complete"
      >
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="sr-only task-checkbox"
        />
        <CheckCircle
          aria-hidden="true"
          className={`w-6 h-6 ${checked ? 'text-green-500' : 'text-gray-400'}`}
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
    </div>
  )
}
