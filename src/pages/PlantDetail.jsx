import { useParams } from 'react-router-dom'
import plants from '../plants.json'

export default function PlantDetail() {
  const { id } = useParams()
  const plant = plants.find(p => p.id === Number(id))

  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  return (
    <div className="space-y-2">
      <img src={plant.image} alt={plant.name} className="w-full h-48 object-cover rounded" />
      <h1 className="text-2xl font-bold">{plant.name}</h1>
      <p>Last watered: {plant.lastWatered}</p>
      <p>Next water: {plant.nextWater}</p>
    </div>
  )
}
