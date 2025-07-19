import React, { useState } from 'react'
import { createPortal } from 'react-dom'

import {
  Drop,
  Sun,
  CheckCircle,
  WarningCircle,
  PencilSimpleLine,
  ClockCounterClockwise,
  Trash,
  DotsThreeVertical,
} from 'phosphor-react'
import { formatDaysAgo } from '../utils/dateFormat.js'
import { useNavigate } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import useSnackbar from '../hooks/useSnackbar.jsx'
import useSwipe from '../hooks/useSwipe.js'
import Badge from './Badge.jsx'

export default function UnifiedTaskCard({
  plant,
  urgent = false,
  overdue = false,
  swipeable = true,
}) {
  if (!plant) return null
  const { name, image, dueWater, dueFertilize, lastCared } = plant

  const [completed, setCompleted] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()
  const { plants, markWatered, markFertilized, updatePlant } = usePlants()
  const { showSnackbar } = useSnackbar()

  const bgClass = overdue
    ? 'bg-pink-50 dark:bg-red-800'
    : urgent
    ? 'bg-yellow-50 dark:bg-gray-700'
    : 'bg-gray-50 dark:bg-gray-800'

  const lastText = lastCared ? formatDaysAgo(lastCared) : null
  const last = lastText ? (
    <p className="text-timestamp text-gray-500">Last cared for {lastText}</p>
  ) : null

  let intervalDays = null
  if (dueWater && plant.lastWatered && plant.nextWater) {
    const last = new Date(plant.lastWatered)
    const next = new Date(plant.nextWater)
    if (!isNaN(last) && !isNaN(next)) {
      intervalDays = Math.round((next - last) / 86400000)
    }
  } else if (dueFertilize && plant.lastFertilized && plant.nextFertilize) {
    const last = new Date(plant.lastFertilized)
    const next = new Date(plant.nextFertilize)
    if (!isNaN(last) && !isNaN(next)) {
      intervalDays = Math.round((next - last) / 86400000)
    }
  }

  const needsText = intervalDays
    ? `Needs ${dueWater ? 'water' : 'fertilizer'} every ${intervalDays} day${
        intervalDays === 1 ? '' : 's'
      }`
    : null


  const goToDetail = () => {
    const room = plant.room ? encodeURIComponent(plant.room) : null
    navigate(room ? `/room/${room}/plant/${plant.id}` : `/plant/${plant.id}`)
  }

  const handleComplete = () => {
    const prev = plants.find(p => p.id === plant.id)
    if (dueWater || dueFertilize) {
      setCompleted(true)
      setTimeout(() => {
        if (dueWater) {
          markWatered(plant.id, '')
        }
        if (dueFertilize) {
          markFertilized(plant.id, '')
        }
        showSnackbar('Done', () => updatePlant(plant.id, prev))
      }, 400)
    }
  }

  const handleEdit = () => {
    const room = plant.room ? encodeURIComponent(plant.room) : null
    navigate(room ? `/room/${room}/plant/${plant.id}/edit` : `/plant/${plant.id}/edit`)
  }

  const handleReschedule = () => {
    const prev = plants.find(p => p.id === plant.id)
    const next = new Date(plant.nextWater || plant.nextFertilize || new Date())
    next.setDate(next.getDate() + 1)
    const updates = dueWater
      ? { nextWater: next.toISOString().slice(0, 10) }
      : { nextFertilize: next.toISOString().slice(0, 10) }
    updatePlant(plant.id, updates)
    showSnackbar('Rescheduled', () => updatePlant(plant.id, prev))
  }

  const handleDelete = () => {
    const prev = plants.find(p => p.id === plant.id)
    const updates = dueWater ? { nextWater: null } : { nextFertilize: null }
    updatePlant(plant.id, updates)
    showSnackbar('Deleted', () => updatePlant(plant.id, prev))
  }

  const { dx, start, move, end } = useSwipe(
    diff => {
      if (!swipeable) return
      if (diff > 40) {
        handleComplete()
        navigator.vibrate?.(10)
      } else if (diff < -40) {
        goToDetail()
      }
    },
    { threshold: 30 }
  )


  return (
    <div
      data-testid="unified-task-card"
      className={`relative rounded-2xl border border-neutral-200 dark:border-gray-600 shadow overflow-hidden touch-pan-y select-none ${bgClass}`}
      style={{ transform: `translateX(${swipeable ? (dx > 0 ? dx : 0) : 0}px)`, transition: dx === 0 ? 'transform 0.2s' : 'none' }}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {showMenu &&
        createPortal(
          <div
            className="modal-overlay bg-black/50 z-30 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Task actions menu"
            onClick={() => setShowMenu(false)}
          >
            <ul
              className="modal-box relative p-4 space-y-3"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setShowMenu(false)}
                className="modal-close"
              >
                &times;
              </button>
              <li>
                <button
                  type="button"
                  aria-label="Edit task"
                  onClick={() => {
                    setShowMenu(false)
                    handleEdit()
                  }}
                  className="task-action bg-blue-600 text-white w-full justify-start"
                >
                  <PencilSimpleLine className="w-4 h-4" aria-hidden="true" />
                  Edit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  aria-label="Reschedule task"
                  onClick={() => {
                    setShowMenu(false)
                    handleReschedule()
                  }}
                  className="task-action bg-yellow-600 text-white w-full justify-start"
                >
                  <ClockCounterClockwise className="w-4 h-4" aria-hidden="true" />
                  Reschedule
                </button>
              </li>
              <li>
                <button
                  type="button"
                  aria-label="Delete task"
                  onClick={() => {
                    setShowMenu(false)
                    handleDelete()
                  }}
                  className="task-action bg-red-600 text-white w-full justify-start"
                >
                  <Trash className="w-4 h-4" aria-hidden="true" />
                  Delete
                </button>
              </li>
            </ul>
          </div>,
          document.body
        )}
      <div className="flex items-center gap-4 p-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm bg-neutral-100 dark:bg-gray-700">
          <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-semibold font-headline text-gray-900 dark:text-gray-100 truncate">
              {name}
            </p>
            <div className="flex items-center gap-2">
              {overdue ? (
                <Badge variant="overdue" size="sm" Icon={WarningCircle}>
                  Overdue
                </Badge>
              ) : urgent ? (
                <Badge variant="urgent" size="sm" Icon={CheckCircle}>
                  Today
                </Badge>
              ) : null}
              <button
                type="button"
                aria-label="Open task menu"
                onClick={() => setShowMenu(true)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <DotsThreeVertical className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1 font-semibold">
            {dueWater && (
              <span className="inline-flex items-center gap-1 text-amber-600">
                <Drop className="w-4 h-4" aria-hidden="true" />
                Water
              </span>
            )}
            {dueFertilize && (
              <span className="inline-flex items-center gap-1 text-red-600">
                <Sun className="w-4 h-4" aria-hidden="true" />
                Fertilize
              </span>
            )}
          </div>
          {last}
          {needsText && (
            <p
              className={`text-timestamp mt-0.5 flex items-center gap-1 ${
                overdue ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {overdue && (
                <WarningCircle className="w-3 h-3" aria-hidden="true" />
              )}
              {needsText}
            </p>
          )}
        </div>
      </div>
      {completed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none task-complete-fade">
          <svg
            className="w-8 h-8 text-healthy-600 check-pop swipe-check fade-in"
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
