import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { formatCareSummary } from '../utils/date.js'
import { usePlants } from '../PlantContext.jsx'

export default function FeaturedCard({ plants = [], task, startIndex = 0 }) {
  const items = plants.length ? plants : task ? [task] : []
  if (!items.length) return null

  const [index, setIndex] = useState(startIndex)
  const startX = useRef(0)
  const [dx, setDx] = useState(0)

  const begin = e => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
  }
  const move = e => {
    if (!startX.current) return
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    setDx(x - startX.current)
  }
  const end = e => {
    const x = e?.clientX ?? e?.changedTouches?.[0]?.clientX ?? startX.current
    const diff = dx || (x - startX.current)
    if (diff > 50) setIndex(i => (i - 1 + items.length) % items.length)
    else if (diff < -50) setIndex(i => (i + 1) % items.length)
    setDx(0)
    startX.current = 0
  }

  const { markWatered } = usePlants()

  const plant = items[index]
  const name = plant.plantName || plant.name
  const id = plant.plantId || plant.id
  const preview = formatCareSummary(plant.lastWatered, plant.nextWater)
  const imageSrc = (plant.photos && plant.photos[0]) || plant.image || '/demo-image-01.jpg'

  const today = new Date().toISOString().slice(0, 10)
  const showWaterButton = plant.nextWater && plant.nextWater <= today

  const handleWater = e => {
    e.preventDefault()
    e.stopPropagation()
    markWatered(id, '')
  }

  return (
    <Link
      to={`/plant/${id}`}
      data-testid="featured-card"
      onPointerDown={begin}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      onMouseDown={begin}
      onMouseMove={move}
      onMouseUp={end}
      onTouchStart={begin}
      onTouchMove={move}
      onTouchEnd={end}
      className="relative block overflow-hidden rounded-2xl shadow bg-sage dark:bg-gray-800"
      style={{ transform: `translateX(${dx}px)`, transition: dx === 0 ? 'transform 0.2s' : 'none' }}
    >
      <img
        src={imageSrc}
        alt={name}
        className="w-full h-64 object-cover"
      />
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent text-white space-y-1 backdrop-blur-sm">
        <span className="text-xs uppercase tracking-wide opacity-90">🌿 Featured Plant of the Day</span>

        <h2 className="font-display text-2xl font-semibold">{name}</h2>
        {preview && (
          <p className="text-sm opacity-90">{preview}</p>
        )}
        {showWaterButton && (
          <button
            onClick={handleWater}
            className="mt-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-body text-white pointer-events-auto"
          >
            Water Now
          </button>
        )}

      </div>
    </Link>
  )
}
