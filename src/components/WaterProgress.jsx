import { Drop } from 'phosphor-react'
import useRipple from '../utils/useRipple.js'

export default function WaterProgress({ completed = 0, total = 0 }) {
  const [, createRipple] = useRipple()
  const drops = Array.from({ length: total })
  return (
    <div className="flex gap-1" data-testid="water-progress-bar">
      {drops.map((_, i) => (
        <span
          key={i}
          data-testid="water-drop"
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          className="relative inline-flex overflow-hidden rounded-full"
        >
          <Drop
            aria-hidden="true"
            className={`w-5 h-5 ${i < completed ? 'text-blue-500' : 'text-gray-400'}`}
          />
        </span>
      ))}
      {total > 0 && completed === total && (
        <span role="img" aria-label="Bloom" className="bloom-pop">🌱</span>
      )}
    </div>
  )
}
