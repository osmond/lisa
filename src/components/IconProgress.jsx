import { Flower } from 'phosphor-react'
import useRipple from '../utils/useRipple.js'

export default function IconProgress({
  icon: Icon,
  completedColor,
  completed = 0,
  total = 0,
  testId,
  itemTestId,
  itemLabelPrefix
}) {
  const [, createRipple] = useRipple()
  const items = Array.from({ length: total })
  return (
    <div className="flex gap-1" data-testid={testId}>
      {items.map((_, i) => (
        <span
          key={i}
          data-testid={itemTestId}
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          className="relative inline-flex overflow-hidden rounded-full"
          aria-label={`${itemLabelPrefix} ${i + 1} of ${total}`}
          title={`${itemLabelPrefix} ${i + 1} of ${total}`}
        >
          <Icon
            aria-hidden="true"
            className={`w-5 h-5 ${i < completed ? completedColor : 'text-gray-400'}`}
          />
        </span>
      ))}
      {total > 0 && completed === total && (
        <Flower role="img" aria-label="Bloom" className="w-5 h-5 text-green-600 bloom-pop" />
      )}
    </div>
  )
}
