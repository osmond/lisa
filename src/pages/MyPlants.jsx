import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'

export default function MyPlants() {
  const { plants } = usePlants()
  const [roomFilter, setRoomFilter] = useState('All')
  const [lightFilter, setLightFilter] = useState('All')
  const [urgencyFilter, setUrgencyFilter] = useState('All')

  const rooms = [...new Set(plants.map(p => p.room).filter(Boolean))]
  const lights = [...new Set(plants.map(p => p.light).filter(Boolean))]
  const urgencies = [...new Set(plants.map(p => p.urgency).filter(Boolean))]

  const base = (process.env.VITE_BASE_PATH || '/').replace(/\/$/, '')

  const filtered = plants.filter(p =>
    (roomFilter === 'All' || p.room === roomFilter) &&
    (lightFilter === 'All' || p.light === lightFilter) &&
    (urgencyFilter === 'All' || p.urgency === urgencyFilter)
  )

  return (
    <div>
      <h1 className="text-2xl font-bold font-display mb-4">My Plants</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <select className="border rounded p-1" value={roomFilter} onChange={e => setRoomFilter(e.target.value)}>
          <option value="All">All Rooms</option>
          {rooms.map(room => (
            <option key={room} value={room}>{room}</option>
          ))}
        </select>
        <select className="border rounded p-1" value={lightFilter} onChange={e => setLightFilter(e.target.value)}>
          <option value="All">All Light Levels</option>
          {lights.map(light => (
            <option key={light} value={light}>{light}</option>
          ))}
        </select>
        <select className="border rounded p-1" value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)}>
          <option value="All">All Urgencies</option>
          {urgencies.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(plant => {
          const src = plant.image || `${base}/placeholder.svg`
          return (
            <Link key={plant.id} to={`/plant/${plant.id}`} className="block">
              <img
                src={src}
                alt={plant.name}
                loading="lazy"
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="mt-1 text-center text-sm">{plant.name}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
