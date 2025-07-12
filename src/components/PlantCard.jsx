export default function PlantCard({ plant }) {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white">
      <img src={plant.image} alt={plant.name} className="w-full h-48 object-cover rounded-md mb-2" />
      <h2 className="font-semibold text-lg">{plant.name}</h2>
      <p className="text-sm text-gray-600">Last watered: {plant.lastWatered}</p>
      <p className="text-sm text-green-700 font-medium">Next: {plant.nextWater}</p>
      <button className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
        Mark as Watered
      </button>
    </div>
  )
}
