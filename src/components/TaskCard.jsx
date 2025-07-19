import { Drop, Sun, PencilSimpleLine, ClockCounterClockwise, Trash } from 'phosphor-react'
import { useNavigate } from 'react-router-dom'
import { getWateringInfo } from '../utils/watering.js'
import { usePlants } from '../PlantContext.jsx'
import useSnackbar from '../hooks/useSnackbar.jsx'
import Badge from './Badge.jsx'
import useSwipe from '../hooks/useSwipe.js'

export default function TaskCard({
  task,
  urgent = false,
  completed = false,
  compact = false,
  swipeable = true,
}) {
  const { daysSince, eto } = getWateringInfo(task.lastWatered, { eto: task.eto })
  const navigate = useNavigate()
  const { plants, markWatered, markFertilized, updatePlant } = usePlants()
  const { Snackbar, showSnackbar } = useSnackbar()

  const goToDetail = e => {
    e.stopPropagation()
    const room = task.room ? encodeURIComponent(task.room) : null
    navigate(room ? `/room/${room}/plant/${task.plantId}` : `/plant/${task.plantId}`)
  }

  const handleComplete = () => {
    const prev = plants.find(p => p.id === task.plantId)
    if (task.type === 'Water') {
      markWatered(task.plantId, '')
      showSnackbar('Watered', () => updatePlant(task.plantId, prev))
    } else if (task.type === 'Fertilize') {
      markFertilized(task.plantId, '')
      showSnackbar('Fertilized', () => updatePlant(task.plantId, prev))
    }
  }

  const handleEdit = () => {
    const room = task.room ? encodeURIComponent(task.room) : null
    navigate(
      room ? `/room/${room}/plant/${task.plantId}/edit` : `/plant/${task.plantId}/edit`
    )
  }

  const handleReschedule = () => {
    const prev = plants.find(p => p.id === task.plantId)
    const next = new Date(task.date || new Date())
    next.setDate(next.getDate() + 1)
    const updates =
      task.type === 'Water'
        ? { nextWater: next.toISOString().slice(0, 10) }
        : { nextFertilize: next.toISOString().slice(0, 10) }
    updatePlant(task.plantId, updates)
    showSnackbar('Rescheduled', () => updatePlant(task.plantId, prev))
  }

  const handleDelete = () => {
    const prev = plants.find(p => p.id === task.plantId)
    const updates =
      task.type === 'Water'
        ? { nextWater: null }
        : { nextFertilize: null }
    updatePlant(task.plantId, updates)
    showSnackbar('Deleted', () => updatePlant(task.plantId, prev))
  }

  const { dx, start, move, end } = useSwipe(
    diff => {
      if (!swipeable) return
      if (diff > 60) {
        handleComplete()
        navigator.vibrate?.(10)
      } else if (diff < -60) {
        const room = task.room ? encodeURIComponent(task.room) : null
        navigate(
          room ? `/room/${room}/plant/${task.plantId}` : `/plant/${task.plantId}`
        )
      }
    },
    { threshold: 30 }
  )

  const showActionBar = dx < 0 && dx > -60

  return (
    <>
    <div
      data-testid="task-card"
      tabIndex="0"
      aria-label={`Task card for ${task.plantName}`}
      className={`relative flex items-center p-5 gap-4 rounded-2xl shadow border border-neutral-200 dark:border-gray-600 ${completed ? 'bg-gray-100 dark:bg-gray-800 opacity-50' : 'bg-neutral-50 dark:bg-gray-700'}${urgent ? ' ring-2 ring-green-300 dark:ring-green-400' : ''}`}
      style={{ transform: `translateX(${swipeable ? dx : 0}px)`, transition: dx === 0 ? 'transform 0.2s' : 'none' }}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div
        className={`task-action-bar ${showActionBar ? 'show' : ''}`}
        role="group"
        aria-label="Task actions"
      >
        <button
          type="button"
          aria-label="Edit task"
          onClick={handleEdit}
          className="task-action bg-blue-600 text-white"
        >
          <PencilSimpleLine className="w-4 h-4" aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          aria-label="Reschedule task"
          onClick={handleReschedule}
          className="task-action bg-yellow-600 text-white"
        >
          <ClockCounterClockwise className="w-4 h-4" aria-hidden="true" />
          Reschedule
        </button>
        <button
          type="button"
          aria-label="Delete task"
          onClick={handleDelete}
          className="task-action bg-red-600 text-white"
        >
          <Trash className="w-4 h-4" aria-hidden="true" />
          Delete
        </button>
      </div>
      <div className="flex items-center flex-1 gap-4">
      <button
        type="button"
        onClick={goToDetail}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm bg-neutral-100 dark:bg-gray-800 ${
            task.type === 'Water'
              ? 'ring-2 ring-water-300'
              : task.type === 'Fertilize'
              ? 'ring-2 ring-fertilize-300'
              : 'ring-2 ring-healthy-300'
          }`}
      >
        <img
          src={task.image}
          alt={task.plantName}
          className="w-12 h-12 rounded-full object-cover"
        />
      </button>
        <div className="w-px self-stretch bg-gray-200 dark:bg-gray-600" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {task.plantName}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              Icon={
                task.type === 'Water'
                  ? Drop
                  : task.type === 'Fertilize'
                  ? Sun
                  : undefined
              }
              variant={completed ? 'complete' : 'info'}
            >
              {completed
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
              <span className="text-timestamp text-gray-400">
                {daysSince} {daysSince === 1 ? 'day' : 'days'} since care
              </span>
            )}
          </div>
          {!compact && task.reason && (
            <p className="text-xs text-gray-500 font-body mt-0.5">{task.reason}</p>
          )}
        </div>
      </div>
          {completed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none task-complete-fade">
              <svg
                className="w-8 h-8 text-healthy-600 check-pop swipe-check"
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
                className="px-2 py-0.5 text-sm rounded-xl bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 opacity-70"
                aria-label={`Evapotranspiration (ET₀): ${eto ?? 'N/A'} mm | Last watered ${daysSince ?? '?'} days ago`}
                title="Evapotranspiration (ET₀) is water lost from soil and plants"
              >
                Evapotranspiration (ET₀): {eto ?? '—'} mm | Last watered {daysSince ?? '?'} days ago
              </span>
            </div>
          )}
        </div>
      <Snackbar />
    </>
  )
}

