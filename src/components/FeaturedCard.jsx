import { Link } from 'react-router-dom'
import { useState } from 'react'
import { formatCareSummary } from '../utils/date.js'


import useSwipe from '../hooks/useSwipe.js'
import { createRipple } from '../utils/interactions.js'



export default function FeaturedCard({ plants = [], task, startIndex = 0 }) {
  const items = plants.length ? plants : task ? [task] : []
  if (!items.length) return null

  const [index, setIndex] = useState(startIndex)

  const { deltaX: dx, handlers } = useSwipe({
    ripple: true,
    onEnd: diff => {
      if (diff > 50) setIndex(i => (i - 1 + items.length) % items.length)
      else if (diff < -50) setIndex(i => (i + 1) % items.length)
    },
  })

  const handleKeyDown = e => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setIndex(i => (i + 1) % items.length)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setIndex(i => (i - 1 + items.length) % items.length)
    }
  }


  const plant = items[index]
  const name = plant.plantName || plant.name
  const id = plant.plantId || plant.id
  const preview = formatCareSummary(plant.lastWatered, plant.nextWater)
  const imageSrc = (plant.photos && plant.photos[0]) || plant.image || '/demo-image-01.jpg'

  return (
    <Link
      to={`/plant/${id}`}
      data-testid="featured-card"
      aria-label={`Featured plant card for ${name}`}
      onKeyDown={handleKeyDown}


      onPointerDown={e => { createRipple(e); start(e) }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      onMouseDown={start}
      onMouseMove={move}
      onMouseUp={end}
      onTouchStart={start}
      onTouchMove={move}
      onTouchEnd={end}


      className="relative block overflow-hidden rounded-2xl shadow bg-sage dark:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
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

      </div>
    </Link>
  )
}
