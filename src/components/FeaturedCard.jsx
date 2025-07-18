import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useWeather } from '../WeatherContext.jsx'
import { formatCareSummary } from '../utils/date.js'


import useSwipe from '../hooks/useSwipe.js'
import useINatPhoto from '../hooks/useINatPhoto.js'
import { createRipple } from '../utils/interactions.js'



export default function FeaturedCard({ plants = [], task, startIndex = 0 }) {
  const items = plants.length ? plants : task ? [task] : []
  if (!items.length) return null

  const [index, setIndex] = useState(startIndex)
  const { forecast } = useWeather() || {}
  const weatherEmojis = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
  }
  const suggestion = forecast ? weatherEmojis[forecast.condition] || '☀️' : null

  const { dx: deltaX, start, move, end } = useSwipe(diff => {
    if (diff > 50) setIndex(i => (i - 1 + items.length) % items.length)
    else if (diff < -50) setIndex(i => (i + 1) % items.length)
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
  const placeholder = useINatPhoto(name)
  const preview = formatCareSummary(plant.lastWatered, plant.nextWater)
  const imageSrc =
    (plant.photos && plant.photos[0]?.src) ||
    plant.image ||
    placeholder?.src

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


      className="relative block overflow-hidden rounded-3xl shadow bg-sage dark:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      style={{ transform: `translateX(${deltaX}px)`, transition: deltaX === 0 ? 'transform 0.2s' : 'none' }}
    >
      <img
        src={imageSrc}
        alt={name}
        className="w-full h-64 object-cover"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6),rgba(0,0,0,0.2),transparent)]"
        aria-hidden="true"
      ></div>
      <div className="absolute bottom-3 left-4 right-4 text-white space-y-1 drop-shadow">
        <span className="text-xs uppercase tracking-wide opacity-90">🌿 Featured Plant of the Day</span>

        <h2 className="font-display text-2xl font-semibold">{name}</h2>
        {preview && (
          <div className="flex items-center gap-1">
            <p className="text-sm opacity-90">{preview}</p>
            {suggestion && (
              <span aria-label={`Weather: ${forecast?.condition}`}>{suggestion}</span>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={`Mark ${name} as watered`}
            className="px-4 py-2 bg-blue-600 text-white rounded-full shadow text-sm animate-bounce-once"
          >
            Water Now
          </button>
        </div>

      </div>
    </Link>
  )
}
