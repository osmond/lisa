import useRipple from '../utils/useRipple.js'

export default function TaskActions({ onWater, onSkip, onSnooze, onView, visible }) {
  const [, createRipple] = useRipple()
  return (
    <div
      data-testid="task-actions"
      className={`absolute inset-0 flex justify-between items-center px-4 transition ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <button
        onMouseDown={createRipple}
        onTouchStart={createRipple}
        onClick={onWater}
        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden"
        aria-label="Water"
      >
        Water
      </button>
      <div className="flex gap-2">
        <button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={onSkip}
          className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded pointer-events-auto relative overflow-hidden"
          aria-label="Skip"
        >
          Skip
        </button>
        <button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={onSnooze}
          className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden"
          aria-label="Snooze"
        >
          Snooze
        </button>
        <button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={onView}
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden"
          aria-label="View plant"
        >
          View
        </button>
      </div>
    </div>
  )
}
