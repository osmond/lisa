import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWeather } from '../WeatherContext.jsx'
import {
  Flower,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
} from 'phosphor-react'


import useINatPhoto from '../hooks/useINatPhoto.js'
import usePlantFact from '../hooks/usePlantFact.js'
import { createRipple } from '../utils/interactions.js'
import Badge from './Badge.jsx'



export default function FeaturedCard({ plants = [], task, startIndex = 0 }) {
  const items = plants.length ? plants : task ? [task] : []
  if (!items.length) return null

  const [index, setIndex] = useState(startIndex)
  const location = useLocation()
  const { forecast } = useWeather() || {}
  const weatherIcons = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
    Drizzle: CloudRain,
    Thunderstorm: CloudLightning,
    Snow: CloudSnow,
    Mist: CloudFog,
    Fog: CloudFog,
  }
  const WeatherIcon = forecast
    ? weatherIcons[forecast.condition] || Sun
    : null


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
  const todayIso = new Date().toISOString().slice(0, 10)
  const caredToday =
    plant.lastWatered === todayIso || plant.lastFertilized === todayIso
  const needsCareToday =
    (plant.nextWater && plant.nextWater <= todayIso) ||
    (plant.nextFertilize && plant.nextFertilize <= todayIso)
  const preview =
    caredToday && !needsCareToday
      ? `${name} is all set today!`
      : [plant.light, plant.difficulty].filter(Boolean).join(' \u00B7 ')
  const imageSrc =
    (plant.photos && plant.photos[0]?.src) ||
    plant.image ||
    placeholder?.src
  const { fact } = usePlantFact(name)

  return (
    <Link
      to={`/plant/${id}`}
      state={{ from: location.pathname }}
      data-testid="featured-card"
      aria-label={`Featured plant card for ${name}`}
      onKeyDown={handleKeyDown}


      onPointerDown={createRipple}


      className="relative block overflow-hidden rounded-3xl shadow bg-sage dark:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      <img
        src={imageSrc}
        alt={name}
        className="w-full h-64 object-cover brightness-90"
      />
      <div className="featured-overlay" aria-hidden="true"></div>
      <div className="absolute bottom-3 left-4 right-4 text-white space-y-1 drop-shadow-md">
        <Badge
          Icon={Flower}
          colorClass="bg-black/60 text-white backdrop-blur-sm"
          className="uppercase tracking-wide opacity-90"
        >
          Featured Plant of the Day
        </Badge>

        <h2 className="font-display text-3xl font-bold">{name}</h2>
        {preview && (
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-200">{preview}</p>
            {WeatherIcon && (
              <WeatherIcon
                aria-label={`Weather: ${forecast?.condition}`}
                className="w-4 h-4"
              />
            )}
          </div>
        )}
        {preview && fact && <hr className="border-white/30" />}
        {fact && (
          <p className="text-sm italic text-white/90 max-w-prose">{fact}</p>
        )}
        {/* Action buttons were removed to keep the card minimal */}

      </div>
    </Link>
  )
}
