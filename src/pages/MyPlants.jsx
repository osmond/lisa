import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Drop, Bug, Heart } from 'phosphor-react'
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

export default function MyPlants() {
  const { rooms } = useRooms()
  const { plants } = usePlants()

  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const search = query.trim().toLowerCase()
  const filteredPlants = search
    ? plants.filter(p => p.name.toLowerCase().includes(search))
    : plants

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
        <PageHeader title="All Plants" />
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
      <PageHeader title="All Plants" />
      <div className="my-4">
        <label htmlFor="plant-search" className="sr-only">Search Plants</label>
        <input
          id="plant-search"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search plants"
          className="w-full border rounded p-2"
        />
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
      <CreateFab />
    </PageContainer>
  )
}
