import useRipple from '../utils/useRipple.js'

import Button from "./Button.jsx"
export default function TaskActions({ onWater, onSkip, onSnooze, onView, visible }) {
  const [, createRipple] = useRipple()
  return (
    <div
      data-testid="task-actions"
      className={`absolute inset-0 flex justify-between items-center px-4 transition ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <Button
        onMouseDown={createRipple}
        onTouchStart={createRipple}
        onClick={onWater}
        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 pointer-events-auto relative overflow-hidden"
        aria-label="Water"
      >
        Water
      </Button>
      <div className="flex gap-2">
        <Button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={onSkip}
          className="bg-gray-200 dark:bg-gray-700 px-2 py-1 pointer-events-auto relative overflow-hidden"
          aria-label="Skip"
        >
          Skip
        </Button>
        <Button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={onSnooze}
          className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 pointer-events-auto relative overflow-hidden"
          aria-label="Snooze"
        >
          Snooze
        </Button>
        <Button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={onView}
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 pointer-events-auto relative overflow-hidden"
          aria-label="View plant"
        >
          View
        </Button>
      </div>
    </div>
  )
}
