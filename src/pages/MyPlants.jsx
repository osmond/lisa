import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Drop, Sun, Bug, WarningCircle } from 'phosphor-react'
import { getNextWateringDate } from '../utils/watering.js'

import Badge from '../components/Badge.jsx'

import { formatDaysAgo } from '../utils/dateFormat.js'

import { useRooms } from '../RoomContext.jsx'
import { usePlants } from '../PlantContext.jsx'
import { createRipple } from '../utils/interactions.js'
import CreateFab from '../components/CreateFab.jsx'
import PageContainer from "../components/PageContainer.jsx"
import PageHeader from "../components/PageHeader.jsx"
import ImageCard from '../components/ImageCard.jsx'

export default function MyPlants() {
  const { rooms } = useRooms()
  const { plants } = usePlants()

  const [sortBy, setSortBy] = useState('name')
  const [needsLoveOnly, setNeedsLoveOnly] = useState(false)

  const countPlants = room => plants.filter(p => p.room === room).length
  const todayIso = new Date().toISOString().slice(0, 10)
  const countOverdue = room =>
    plants
      .filter(p => p.room === room)
      .reduce((m, p) => {
        const { date } = getNextWateringDate(p.lastWatered)
        if (date < todayIso) m += 1
        if (p.nextFertilize && p.nextFertilize < todayIso) m += 1
        return m
      }, 0)


  const sortedRooms = [...rooms]
    .filter(r => !needsLoveOnly || countOverdue(r) > 0)
    .sort((a, b) => {
      if (sortBy === 'name') return a.localeCompare(b)
      return countPlants(b) - countPlants(a)
    })

  const roomStats = room => {
    const list = plants.filter(p => p.room === room)
    const wateredToday = list.some(p => p.lastWatered === todayIso)
    const lowLight = list.some(p => (p.light || '').toLowerCase().includes('low'))
    const pestAlert = list.some(p => p.pestAlert)
    const lastUpdated = list.reduce((latest, p) => {
      const dates = [p.lastWatered, p.lastFertilized].filter(Boolean)
      for (const d of dates) {
        if (!latest || d > latest) latest = d
      }
      return latest
    }, '')
    return { wateredToday, lowLight, pestAlert, lastUpdated }
  }


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
      <div className="flex items-center gap-4 mb-2">
        <label className="text-sm">
          Sort
          <select
            className="ml-1 border rounded p-1"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="count"># Plants</option>
          </select>
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={needsLoveOnly}
            onChange={e => setNeedsLoveOnly(e.target.checked)}
          />
          Needs Love
        </label>
      </div>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))',
          gridAutoRows: '1fr',
        }}
      >
        {sortedRooms.map((room, i) => {
          const overdue = countOverdue(room)

          const { wateredToday, lowLight, pestAlert, lastUpdated } = roomStats(room)

          const first = plants.find(p => p.room === room)
          const thumbnail = first?.image || first?.placeholderSrc


          return (
            <Link
              key={room}
              to={`/room/${encodeURIComponent(room)}`}
              className="animate-fade-in-up h-full transition-transform hover:-translate-y-1 active:shadow"
              style={{ animationDelay: `${i * 50}ms` }}
              onMouseDown={createRipple}
              onTouchStart={createRipple}
            >
              <ImageCard
                as="div"
                imgSrc={thumbnail}
                title={
                  <>
                    <p className="font-bold text-lg font-headline leading-none">{room}</p>
                    <p className="text-sm text-gray-500 leading-none">{countPlants(room)} plants</p>
                  </>
                }
                className="space-y-2 hover:shadow-lg h-full flex flex-col"
              >
                <div className="flex gap-1 text-badge">
                  {wateredToday && <Drop className="w-4 h-4" aria-hidden="true" />}
                  {lowLight && <Sun className="w-4 h-4" aria-hidden="true" />}
                  {pestAlert && <Bug className="w-4 h-4" aria-hidden="true" />}
                  {lastUpdated && <span>{formatDaysAgo(lastUpdated)}</span>}
                </div>
                {overdue > 0 && (
                  <Badge
                    variant="overdue"
                    colorClass="slide-in animate-pulse rounded-full text-badge"
                    Icon={WarningCircle}
                  >
                    {overdue} needs love
                  </Badge>
                )}
              </ImageCard>
            </Link>
          )
        })}
        <Link
          to="/room/add"
          aria-label="Add Room"
          className="flex items-center justify-center h-full min-h-[160px] rounded-lg border-2 border-dashed text-gray-500 animate-fade-in-up"
          style={{ animationDelay: `${sortedRooms.length * 50}ms` }}
        >
          <Plus className="w-10 h-10" aria-hidden="true" />
        </Link>
      </div>
      <CreateFab />
    </PageContainer>
  )
}
