import { Link } from 'react-router-dom'
import { FolderSimple, Plus } from 'phosphor-react'
import { getNextWateringDate } from '../utils/watering.js'
import { useRooms } from '../RoomContext.jsx'
import { usePlants } from '../PlantContext.jsx'

export default function MyPlants() {
  const { rooms } = useRooms()
  const { plants } = usePlants()

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

  if (rooms.length === 0) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold font-headline">My Plants</h1>
        <Link
          to="/room/add"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Room
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-headline mb-4">My Plants</h1>
      <div className="grid grid-cols-2 gap-4">
        {rooms.map(room => {
          const overdue = countOverdue(room)
          return (
            <Link
              key={room}
              to={`/room/${encodeURIComponent(room)}`}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow space-y-1"
            >
              <FolderSimple
                className="w-6 h-6 p-1 rounded bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                aria-hidden="true"
              />
              <p className="font-semibold font-headline text-[1.1rem]">{room}</p>
              <p className="text-[10px] text-gray-500">{countPlants(room)} plants</p>
              {overdue > 0 && (
                <span className="slide-in inline-flex text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                  ⚠️ {overdue} overdue
                </span>
              )}
            </Link>
          )
        })}
        <Link
          to="/room/add"
          aria-label="Add Room"
          className="flex items-center justify-center w-full h-40 rounded-lg border-2 border-dashed text-gray-500"
        >
          <Plus className="w-10 h-10" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
