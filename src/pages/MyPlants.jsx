import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Drop,
  Bug,
  Heart,
  SquaresFour,
  ListBullets,
  MagnifyingGlass,
} from 'phosphor-react'
import { getNextWateringDate } from '../utils/watering.js'

import Badge from '../components/Badge.jsx'

import { formatDaysAgo } from '../utils/dateFormat.js'

import { useRooms } from '../RoomContext.jsx'
import { usePlants } from '../PlantContext.jsx'
import { createRipple } from '../utils/interactions.js'
import FilterPills from '../components/FilterPills.jsx'
import CreateFab from '../components/CreateFab.jsx'
import PageContainer from "../components/PageContainer.jsx"
import PageHeader from "../components/PageHeader.jsx"
import BalconyPlantCard from '../components/BalconyPlantCard.jsx'

export default function MyPlants() {
  const { rooms } = useRooms()
  const { plants } = usePlants()
  const totalPlants = plants.length
  const speciesOptions = Array.from(new Set(plants.map(p => p.name))).sort()

  const [filter, setFilter] = useState('love')
  const [query, setQuery] = useState('')
  const [roomFilter, setRoomFilter] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('')
  const [view, setView] = useState('grid')

  const search = query.trim().toLowerCase()
  let filteredPlants = plants
  if (search) {
    filteredPlants = filteredPlants.filter(p =>
      p.name.toLowerCase().includes(search),
    )
  }
  if (roomFilter) {
    filteredPlants = filteredPlants.filter(p => p.room === roomFilter)
  }
  if (speciesFilter) {
    filteredPlants = filteredPlants.filter(p => p.name === speciesFilter)
  }

  const countPlants = room => filteredPlants.filter(p => p.room === room).length
  const todayIso = new Date().toISOString().slice(0, 10)
  const countOverdue = room =>
    filteredPlants
      .filter(p => p.room === room)
      .reduce((m, p) => {
        const { date } = getNextWateringDate(p.lastWatered)
        if (date < todayIso) m += 1
        if (p.nextFertilize && p.nextFertilize < todayIso) m += 1
        return m
      }, 0)

  const roomStats = room => {
    const list = filteredPlants.filter(p => p.room === room)
    const wateredToday = list.some(p => p.lastWatered === todayIso)
    const pestAlert = list.some(p => p.pestAlert)
    const lastUpdated = list.reduce((latest, p) => {
      const dates = [p.lastWatered, p.lastFertilized].filter(Boolean)
      for (const d of dates) {
        if (!latest || d > latest) latest = d
      }
      return latest
    }, '')
    return { wateredToday, pestAlert, lastUpdated }
  }

  const sortedRooms = [...rooms]
    .filter(r => countPlants(r) > 0)
    .filter(r => filter !== 'love' || countOverdue(r) > 0)
    .sort((a, b) => {
      if (filter === 'newest') return countPlants(b) - countPlants(a)
      if (filter === 'recent') {
        const aDate = roomStats(a).lastUpdated || ''
        const bDate = roomStats(b).lastUpdated || ''
        return bDate.localeCompare(aDate)
      }
      return a.localeCompare(b)
    })


  if (rooms.length === 0) {
    return (
      <div className="text-center space-y-4">
        <PageHeader title="All Plants" subtitle={`${totalPlants} total`} />
        <Link
          to="/room/add"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Room
        </Link>
        <CreateFab />
      </div>
    )
  }

  return (
    <PageContainer>
      <PageHeader title="All Plants" subtitle={`${totalPlants} total`} />
      <div className="my-4">
        <label htmlFor="plant-search" className="sr-only">Search Plants</label>
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
          <input
            id="plant-search"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search plants"
            className="w-full rounded-full border bg-gray-100 dark:bg-gray-800 py-2 pl-10 pr-3 focus:ring-2 focus:ring-green-600 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <label className="text-sm flex items-center gap-1">
          Room:
          <select
            value={roomFilter}
            onChange={e => setRoomFilter(e.target.value)}
            className="border rounded p-1 text-sm"
          >
            <option value="">All</option>
            {rooms.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm flex items-center gap-1">
          Species:
          <select
            value={speciesFilter}
            onChange={e => setSpeciesFilter(e.target.value)}
            className="border rounded p-1 text-sm"
          >
            <option value="">All</option>
            {speciesOptions.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-1">
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
      <FilterPills
        value={filter}
        onChange={setFilter}
        options={[
          {
            value: 'all',
            label: 'All',
          },
          {
            value: 'love',
            label: 'Needs Love',
          },
          {
            value: 'recent',
            label: 'Recently Watered',
          },
          {
            value: 'newest',
            label: 'Newest',
          },
        ]}
      />
      {view === 'grid' ? (
        <div
          className="grid gap-4 pb-24"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))',
            gridAutoRows: '1fr',
          }}
        >
          {sortedRooms.map((room, i) => {
            const overdue = countOverdue(room)

          const { wateredToday, pestAlert, lastUpdated } = roomStats(room)

          const previews = filteredPlants
            .filter(p => p.room === room)
            .slice(0, 4)
            .map(p => ({ src: p.image || p.placeholderSrc, name: p.name }))

          const first = filteredPlants.find(p => p.room === room)
          const thumbnail = first?.image || first?.placeholderSrc


          return (
            <Link
              key={room}
              to={`/room/${encodeURIComponent(room)}`}
              className="relative animate-fade-in-up aspect-[3/4] rounded-xl overflow-hidden h-full transition-transform hover:-translate-y-1 active:shadow"
              style={{ animationDelay: `${i * 50}ms` }}
              onMouseDown={createRipple}
              onTouchStart={createRipple}
            >
              <img
                src={thumbnail}
                alt={room}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="img-gradient-overlay" aria-hidden="true"></div>
              {overdue > 0 && (
                <Badge
                  colorClass="bg-red-600/80 text-white backdrop-blur-sm"
                  className="absolute top-3 right-3 slide-in animate-pulse rounded-full text-badge"
                  Icon={Heart}
                >
                  {overdue} needs love
                </Badge>
              )}
              <div className="absolute bottom-2 left-2 right-2 drop-shadow text-white space-y-2 leading-snug">
                {previews.length > 0 && (
                  <div className="flex -space-x-2">
                    {previews.map((p, idx) => (
                      <img
                        key={idx}
                        src={p.src}
                        alt={p.name}
                        className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-gray-700"
                      />
                    ))}
                  </div>
                )}
                <div className="flex gap-1 text-sm text-white/80">
                  {wateredToday && <Drop className="w-4 h-4" aria-hidden="true" />}
                  {pestAlert && <Bug className="w-4 h-4" aria-hidden="true" />}
                </div>
                <p className="font-semibold text-base font-headline">{room}</p>
                <p className="text-sm text-white/70">{countPlants(room)} plants</p>
              </div>
              {lastUpdated && (
                <span className="absolute bottom-2 right-2 text-xs text-white/70">
                  {formatDaysAgo(lastUpdated)}
                </span>
              )}
            </Link>
          )
        })}
        <Link
          to="/room/add"
          aria-label="Add Room"
          className="flex items-center justify-center aspect-[3/4] h-full rounded-xl border-2 border-dashed text-gray-500 animate-fade-in-up"
          style={{ animationDelay: `${sortedRooms.length * 50}ms` }}
        >
          <Plus className="w-10 h-10" aria-hidden="true" />
        </Link>
      </div>
      ) : (
        <div className="space-y-8 pb-24">
          {filteredPlants.map(plant => (
            <Link
              key={plant.id}
              to={plant.room ? `/room/${encodeURIComponent(plant.room)}/plant/${plant.id}` : `/plant/${plant.id}`}
              state={{ from: '/myplants' }}
              className="block transition-transform active:shadow"
              onMouseDown={createRipple}
              onTouchStart={createRipple}
            >
              <BalconyPlantCard plant={plant} />
            </Link>
          ))}
        </div>
      )}
      <CreateFab />
    </PageContainer>
  )
}
