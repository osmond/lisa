import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Drop } from 'phosphor-react'

import { usePlants } from '../PlantContext.jsx'
import { formatDaysAgo } from '../utils/dateFormat.js'
import { createRipple } from '../utils/interactions.js'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Badge from '../components/Badge.jsx'
import PageContainer from "../components/PageContainer.jsx"

export default function RoomList() {
  const { roomName } = useParams()
  const { plants } = usePlants()
  const [sortBy, setSortBy] = useState('name')
  const list = plants.filter(p => p.room === roomName)
  const today = new Date()
  const sorted = [...list].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '')
    }
    if (sortBy === 'status') {
      const aDiff = a.nextWater ? new Date(a.nextWater) - today : Infinity
      const bDiff = b.nextWater ? new Date(b.nextWater) - today : Infinity
      return aDiff - bDiff
    }
    if (sortBy === 'recent') {
      return b.id - a.id
    }
    return a.id - b.id
  })

  return (
    <PageContainer>
      <Breadcrumb room={roomName} />
      <h1 className="text-2xl font-bold font-headline mb-4">{roomName}</h1>
      {list.length > 0 && (
        <div>
          <label htmlFor="sort" className="text-sm font-medium">
            Sort
          </label>
          <select
            id="sort"
            className="dropdown-select w-full mt-1"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="status">Watering Status</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      )}
      {list.length === 0 ? (
        <p>No plants in this room.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {sorted.map(plant => {
            const src =
              typeof plant.image === 'string' && plant.image.trim() !== ''
                ? plant.image
                : '/demo-image-01.jpg'
            const daysUntil = plant.nextWater
              ? Math.ceil((new Date(plant.nextWater) - today) / 86400000)
              : null
            const needsWater = daysUntil != null && daysUntil <= 0
            const status = needsWater
              ? 'Needs water'
              : `Last watered ${formatDaysAgo(plant.lastWatered)}`
            const colorClass = needsWater
              ? 'bg-red-100 text-red-700'
              : 'bg-black/50 text-white'
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
                <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                  {plant.name}
                </span>
                <Badge
                  Icon={Drop}
                  colorClass={`absolute bottom-1 left-1 text-xs ${colorClass}`}
                >
                  {status}
                </Badge>
              </Link>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
