import { usePlants } from '../PlantContext.jsx'
import { useMemo } from 'react'
import actionIcons from '../components/ActionIcons.jsx'
import { formatMonth } from '../utils/date.js'
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
      {groupedEvents.map(([monthKey, list]) => (
        <div key={monthKey}>
          <h3 className="mt-4 text-sm font-semibold text-gray-500">
            {formatMonth(monthKey)}
          </h3>
          <ul className="relative border-l border-gray-200 pl-4 space-y-6">
            {list.map((e, i) => {
              const Icon = actionIcons[e.type]
              return (
                <li key={`${e.date}-${e.label}-${i}`} className="relative">
                  <span
                    className={`absolute left-[-6px] top-1 w-3 h-3 rounded-full ${colors[e.type]}`}
                  ></span>
                  <p className="text-xs text-gray-500">{e.date}</p>
                  <p className="flex items-center gap-1">
                    {Icon && (
                      <Icon className={`w-5 h-5 ${iconColors[e.type]}`} />
                    )}
                    {e.label}
                  </p>
                  {e.note && (
                    <p className="text-xs text-gray-500 italic">{e.note}</p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
