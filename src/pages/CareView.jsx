import { usePlants } from '../PlantContext.jsx'
import { useState } from 'react'

export default function CareView() {
  const { plants, markWatered, markFertilized } = usePlants()
  const [sort, setSort] = useState('urgent')
  const today = new Date().toISOString().slice(0, 10)

  const tasksByPlant = plants.map(p => {
    const tasks = []
    if (p.nextWater && p.nextWater <= today) tasks.push('water')
    if (p.nextFertilize && p.nextFertilize <= today) tasks.push('fertilize')
    return { plant: p, tasks }
  }).filter(tp => tp.tasks.length > 0)

  const sorted = [...tasksByPlant].sort((a, b) => {
    if (sort === 'urgent') {
      return (a.plant.urgency === 'high' ? -1 : 1) - (b.plant.urgency === 'high' ? -1 : 1)
    }
    return a.plant.name.localeCompare(b.plant.name)
  })

  if (sorted.length === 0) {
    return <p className="text-gray-700">All plants are happy today!</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-headline mb-4">Today’s Plants</h1>
      <div className="flex gap-2 mb-4">
        <select className="border rounded p-1" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="urgent">Most Urgent</option>
          <option value="name">A–Z</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {sorted.map(({ plant, tasks }) => {
          const imageSrc = typeof plant.image === 'string' && plant.image.trim() !== '' ? plant.image : '/demo-image-01.jpg'
          return (
            <div key={plant.id} className="border dark:border-gray-600 rounded-lg p-2">
              <img src={imageSrc} alt={plant.name} loading="lazy" className="w-full h-40 object-cover rounded" />
              <p className="mt-1 text-center text-sm font-semibold font-headline">{plant.name}</p>
              <div className="flex justify-center gap-1 mt-1">
                {tasks.includes('water') && <span role="img" aria-label="Water">💧</span>}
                {tasks.includes('fertilize') && <span role="img" aria-label="Fertilize">🌿</span>}
              </div>
              <div className="flex justify-center gap-1 mt-2">
                {tasks.includes('water') && (
                  <button type="button" onClick={() => markWatered(plant.id, '')} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Watered</button>
                )}
                {tasks.includes('fertilize') && (
                  <button type="button" onClick={() => markFertilized(plant.id, '')} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Fertilized</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
