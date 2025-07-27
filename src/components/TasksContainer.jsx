import { Link } from 'react-router-dom'
import { daysUntil } from '../utils/date.js'
import BaseCard from './BaseCard.jsx'
import SimpleTaskCard from './SimpleTaskCard.jsx'

export default function TasksContainer({
  visibleTasks = [],
  happyPlant,
  nextTaskDate,
}) {
  const days = nextTaskDate ? daysUntil(nextTaskDate) : null
  return (
    <div
      data-testid="tasks-container"
      className="mt-4 border-t border-neutral-200 dark:border-gray-600 p-4"
    >
      <section className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold font-headline">Today’s Tasks</h2>
        </div>
        <div className="space-y-2">
          {visibleTasks.length > 0 ? (
            visibleTasks.map((group, i) => {
              const label = group.overdue
                ? 'Care overdue'
                : group.urgent
                ? 'Needs care today'
                : 'Care due this week'
              return (
                <BaseCard
                  key={group.plant.id}
                  variant="task"
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <SimpleTaskCard
                    plant={group.plant}
                    label={label}
                    dueWater={group.dueWater}
                    dueFertilize={group.dueFertilize}
                  />
                </BaseCard>
              )
            })
          ) : (
            <div className="p-6 border border-[#E5ECE6] shadow-sm rounded-2xl text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto motion-safe:animate-[wiggle_0.25s_ease-in-out]">
                  <img src={happyPlant} alt="Happy plant" className="w-20 h-20" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1">No tasks due now – your care plan is on track!</h3>
              {days != null && (
                <p className="text-sm text-gray-600">Next task in {days} day{days === 1 ? '' : 's'}</p>
              )}
              <hr className="mx-auto w-1/2 border-t border-gray-200" />
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/myplants"
                  className="px-4 py-2 bg-green-500 text-white rounded-md shadow active:scale-95"
                >
                  View Care Plan
                </Link>
                <Link
                  to="/tasks"
                  className="px-4 py-2 border border-green-500 text-green-500 rounded-md active:scale-95"
                >
                  Browse Tasks
                </Link>
                <Link
                  to="/add"
                  className="px-4 py-2 border border-green-500 text-green-500 rounded-md active:scale-95"
                >
                  Add Plant
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
