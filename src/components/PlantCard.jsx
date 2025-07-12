import { Link } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'

export default function PlantCard({ plant }) {
  const { markWatered } = usePlants()

  const handleWatered = () => markWatered(plant.id)

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white">
      <Link to={`/plant/${plant.id}`}
        className="block mb-2">
        <img src={plant.image} alt={plant.name} loading="lazy" className="w-full h-48 object-cover rounded-md" />
        <h2 className="font-semibold text-lg mt-2">{plant.name}</h2>
      </Link>
      <p className="text-sm text-gray-600">Last watered: {plant.lastWatered}</p>
      <p className="text-sm text-green-700 font-medium">Next: {plant.nextWater}</p>
      <button
        onClick={handleWatered}
        className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
      >
        Mark as Watered
      </button>
    </div>
  )
}
