import Badge from './Badge.jsx'
import { Sun, Leaf } from 'phosphor-react'
import { formatDaysAgo } from '../utils/dateFormat.js'

export default function BalconyPlantCard({ plant }) {
  const today = new Date()
  const daysUntil = plant.nextWater
    ? Math.ceil((new Date(plant.nextWater) - today) / 86400000)
    : null
  const overdue = daysUntil != null && daysUntil <= 0
  const src =
    typeof plant.image === 'string' && plant.image.trim() !== ''
      ? plant.image
      : plant.placeholderSrc

  return (
    <div className="relative h-64 rounded-3xl overflow-hidden shadow">
      <img
        src={src}
        alt={plant.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
        aria-hidden="true"
      ></div>
      {overdue && (
        <Badge
          className="absolute top-2 left-2"
          colorClass="bg-yellow-200 text-yellow-900"
          size="sm"
        >
          Thirsty!
        </Badge>
      )}
      <div className="absolute bottom-2 left-3 right-3 text-white drop-shadow space-y-0.5 text-left">
        <h3 className="font-headline font-bold text-xl leading-none text-left">
          {plant.name}
        </h3>
        <p className="text-sm text-left">Last watered {formatDaysAgo(plant.lastWatered)}</p>
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
          {plant.difficulty && (
            <Badge
              Icon={Leaf}
              size="sm"
              colorClass="bg-black/40 text-white backdrop-blur-sm"
            >
              {plant.difficulty}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
