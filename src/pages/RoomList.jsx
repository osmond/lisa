import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Drop, Sun, Gauge } from 'phosphor-react'

import { usePlants } from '../PlantContext.jsx'
import { formatDaysAgo } from '../utils/dateFormat.js'
import { createRipple } from '../utils/interactions.js'
import PageHeader from '../components/PageHeader.jsx'
import Badge from '../components/Badge.jsx'
import PageContainer from "../components/PageContainer.jsx"
import ImageCard from '../components/ImageCard.jsx'
import FilterPills from '../components/FilterPills.jsx'

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
        <FilterPills
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'name', label: 'Name' },
            { value: 'status', label: 'Watering Status' },
            { value: 'recent', label: 'Recently Added' },
          ]}
        />
      )}
      {list.length === 0 ? (
        <p>No plants in this room.</p>
      ) : (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))',
            gridAutoRows: '1fr',
          }}
        >
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
                className="block h-full transition-transform hover:-translate-y-1 active:shadow"
                onMouseDown={createRipple}
                onTouchStart={createRipple}
              >
                <ImageCard
                  as="div"
                  imgSrc={src}
                  title={plant.name}
                  badges={[
                    <Badge
                      key="status"
                      Icon={Drop}
                      size="sm"
                      colorClass={`${colorClass} text-xs rounded-full`}
                    >
                      {status}
                    </Badge>,
                    plant.light && (
                      <Badge
                        key="light"
                        Icon={Sun}
                        size="sm"
                        colorClass="bg-black/40 text-white backdrop-blur-sm"
                      >
                        {plant.light}
                      </Badge>
                    ),
                    plant.difficulty && (
                      <Badge
                        key="diff"
                        Icon={Gauge}
                        size="sm"
                        colorClass="bg-black/40 text-white backdrop-blur-sm"
                      >
                        {plant.difficulty}
                      </Badge>
                    ),
                  ]}
                  className="hover:shadow-lg h-full flex flex-col"
                />
              </Link>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
