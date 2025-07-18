import { Drop, Sun } from 'phosphor-react'
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

  return (
    <>
    <div
      data-testid="task-card"
      tabIndex="0"
      aria-label={`Task card for ${task.plantName}`}
      className="relative overflow-hidden min-h-[130px] rounded-xl"
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
        <div
          className={`relative flex items-center gap-4 shadow-md ${completed ? 'bg-gray-100 dark:bg-gray-800 opacity-50' : 'bg-white dark:bg-gray-700'}${urgent ? ' ring-2 ring-green-300 dark:ring-green-400' : ''}`}
          style={{ transform: `translateX(${swipeable ? dx : 0}px)`, transition: dx === 0 ? 'transform 0.2s' : 'none' }}
        >
          <div className="flex items-center flex-1 gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center bg-green-50 dark:bg-gray-800 ${
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
            </div>
            <div className="w-px self-stretch bg-gray-200 dark:bg-gray-600" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
                  {task.plantName}
                </p>
              </div>
              <div className="text-sm flex flex-wrap items-center gap-1 text-gray-400 mt-0.5">
                <Badge
                  Icon={task.type === 'Water' ? Drop : task.type === 'Fertilize' ? Sun : undefined}
                  colorClass={`text-sm font-medium ${
                    task.type === 'Water'
                      ? 'bg-water-100/90 text-water-800'
                      : task.type === 'Fertilize'
                        ? 'bg-fertilize-100/90 text-fertilize-800'
                        : 'bg-healthy-100/90 text-healthy-800'
                  }`}
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
                  <span className="text-xs text-gray-400">
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
                className="px-2 py-0.5 text-sm rounded-xl bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 opacity-70"
                aria-label={`Evapotranspiration (ET₀): ${eto ?? 'N/A'} mm | Last watered ${daysSince ?? '?'} days ago`}
                title="Evapotranspiration (ET₀) is water lost from soil and plants"
              >
                Evapotranspiration (ET₀): {eto ?? '—'} mm | Last watered {daysSince ?? '?'} days ago
              </span>
            </div>
          )}
        </div>
      </div>
      <Snackbar />
    </>
  )
}

