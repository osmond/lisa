import { Link } from 'react-router-dom'
import { PlusIcon } from '@radix-ui/react-icons'
import { FolderSimple } from 'phosphor-react'
import { useRooms } from '../RoomContext.jsx'
import { usePlants } from '../PlantContext.jsx'

export default function MyPlants() {
  const { rooms } = useRooms()
  const { plants } = usePlants()

  const countPlants = room => plants.filter(p => p.room === room).length

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
        {rooms.map(room => (
          <Link
            key={room}
            to={`/room/${encodeURIComponent(room)}`}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow space-y-1"
          >
            <FolderSimple className="w-6 h-6 text-gray-500" aria-hidden="true" />
            <p className="font-semibold font-headline">{room}</p>
            <p className="text-xs text-gray-500">{countPlants(room)} plants</p>
          </Link>
        ))}
        <Link
          to="/room/add"
          aria-label="Add Room"
          className="flex items-center justify-center w-full h-40 rounded-lg border-2 border-dashed text-gray-500"
        >
          <PlusIcon className="w-10 h-10" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
