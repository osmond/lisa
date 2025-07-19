import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Drop, Sun, Gauge } from 'phosphor-react'

import { usePlants } from '../PlantContext.jsx'
import { formatDaysAgo } from '../utils/dateFormat.js'
import { createRipple } from '../utils/interactions.js'
import PageHeader from '../components/PageHeader.jsx'
import Badge from '../components/Badge.jsx'
import PageContainer from "../components/PageContainer.jsx"
import Card from '../components/Card.jsx'

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
      <PageHeader title={roomName} breadcrumb={{ room: roomName }} />
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
                : plant.placeholderSrc
            const daysUntil = plant.nextWater
              ? Math.ceil((new Date(plant.nextWater) - today) / 86400000)
              : null
            const needsWater = daysUntil != null && daysUntil <= 0
            const status = needsWater
              ? 'Needs water'
              : `Last watered ${formatDaysAgo(plant.lastWatered)}`
            const colorClass = needsWater
              ? 'bg-red-100 text-red-700'
              : 'bg-black/40 text-white backdrop-blur-sm'
            return (
              <Link
                key={plant.id}
                to={`/room/${encodeURIComponent(roomName)}/plant/${plant.id}`}
                className="block transition-transform hover:-translate-y-1 active:shadow"
                onMouseDown={createRipple}
                onTouchStart={createRipple}
              >
                <Card className="relative overflow-hidden hover:shadow-lg">
                  <img
                    src={src}
                    alt={plant.name}
                    loading="lazy"
                    className="plant-thumb"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"
                    aria-hidden="true"
                  ></div>
                  <span className="absolute top-1 left-1 bg-black/40 text-white text-xs px-1 rounded">
                    {plant.name}
                  </span>
                  <div className="absolute bottom-1 left-1 flex flex-wrap gap-1">
                    <Badge
                      Icon={Drop}
                      size="sm"
                      colorClass={`${colorClass} text-xs rounded-full`}
                    >
                      {status}
                    </Badge>
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
                        Icon={Gauge}
                        size="sm"
                        colorClass="bg-black/40 text-white backdrop-blur-sm"
                      >
                        {plant.difficulty}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
