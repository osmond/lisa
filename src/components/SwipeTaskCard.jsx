import { motion, useMotionValue, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import clsx from 'clsx'

export default function SwipeTaskCard({
  plantName,
  taskType,
  imageUrl,
  dueStatus,
  onComplete,
  onEdit,
  onDelete,
}) {
  const x = useMotionValue(0)
  const controls = useAnimation()

  useEffect(() => {
    if (x.get() > 120) {
      controls.start({ x: 500, opacity: 0 }).then(onComplete)
    }
  }, [x, onComplete, controls])

  const getStatusColor = status => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-700'
      case 'dueToday':
        return 'bg-yellow-100 text-yellow-700'
      case 'upcoming':
        return 'bg-gray-100 text-gray-500'
      default:
        return ''
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Swipe background */}
      <div className="absolute inset-0 flex items-center justify-start pl-4 bg-green-100 rounded-xl z-0">
        <span className="text-green-600 font-medium">Mark as Done ✅</span>
      </div>

      {/* Swipe foreground */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 200 }}
        style={{ x }}
        animate={controls}
        className="relative z-10 flex items-center gap-4 bg-white shadow-md rounded-xl px-4 py-3"
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {taskType === 'Water' ? '💧' : '🌱'}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{plantName}</div>
          <div className="text-xs text-gray-500">{taskType}</div>
        </div>
        {dueStatus && (
          <span
            className={clsx('text-xs px-2 py-0.5 rounded-full', getStatusColor(dueStatus))}
          >
            {dueStatus === 'overdue' ? 'Overdue' : dueStatus === 'dueToday' ? 'Today' : 'Upcoming'}
          </span>
        )}
      </motion.div>
    </div>
  )
}
