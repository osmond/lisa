import { Sun, Flower } from 'phosphor-react'
import useRipple from '../utils/useRipple.js'

export default function FertilizeProgress({ completed = 0, total = 0 }) {
  const [, createRipple] = useRipple()
  const drops = Array.from({ length: total })
  return (
    <div className="flex gap-1" data-testid="fert-progress-bar">
      {drops.map((_, i) => (
        <span
          key={i}
          data-testid="fert-drop"
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          className="relative inline-flex overflow-hidden rounded-full"
          aria-label={`Fertilizer drop ${i + 1} of ${total}`}
          title={`Fertilizer drop ${i + 1} of ${total}`}
        >
          <Sun
            aria-hidden="true"
            className={`w-5 h-5 ${i < completed ? 'text-yellow-500' : 'text-gray-400'}`}
          />
        </span>
      ))}
      {total > 0 && completed === total && (
        <Flower role="img" aria-label="Bloom" className="w-5 h-5 text-green-600 bloom-pop" />
      )}
    </div>
  )
}
