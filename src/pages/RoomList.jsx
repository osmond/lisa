import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { usePlants } from '../PlantContext.jsx'
import { formatDaysAgo } from '../utils/dateFormat.js'
import { createRipple } from '../utils/interactions.js'

export default function RoomList() {
  const { roomName } = useParams()
  const { plants } = usePlants()
  const [sortBy, setSortBy] = useState('custom')
  const list = plants.filter(p => p.room === roomName)
  const today = new Date()
  const sorted = [...list].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '')
    }
    if (sortBy === 'overdue') {
      const aDiff = a.nextWater ? new Date(a.nextWater) - today : Infinity
      const bDiff = b.nextWater ? new Date(b.nextWater) - today : Infinity
      return aDiff - bDiff
    }
    return a.id - b.id
  })

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Link
          to="/myplants"
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; My Plants
        </Link>
      </div>
      <h1 className="text-2xl font-bold font-headline mb-4">{roomName}</h1>
      {list.length > 0 && (
        <div className="mb-4">
          <label htmlFor="sort" className="mr-2 text-sm font-medium">
            Sort
          </label>
          <select
            id="sort"
            className="dropdown-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="custom">Custom Order</option>
            <option value="name">By Name</option>
            <option value="overdue">By Overdue</option>
          </select>
        </div>
      )}
      {list.length === 0 ? (
        <p>No plants in this room.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {sorted.map(plant => {
            const src =
              typeof plant.image === 'string' && plant.image.trim() !== ''
                ? plant.image
                : '/demo-image-01.jpg'
            return (
              <Link
                key={plant.id}
                to={`/room/${encodeURIComponent(roomName)}/plant/${plant.id}`}
                className="block relative overflow-hidden rounded-lg shadow transition-transform hover:-translate-y-1 hover:shadow-lg active:shadow"
                onMouseDown={createRipple}
                onTouchStart={createRipple}
              >
                <img
                  src={src}
                  alt={plant.name}
                  loading="lazy"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                  Last watered {formatDaysAgo(plant.lastWatered)}
                </span>
                <p className="mt-1 text-center text-sm font-semibold font-headline">
                  {plant.name}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
