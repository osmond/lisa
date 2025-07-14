import useRipple from '../utils/useRipple.js'
import { WaterIcon, SkipIcon, SnoozeIcon, ViewIcon } from './ActionIcons.jsx'

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
        className="bg-water-blue hover:bg-water-blue-dark text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden flex items-center gap-1"
        aria-label="Water"
      >
        <WaterIcon />
        Water
      </Button>

      <div className="flex gap-2">
        <Button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={onSkip}
          className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded pointer-events-auto relative overflow-hidden flex items-center gap-1"
          aria-label="Skip"
        >
          <SkipIcon />
          Skip
        </Button>
        <Button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={onSnooze}
          className="bg-fertilizer-orange hover:bg-fertilizer-orange-dark text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden flex items-center gap-1"
          aria-label="Snooze"
        >
          <SnoozeIcon />
          Snooze
        </Button>
        <Button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={onView}

          className="bg-water-blue hover:bg-water-blue-dark text-white px-2 py-1 pointer-events-auto relative overflow-hidden"


          aria-label="View plant"
        >
          <ViewIcon />
          View
        </Button>
      </div>
    </div>
  )
}
