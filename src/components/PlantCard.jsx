import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import useRipple from '../utils/useRipple.js'
import { usePlants } from '../PlantContext.jsx'
import FadeInImage from './FadeInImage.jsx'

export default function PlantCard({ plant }) {
  const navigate = useNavigate()
  const { markWatered, removePlant } = usePlants()
  const startX = useRef(0)
  const [deltaX, setDeltaX] = useState(0)
  const [showActions, setShowActions] = useState(false)
  const [, createRipple] = useRipple()

  const handleWatered = () => {
    const note = window.prompt('Optional note') || ''
    markWatered(plant.id, note)
  }

  const handleDelete = () => {
    if (window.confirm('Delete this plant?')) {
      removePlant(plant.id)
    }
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
      handleWatered()
    } else if (diff < -150) {
      handleDelete()
    } else if (diff < -75) {
      navigate(`/plant/${plant.id}/edit`)
    }
  }

  return (
    <div
      data-testid="card-wrapper"
      onMouseDown={e => { createRipple(e); handlePointerDown(e) }}
      onTouchStart={e => { createRipple(e); handlePointerDown(e) }}
      className="relative overflow-hidden group"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerEnd}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerEnd}
      onClick={() => setShowActions(true)}
    >
      <div
        className={`absolute inset-0 flex justify-between items-center px-4 transition
        pointer-events-none opacity-0
        group-hover:opacity-100 group-hover:pointer-events-auto group-hover:animate-fade-in-up
        group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:animate-fade-in-up
        ${showActions ? 'opacity-100 pointer-events-auto animate-fade-in-up' : ''}`}
      >
        <button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={handleWatered}
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden"
        >
          Water
        </button>
        <div className="flex gap-2">
          <button
            onMouseDown={createRipple}
            onTouchStart={createRipple}
            onClick={() => navigate(`/plant/${plant.id}/edit`)}
            className="bg-blue-600 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden"
          >
            Edit
          </button>
          <button
            onMouseDown={createRipple}
            onTouchStart={createRipple}
            onClick={handleDelete}
            className="bg-red-600 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden"
          >
            Delete
          </button>
        </div>
      </div>
      <div
        className="p-4 border rounded-2xl shadow-sm bg-white dark:bg-gray-800"
        style={{ transform: `translateX(${deltaX}px)`, transition: deltaX === 0 ? 'transform 0.2s' : 'none' }}
      >
        <Link to={`/plant/${plant.id}`} className="block mb-2">
          <FadeInImage
            src={plant.image}
            alt={plant.name}
            loading="lazy"
            className="w-full h-48 object-cover rounded-xl"
          />
          <h2 className="font-semibold text-xl font-display mt-2">{plant.name}</h2>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400">Last watered: {plant.lastWatered}</p>
        <p className="text-sm text-green-700 font-medium">Next: {plant.nextWater}</p>
        <button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={handleWatered}
          className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition relative overflow-hidden"
        >
          Watered
        </button>
      </div>
    </div>
  )
}
