import { Drop, Sun } from 'phosphor-react'
import actionIcons from './ActionIcons.jsx'
import { getWateringInfo } from '../utils/watering.js'
import Badge from './Badge.jsx'

export default function TaskCard({
  task,
  urgent = false,
  overdue = false,
  completed = false,
  compact = false,
  swipeable = true,
}) {
  const Icon = actionIcons[task.type]
  const { daysSince, eto } = getWateringInfo(task.lastWatered, { eto: task.eto })

  return (
    <div
      data-testid="task-card"
      tabIndex="0"
      aria-label={`Task card for ${task.plantName}`}
      className="relative overflow-hidden rounded-xl"
    >
        <div
          className={`relative flex items-center gap-3 px-4 py-3 shadow-sm ${completed ? 'bg-gray-100 dark:bg-gray-800 opacity-50' : 'bg-white dark:bg-gray-700'}${urgent ? ' ring-2 ring-green-300 dark:ring-green-400' : ''}`}
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
          {overdue && (
            <span
              className="absolute -top-1 -right-1 bg-fertilize-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs overdue-ping"
              data-testid="overdue-badge"
            >
              !
            </span>
          )}
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
  )
}

