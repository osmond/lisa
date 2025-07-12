import { useParams } from 'react-router-dom'

import { useState } from 'react'

import plants from '../plants.json'

export default function PlantDetail() {
  const { id } = useParams()
  const plant = plants.find(p => p.id === Number(id))

  const [tab, setTab] = useState('activity')

  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  return (

    <div className="space-y-2">
      <img src={plant.image} alt={plant.name} className="w-full h-48 object-cover rounded" />
      <h1 className="text-2xl font-bold">{plant.name}</h1>
      <p>Last watered: {plant.lastWatered}</p>
      <p>Next water: {plant.nextWater}</p>

    <div className="space-y-4">
      <img src={plant.image} alt={plant.name} className="w-full h-64 object-cover rounded-xl" />
      <div>
        <h1 className="text-2xl font-bold">{plant.name}</h1>
        {plant.nickname && <p className="text-gray-500">{plant.nickname}</p>}
      </div>

      <div className="grid gap-1 text-sm">
        <p><strong>Next watering:</strong> {plant.nextWater}</p>
        {plant.lastFertilized && <p><strong>Last fertilized:</strong> {plant.lastFertilized}</p>}
      </div>

      <div className="grid gap-1 text-sm">
        {plant.light && <p><strong>Light:</strong> {plant.light}</p>}
        {plant.humidity && <p><strong>Humidity:</strong> {plant.humidity}</p>}
        {plant.difficulty && <p><strong>Difficulty:</strong> {plant.difficulty}</p>}
      </div>

      <div>
        <div className="flex space-x-4 border-b">
          <button
            className={`py-2 ${tab === 'activity' ? 'border-b-2 border-green-500 font-medium' : ''}`}
            onClick={() => setTab('activity')}
          >
            Activity
          </button>
          <button
            className={`py-2 ${tab === 'notes' ? 'border-b-2 border-green-500 font-medium' : ''}`}
            onClick={() => setTab('notes')}
          >
            Notes
          </button>
          <button
            className={`py-2 ${tab === 'care' ? 'border-b-2 border-green-500 font-medium' : ''}`}
            onClick={() => setTab('care')}
          >
            Advanced
          </button>
        </div>
        <div className="p-4">
          {tab === 'activity' && (
            <ul className="list-disc pl-4 space-y-1">
              {(plant.activity || []).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          )}
          {tab === 'notes' && (
            <div>{plant.notes || 'No notes yet.'}</div>
          )}
          {tab === 'care' && (
            <div>{plant.advancedCare || 'No advanced care info.'}</div>
          )}
        </div>
      </div>

    </div>
  )
}
