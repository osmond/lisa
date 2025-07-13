import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { usePlants } from '../PlantContext.jsx'

export default function PlantCard({ plant }) {
  const navigate = useNavigate()
  const { markWatered, removePlant } = usePlants()
  const startX = useRef(0)
  const [deltaX, setDeltaX] = useState(0)

  const handleWatered = () => {
    const note = window.prompt('Optional note') || ''
    markWatered(plant.id, note)
  }

  const handlePointerDown = e => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
  }

  const handlePointerMove = e => {
    if (!startX.current) return
    const currentX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    setDeltaX(currentX - startX.current)
  }

  const handlePointerEnd = () => {
    const diff = deltaX
    setDeltaX(0)
    startX.current = 0
    if (diff > 75) {
      handleWatered()
    } else if (diff < -150) {
      removePlant(plant.id)
    } else if (diff < -75) {
      navigate(`/plant/${plant.id}/edit`)
    }
  }

  return (
    <div
      data-testid="card-wrapper"
      className="relative"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerEnd}
    >
      <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
        <button
          onClick={handleWatered}
          className="bg-green-600 text-white px-2 py-1 rounded pointer-events-auto"
        >
          Water
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/plant/${plant.id}/edit`)}
            className="bg-blue-600 text-white px-2 py-1 rounded pointer-events-auto"
          >
            Edit
          </button>
          <button
            onClick={() => removePlant(plant.id)}
            className="bg-red-600 text-white px-2 py-1 rounded pointer-events-auto"
          >
            Delete
          </button>
        </div>
      </div>
      <div
        className="p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-800"
        style={{ transform: `translateX(${deltaX}px)`, transition: deltaX === 0 ? 'transform 0.2s' : 'none' }}
      >
        <Link to={`/plant/${plant.id}`} className="block mb-2">
          <img src={plant.image} alt={plant.name} loading="lazy" className="w-full h-48 object-cover rounded-md" />
          <h2 className="font-semibold text-lg mt-2">{plant.name}</h2>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400">Last watered: {plant.lastWatered}</p>
        <p className="text-sm text-green-700 font-medium">Next: {plant.nextWater}</p>
        <button
          onClick={handleWatered}
          className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
        >
          Watered
        </button>
      </div>
    </div>
  )
}
