import { Link } from 'react-router-dom'
import { Note, Camera } from 'phosphor-react'
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
                  showMenuButton={false}
                />
              </BaseCard>
            ))
          ) : (
            <div className="p-6 border border-[#E5ECE6] shadow-sm rounded-2xl text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-[#B9EBCB] flex items-center justify-center mx-auto motion-safe:animate-[wiggle_0.25s_ease-in-out]">
                  <img src={happyPlant} alt="Happy plant" className="w-20 h-20" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1">All plants are happy</h3>
              <p className="text-sm text-gray-600 mb-4">Want to add a note or photo today?</p>
              <hr className="mx-auto w-1/2 border-t border-gray-200" />
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/timeline"
                  className="px-4 py-2 bg-green-500 text-white rounded-md shadow active:scale-95 flex items-center gap-2"
                >
                  <Note className="w-4 h-4" aria-hidden="true" />
                  Add Note
                </Link>
                <Link
                  to="/gallery"
                  className="px-4 py-2 border border-green-500 text-green-500 rounded-md active:scale-95 flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" aria-hidden="true" />
                  Take Photo
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
