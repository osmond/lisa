import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from './ActionIcons.jsx'
import useRipple from '../utils/useRipple.js'


export default function TaskItem({ task, onComplete }) {
  const { markWatered } = usePlants()
  const navigate = useNavigate()
  const Icon = actionIcons[task.type]
  const startX = useRef(0)
  const [deltaX, setDeltaX] = useState(0)
  const [showCheck, setShowCheck] = useState(false)
  const [, createRipple] = useRipple()

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task)
    } else if (task.type === 'Water') {
      const note = window.prompt('Optional note') || ''
      markWatered(task.plantId, note)
    }
    setShowCheck(true)
    setTimeout(() => setShowCheck(false), 400)
  }

  const handlePointerDown = e => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
  }

  const handlePointerMove = e => {
    if (!startX.current) return
    const currentX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    setDeltaX(currentX - startX.current)
  }

  const handlePointerEnd = e => {
    const currentX = e?.clientX ?? e?.changedTouches?.[0]?.clientX ?? startX.current
    const diff = deltaX || (currentX - startX.current)
    setDeltaX(0)
    startX.current = 0
    if (diff > 75) {
      handleComplete()
    } else if (diff < -75) {
      navigate(`/plant/${task.plantId}/edit`)
    }
  }

  return (
    <div
      onMouseDown={e => { createRipple(e); handlePointerDown(e) }}
      onTouchStart={e => { createRipple(e); handlePointerDown(e) }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerEnd}
      className="relative flex items-center gap-2 p-2 border rounded-2xl bg-white dark:bg-gray-800 overflow-hidden"
      style={{ transform: `translateX(${deltaX}px)`, transition: deltaX === 0 ? 'transform 0.2s' : 'none' }}
    >
      <Link to={`/plant/${task.plantId}`} className="flex items-center flex-1 gap-1">
        <img
          src={task.image}
          alt={task.plantName}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="flex-1">
          <p className="font-medium">
            {task.type} {task.plantName}
          </p>
          {task.reason && (
            <p className="text-xs text-gray-500">{task.reason}</p>
          )}
        </div>
        {Icon && <Icon />}
      </Link>
      <button
        onMouseDown={createRipple}
        onTouchStart={createRipple}
        onClick={handleComplete}
        className="ml-2 px-3 py-1 bg-green-100 text-green-700 rounded text-sm relative overflow-hidden"
      >
        Done
      </button>
      {showCheck && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="w-8 h-8 text-green-600 check-pop"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      )}
    </div>
  )
}
