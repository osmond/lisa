import { usePlants } from '../PlantContext.jsx'
import { useMemo } from 'react'
import actionIcons from '../components/ActionIcons.jsx'
import { formatMonth, formatDate } from '../utils/date.js'
import { buildEvents, groupEventsByMonth } from '../utils/events.js'

export default function Timeline() {
  const { plants } = usePlants()

  const events = useMemo(
    () => buildEvents(plants, { includePlantName: true }),
    [plants]
  )

  const groupedEvents = useMemo(
    () => groupEventsByMonth(events),
    [events]
  )


  const colors = {
    water: 'bg-blue-500',
    fertilize: 'bg-yellow-500',
    note: 'bg-gray-400',
    log: 'bg-green-400',
    iconBlue: 'text-blue-500',
    iconYellow: 'text-yellow-500',
    iconGray: 'text-gray-400',
    iconGreen: 'text-green-500',
  }

  const iconColors = {
    water: colors.iconBlue,
    fertilize: colors.iconYellow,
    note: colors.iconGray,
    log: colors.iconGreen,
  }

  return (
    <div className="overflow-y-auto max-h-full p-4 text-gray-700 dark:text-gray-200">
      <div className="rounded-xl bg-white shadow-sm p-4 border border-gray-100">
        {groupedEvents.map(([monthKey, list]) => (
          <div key={monthKey}>
            <h3 className="mt-6 text-base font-semibold text-gray-600">
              {formatMonth(monthKey)}
            </h3>
            <ul className="ml-2 space-y-8">
              {list.map((e, i) => {
                const Icon = actionIcons[e.type]
                return (
                  <li
                    key={`${e.date}-${e.label}-${i}`}
                    className="relative flex items-start space-x-2 pl-4 before:absolute before:top-0 before:bottom-0 before:left-6 before:w-px before:bg-gray-300"
                  >
                    <div className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center ${colors[e.type]}`}>
                      {Icon && <Icon className={`w-3 h-3 ${iconColors[e.type]}`} aria-hidden="true" />}
                    </div>
                    <div>
                      <p className="font-medium">
                        {formatDate(e.date)} — {e.label}
                      </p>
                      {e.note && (
                        <p className="text-xs text-gray-500 italic">{e.note}</p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
