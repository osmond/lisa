import { Link } from 'react-router-dom'
import { Flower } from 'phosphor-react'
import { PlusIcon } from '@radix-ui/react-icons'
import { usePlants } from '../PlantContext.jsx'

export default function MyPlants() {
  const { plants } = usePlants()
  const rooms = [...new Set(plants.map(p => p.room || 'Unassigned'))]

  const noResults = plants.length === 0

  return (
    <div>
      <h1 className="text-2xl font-bold font-headline mb-4">My Plants</h1>
      {noResults ? (
        <div className="text-center text-gray-700 space-y-4">
          <Flower className="w-20 h-20 mx-auto text-green-400" aria-hidden="true" />
          <Link
            to="/add"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded"
          >
            Add Plant
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map(room => {
            const plantsInRoom = plants.filter(p => (p.room || 'Unassigned') === room)
            return (
              <details key={room} className="group" open>
                <summary className="cursor-pointer font-semibold font-headline text-lg">
                  {room}
                </summary>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {plantsInRoom.map(plant => {
                    const imageSrc =
                      typeof plant.image === 'string' && plant.image.trim() !== ''
                        ? plant.image
                        : '/demo-image-01.jpg'
                    return (
                      <Link key={plant.id} to={`/plant/${plant.id}`} className="block">
                        <img
                          src={imageSrc}
                          alt={plant.name}
                          loading="lazy"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <p className="mt-1 text-center text-sm font-semibold font-headline">
                          {plant.name}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </details>
            )
          })}
          <Link
            to="/add"
            aria-label="Add Plant"
            className="flex items-center justify-center w-full h-40 rounded-lg border-2 border-dashed text-gray-500 mt-4"
          >
            <PlusIcon className="w-10 h-10" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  )
}
