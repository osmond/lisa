import PlantCard from '../components/PlantCard'
import plants from '../plants.json'

export default function Home() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Today’s Plant Care</h1>
      <div className="grid gap-4">
        {plants.map(plant => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  )
}
