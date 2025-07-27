import { useParams, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { SquaresFour, ListBullets, MagnifyingGlass } from 'phosphor-react'
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
  const [view, setView] = useState('list')
  const [query, setQuery] = useState('')
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

  const search = query.trim().toLowerCase()
  const filtered = search
    ? sorted.filter(p => (p.name || '').toLowerCase().includes(search))
    : sorted

  return (
    <PageContainer>
      <PageHeader title={roomName} breadcrumb={{ room: roomName }} />
      {list.length > 0 && (
        <div className="my-4">
          <label htmlFor="room-search" className="sr-only">Search Plants</label>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
            <input
              id="room-search"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search plants"
              className="w-full rounded-full border bg-gray-100 dark:bg-gray-800 py-2 pl-10 pr-3 focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>
        </div>
      )}
      {list.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <FilterPills
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'name', label: 'Name' },
              { value: 'status', label: 'Watering Status' },
              { value: 'recent', label: 'Recently Added' },
            ]}
          />
          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={`border rounded p-1 ${
                view === 'grid'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'text-gray-600 dark:text-gray-200'
              }`}
              aria-label="Grid view"
            >
              <SquaresFour className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              className={`border rounded p-1 ${
                view === 'list'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'text-gray-600 dark:text-gray-200'
              }`}
              aria-label="List view"
            >
              <ListBullets className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
      {list.length === 0 ? (
        <p>No plants in this room.</p>
      ) : (
        <div className={view === 'grid' ? 'grid gap-4 pb-24' : 'space-y-8'} style={view === 'grid' ? { gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gridAutoRows: '1fr' } : {}}>
          {filtered.map(plant => (
            <Link
              key={plant.id}
              to={`/room/${encodeURIComponent(roomName)}/plant/${plant.id}`}
              state={{ from: location.pathname }}
              className="block transition-transform active:shadow"
              onMouseDown={createRipple}
              onTouchStart={createRipple}
            >
              {view === 'grid' ? (
                <img
                  src={plant.image || plant.placeholderSrc}
                  alt={plant.name}
                  className="aspect-[3/4] object-cover w-full h-full rounded-xl"
                  loading="lazy"
                />
              ) : (
                <BalconyPlantCard plant={plant} />
              )}
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
