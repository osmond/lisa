import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Drop, Sun } from 'phosphor-react'
import actionIcons from './ActionIcons.jsx'
import { getWateringInfo } from '../utils/watering.js'
import useSwipe from '../hooks/useSwipe.js'
import { createRipple } from '../utils/interactions.js'
import { usePlants } from '../PlantContext.jsx'
import NoteModal from './NoteModal.jsx'
import Badge from './Badge.jsx'

export default function TaskCard({
  task,
  urgent = false,
  overdue = false,
  completed = false,
  compact = false,
}) {
  const Icon = actionIcons[task.type]
  const { daysSince, eto } = getWateringInfo(task.lastWatered, { eto: task.eto })

  const navigate = useNavigate()
  const { markWatered, markFertilized, logEvent, updatePlant } = usePlants()

  const [showMenu, setShowMenu] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [animateComplete, setAnimateComplete] = useState(false)
  const LONG_PRESS_MS = 600
  const COMPLETE_THRESHOLD = 80
  const MENU_THRESHOLD = 60
  const longPressTimer = useRef(null)

  const handleComplete = () => {
    if (task.type === 'Water') {
      markWatered(task.plantId, '')
    } else if (task.type === 'Fertilize') {
      markFertilized(task.plantId, '')
    }
    setAnimateComplete(true)
    navigator.vibrate?.(10)
    setTimeout(() => setAnimateComplete(false), 600)
  }

  const handleAddNote = () => {
    setShowMenu(false)
    setShowNote(true)
  }

  const handleSaveNote = note => {
    if (note) {
      logEvent(task.plantId, 'Note', note)
    }
    setShowNote(false)
  }

  const handleSnooze = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (task.type === 'Water') {
      updatePlant(task.plantId, {
        nextWater: tomorrow.toISOString().slice(0, 10),
      })
    } else if (task.type === 'Fertilize') {
      updatePlant(task.plantId, {
        nextFertilize: tomorrow.toISOString().slice(0, 10),
      })
    }
    setShowMenu(false)
  }

  const handleEdit = () => {
    navigate(`/plant/${task.plantId}/edit`)
    setShowMenu(false)
  }

  const { dx: deltaX, start, move, end } = useSwipe(diff => {
    if (diff > COMPLETE_THRESHOLD) {
      handleComplete()
    } else if (diff < -MENU_THRESHOLD) {
      setShowMenu(true)
      navigator.vibrate?.(10)
    }
  })

  const handlePointerDown = e => {
    createRipple(e)
    start(e)
    longPressTimer.current = setTimeout(() => setShowMenu(true), LONG_PRESS_MS)
  }

  const handlePointerMove = e => {
    move(e)
    if (Math.abs(deltaX) > 5 && longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handlePointerUp = e => {
    clearTimeout(longPressTimer.current)
    longPressTimer.current = null
    end(e)
  }

  return (
    <>
      {showNote && (
        <NoteModal label="Add Note" onSave={handleSaveNote} onCancel={() => setShowNote(false)} />
      )}
      <div
        data-testid="task-card"
        tabIndex="0"
        aria-label={`Task card for ${task.plantName}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className="relative overflow-hidden rounded-xl"
      >
        {showMenu && (
          <div className="absolute inset-0 flex justify-end items-center gap-2 pr-4 bg-gray-100 dark:bg-gray-600">
            <button
              type="button"
              onClick={handleAddNote}
              className="bg-white dark:bg-gray-700 px-3 py-1 rounded text-sm"
            >
              Add Note
            </button>
            <button
              type="button"
              onClick={handleSnooze}
              className="bg-white dark:bg-gray-700 px-3 py-1 rounded text-sm"
            >
              Snooze
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="bg-white dark:bg-gray-700 px-3 py-1 rounded text-sm"
            >
              Edit Plant
            </button>
          </div>
        )}
        <div
          className={`relative flex items-center gap-3 px-4 py-3 shadow-sm ${completed || animateComplete ? 'bg-gray-100 dark:bg-gray-800 opacity-50' : 'bg-white dark:bg-gray-700'}${urgent ? ' ring-2 ring-green-300 dark:ring-green-400' : ''}`}
          style={{ transform: `translateX(${showMenu ? -100 : deltaX}px)`, transition: deltaX === 0 ? 'transform 0.2s' : 'none' }}
        >
          <div className="flex items-center flex-1 gap-3">
            <img src={task.image} alt={task.plantName} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {task.plantName}
                </p>
                {Icon && (
                  <Icon aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                )}
              </div>
              <div className="text-sm flex flex-wrap items-center gap-1 text-gray-500 mt-0.5">
                <Badge
                  Icon={task.type === 'Water' ? Drop : task.type === 'Fertilize' ? Sun : undefined}
                  colorClass={`text-sm font-medium ${
                    task.type === 'Water'
                      ? 'bg-water-100 text-water-800'
                      : task.type === 'Fertilize'
                      ? 'bg-fertilize-100 text-fertilize-800'
                      : 'bg-healthy-100 text-healthy-800'
                  }`}
                >
                  {completed || animateComplete
                    ? task.type === 'Water'
                      ? 'Watered!'
                      : task.type === 'Fertilize'
                      ? 'Fertilized!'
                      : task.type
                    : task.type === 'Water'
                    ? 'To Water'
                    : task.type === 'Fertilize'
                    ? 'To Fertilize'
                    : task.type}
                </Badge>
                {daysSince != null && (
                  <span className="text-xs text-gray-500">
                    {daysSince} {daysSince === 1 ? 'day' : 'days'} since care
                  </span>
                )}
              </div>
              {!compact && task.reason && (
                <p className="text-xs text-gray-500 font-body mt-0.5">{task.reason}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            disabled
            className="ml-auto relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-healthy-500"
            aria-label="Mark complete"
          >
            <input type="checkbox" checked={completed || animateComplete} readOnly className="sr-only task-checkbox" />
            <CheckCircle aria-hidden="true" className={`w-6 h-6 ${completed || animateComplete ? 'text-healthy-500' : 'text-gray-400'}`} />
            {overdue && (
              <span
                className="absolute -top-1 -right-1 bg-fertilize-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs overdue-ping"
                data-testid="overdue-badge"
              >
                !
              </span>
            )}
          </button>
          {(completed || animateComplete) && (
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
      </div>
    </>
  )
}

