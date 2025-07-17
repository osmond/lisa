import { Link, useParams } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'

export default function RoomList() {
  const { roomName } = useParams()
  const { plants } = usePlants()
  const list = plants.filter(p => p.room === roomName)

  return (
    <div>
      <h1 className="text-2xl font-bold font-headline mb-4">{roomName}</h1>
      {list.length === 0 ? (
        <p>No plants in this room.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {list.map(plant => {
            const src =
              typeof plant.image === 'string' && plant.image.trim() !== ''
                ? plant.image
                : '/demo-image-01.jpg'
            return (
              <Link key={plant.id} to={`/plant/${plant.id}`} className="block">
                <img
                  src={src}
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
      )}
    </div>
  )
}
