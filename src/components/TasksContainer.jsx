import { Link } from 'react-router-dom'
import BaseCard from './BaseCard.jsx'
import UnifiedTaskCard from './UnifiedTaskCard.jsx'

export default function TasksContainer({ visibleTasks = [], happyPlant }) {
  return (
    <div
      data-testid="tasks-container"
      className="mt-4 border-t border-neutral-200 dark:border-gray-600 p-4"
    >
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold font-headline">Today’s Tasks</h2>
        </div>
        <div className="space-y-2">
          {visibleTasks.length > 0 ? (
            visibleTasks.map((group, i) => (
              <BaseCard
                key={group.plant.id}
                variant="task"
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <UnifiedTaskCard
                  plant={{
                    ...group.plant,
                    dueWater: group.dueWater,
                    dueFertilize: group.dueFertilize,
                    lastCared: group.lastCared,
                  }}
                  urgent={group.urgent}
                  overdue={group.overdue}
                />
              </BaseCard>
            ))
          ) : (
            <div className="text-sm text-gray-500 space-y-1 text-center flex flex-col items-center">
              <img src={happyPlant} alt="Happy plant" className="w-24 h-24 mb-2" />
              <p>All plants are happy today!</p>
              <p>Want to add a note or photo today?</p>
              <div className="flex gap-4 mt-2">
                <Link to="/timeline" className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Add a journal entry
                </Link>
                <Link to="/profile" className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Set a reminder
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
