import { useParams, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import BalconyPlantCard from '../components/BalconyPlantCard.jsx'

import { usePlants } from '../PlantContext.jsx'
import { createRipple } from '../utils/interactions.js'
import PageHeader from '../components/PageHeader.jsx'
import PageContainer from "../components/PageContainer.jsx"
import FilterPills from '../components/FilterPills.jsx'

export default function RoomList() {
  const { roomName } = useParams()
  const location = useLocation()
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
        <div className="space-y-8">
          {sorted.map(plant => (
            <Link
              key={plant.id}
              to={`/room/${encodeURIComponent(roomName)}/plant/${plant.id}`}
              state={{ from: location.pathname }}
              className="block transition-transform active:shadow"
              onMouseDown={createRipple}
              onTouchStart={createRipple}
            >
              <BalconyPlantCard plant={plant} />
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
