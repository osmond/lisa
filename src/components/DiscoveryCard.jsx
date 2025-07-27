import Badge from './Badge.jsx'
import { Sun, Leaf } from 'phosphor-react'
import { createRipple } from '../utils/interactions.js'
import usePlaceholderPhoto from '../hooks/usePlaceholderPhoto.js'

export default function DiscoveryCard({ plant, onAdd }) {
  if (!plant) return null
  const placeholder = usePlaceholderPhoto(plant.name)
  const src =
    plant.image && !plant.image.includes('placeholder.svg')
      ? plant.image
      : placeholder?.src
  return (
    <div className="relative h-64 rounded-3xl overflow-hidden shadow">
      <img
        src={src}
        alt={plant.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="img-gradient-overlay" aria-hidden="true" />
      <div className="absolute bottom-2 left-3 right-3 text-white drop-shadow space-y-1 text-left">
        <div className="hero-name-bg">
          <h3 className="font-headline font-extrabold text-xl leading-none">
            {plant.name}
          </h3>
          {plant.origin && (
            <p className="text-sm leading-none">Origin: {plant.origin}</p>
          )}
          <div className="flex gap-1 flex-wrap">
            {plant.light && (
              <Badge
                Icon={Sun}
                size="sm"
                colorClass="bg-black/40 text-white backdrop-blur-sm"
              >
                {plant.light}
              </Badge>
            )}
            {plant.humidity && (
              <Badge
                Icon={Leaf}
                size="sm"
                colorClass="bg-black/40 text-white backdrop-blur-sm"
              >
                {plant.humidity}
              </Badge>
            )}
            {plant.difficulty && (
              <Badge size="sm" colorClass="bg-black/40 text-white backdrop-blur-sm">
                {plant.difficulty}
              </Badge>
            )}
          </div>
          <button
            type="button"
            onMouseDown={createRipple}
            onTouchStart={createRipple}
            onClick={() => onAdd?.(plant)}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded relative overflow-hidden"
          >
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  )
}
