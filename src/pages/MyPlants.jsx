import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'
import Button from "../components/Button.jsx"

export default function MyPlants() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()

  const [view, setView] = useState('Plants')
  const [roomFilter, setRoomFilter] = useState('All')
  const [lightFilter, setLightFilter] = useState('All')
  const [urgencyFilter, setUrgencyFilter] = useState('All')

  const lights = [...new Set(plants.map(p => p.light).filter(Boolean))]
  const urgencies = [...new Set(plants.map(p => p.urgency).filter(Boolean))]
  const weather = { rainTomorrow: weatherCtx?.forecast?.rainfall || 0 }
  const todayIso = new Date().toISOString().slice(0, 10)

  const rooms = [...new Set(plants.map(p => p.room || 'Unassigned'))]
  const roomData = rooms.map(room => {
    const list = plants.filter(p => (p.room || 'Unassigned') === room)
    const taskCount = list.reduce((count, p) => {
      let c = 0
      if (p.lastWatered) {
        const { date } = getNextWateringDate(p.lastWatered, weather)
        if (date <= todayIso) c++
      }
      if (p.nextFertilize && p.nextFertilize <= todayIso) c++
      return count + c
    }, 0)
    return { room, plants: list, taskCount }
  })

  const filtered = plants.filter(
    p =>
      (roomFilter === 'All' || p.room === roomFilter) &&
      (lightFilter === 'All' || p.light === lightFilter) &&
      (urgencyFilter === 'All' || p.urgency === urgencyFilter)
  )
  const noResults = filtered.length === 0

  const images = plants.flatMap(p => [p.image, ...(p.photos || []).map(ph => (typeof ph === 'object' ? ph.src : ph))])

  return (
    <div>
      <h1 className="text-headline leading-heading tracking-heading font-bold font-display mb-4">My Plants</h1>

      <div className="flex justify-center gap-2 mb-4">
        {['Sites', 'Plants', 'Pictures'].map(v => (
          <Button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`px-3 py-1 rounded-full text-sm ${view === v ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {v}
          </Button>
        ))}
      </div>

      {view === 'Plants' && (
        <>
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
          {noResults ? (
            <p className="text-gray-700">No plants yet. Add one to get started!</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map(plant => (
                <Link key={plant.id} to={`/plant/${plant.id}`} className="block">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    loading="lazy"
                    className="w-full h-40 object-cover rounded-lg"
                    onError={e => (e.target.src = '/placeholder.svg')}
                  />
                  <p className="mt-1 text-center text-sm">{plant.name}</p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {view === 'Sites' && (
        <div className="space-y-4">
          {roomData.map(r => (
            <div key={r.room} className="border rounded-xl p-3 shadow-sm">
              <div className="flex justify-between items-center mb-2">

                <h2 className="font-semibold text-subhead">{r.room}</h2>
                <span className="px-2 py-0.5 text-xs rounded-full bg-soft-leaf text-primary-green-dark">{r.taskCount} tasks</span>

              </div>
              <div className="grid grid-cols-2 gap-1">
                {r.plants.slice(0, 4).map(p => (
                  <Link key={p.id} to={`/plant/${p.id}`} className="block">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-24 object-cover rounded"
                      onError={e => (e.target.src = '/placeholder.svg')}
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'Pictures' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Plant ${i + 1}`}
              loading="lazy"
              className="w-full h-32 object-cover rounded"
              onError={e => (e.target.src = '/placeholder.svg')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
