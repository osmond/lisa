import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from './ActionIcons.jsx'
import { CheckCircle } from 'phosphor-react'
import useToast from "../hooks/useToast.jsx"


import { createRipple } from '../utils/interactions.js'
import useSwipe from '../hooks/useSwipe.js'


import { getWateringInfo } from '../utils/watering.js'
import Badge from './Badge.jsx'
import ConfirmModal from './ConfirmModal.jsx'

export default function TaskCard({
  task,
  onComplete,
  urgent = false,
  overdue = false,
  completed = false,
  compact = false,
}) {
  const navigate = useNavigate()
  const { markWatered, markFertilized, removePlant } = usePlants()
  const Icon = actionIcons[task.type]
  const { Toast, showToast } = useToast()
  const [checked, setChecked] = useState(false)
  const isChecked = checked || completed
  const [showConfirm, setShowConfirm] = useState(false)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const COMPLETE_THRESHOLD = 75
  const EDIT_THRESHOLD = 100
  const DELETE_THRESHOLD = 200

  const handleKeyDown = e => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleComplete()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      navigate(`/plant/${task.plantId}/edit`)
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      setShowConfirm(true)
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
    if (diff > COMPLETE_THRESHOLD) {
      handleComplete()
    } else if (diff < -DELETE_THRESHOLD) {
      setShowDeletePrompt(true)
      setShowConfirm(true)
    } else if (diff < -EDIT_THRESHOLD) {
      navigate(`/plant/${task.plantId}/edit`)
    }
  })

  const swipeProgress = Math.max(0, Math.min(deltaX / 80, 1))

  const confirmDelete = () => {
    removePlant(task.plantId)
    setShowConfirm(false)
  }

  const cancelDelete = () => {
    setShowConfirm(false)
  }

  const handleDelete = () => {
    setShowConfirm(true)
  }

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


      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow transition-transform duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500${completed ? ' bg-gray-100 dark:bg-gray-800 opacity-50' : ' bg-white dark:bg-gray-700'}${urgent ? ' ring-2 ring-green-300 dark:ring-green-400' : ''}`}


      onTouchMove={move}
      onTouchEnd={end}



      style={{
        transform: `translateX(${deltaX}px)`,
        transition: deltaX === 0 ? 'transform 0.2s' : 'none',
      }}
    >
      {deltaX > 0 && !isChecked && (
        <div
          className="absolute inset-0 flex items-center rounded-2xl pointer-events-none"
          style={{
            backgroundColor: `rgba(74,222,128,${0.2 * swipeProgress})`,
            opacity: swipeProgress,
          }}
        >
          <CheckCircle
            aria-hidden="true"
            className="w-8 h-8 text-healthy-600 swipe-check"
            style={{ marginLeft: `${8 + Math.min(deltaX, 80) / 2}px` }}
          />
        </div>
      )}
      {(deltaX < -40 || showDeletePrompt) && (
        <div className="absolute inset-0 flex justify-end items-center pr-4 pointer-events-none">
          {showDeletePrompt ? (
            <button
              onClick={() => {
                setShowDeletePrompt(false)
                handleDelete()
              }}
              className="bg-red-600 text-white px-3 py-1 rounded pointer-events-auto"
            >
              Delete?
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className={`bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1 transition-opacity ${deltaX < -40 ? 'opacity-100' : 'opacity-0'}`}
              >
                <Pencil1Icon className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-body">Edit</span>
              </div>
              <div
                className={`bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 transition-opacity ${deltaX < -120 ? 'opacity-100' : 'opacity-0'}`}
              >
                <TrashIcon className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-body">Delete</span>
              </div>
            </div>
          )}
        </div>
      )}
      <Link
        to={`/plant/${task.plantId}`}
        className="flex items-center flex-1 gap-3"
      >
        <img
          src={task.image}
          alt={task.plantName}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {task.plantName}
            </p>
            {Icon && (
              <Icon
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0"
              />
            )}
          </div>
          <p className="text-sm flex flex-wrap items-center gap-1 text-gray-500">
            <Badge
              colorClass={`text-sm font-medium ${
                task.type === 'Water'
                  ? 'bg-water-100 text-water-800'
                  : task.type === 'Fertilize'
                  ? 'bg-fertilize-100 text-fertilize-800'
                  : 'bg-healthy-100 text-healthy-800'
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
            {daysSince != null && (
              <span className="text-sm text-gray-500">
                · {daysSince} {daysSince === 1 ? 'day' : 'days'} since care
              </span>
            )}
          </p>
          {!compact && task.reason && (
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
            className="absolute -top-1 -right-1 bg-fertilize-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs overdue-ping"
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
    {showConfirm && (
      <ConfirmModal
        label="Delete this plant?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    )}
    </>
  )
}
