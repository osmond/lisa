import { useParams, Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import { usePlants } from '../PlantContext.jsx'

export default function PlantDetail() {
  const { id } = useParams()
  const { plants, addPhoto, removePhoto } = usePlants()
  const plant = plants.find(p => p.id === Number(id))

  const tabNames = ['activity', 'notes', 'care']
  const tabRefs = useRef([])
  const [tab, setTab] = useState('activity')
  const fileInputRef = useRef()

  const handleFiles = e => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => addPhoto(plant.id, ev.target.result)
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      const nextIndex = (index + dir + tabNames.length) % tabNames.length
      setTab(tabNames[nextIndex])
      tabRefs.current[nextIndex]?.focus()
    }
  }

  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  return (
    <div className="space-y-2">
      <div className="space-y-4">
        <img src={plant.image} alt={plant.name} loading="lazy" className="w-full h-64 object-cover rounded-xl" />
        <div>
          <h1 className="text-2xl font-bold">{plant.name}</h1>
          {plant.nickname && <p className="text-gray-500">{plant.nickname}</p>}
        </div>

        <div className="grid gap-1 text-sm">
          <p><strong>Last watered:</strong> {plant.lastWatered}</p>
          <p><strong>Next watering:</strong> {plant.nextWater}</p>
          {plant.lastFertilized && (
            <p><strong>Last fertilized:</strong> {plant.lastFertilized}</p>
          )}
        </div>

        <div className="grid gap-1 text-sm">
          {plant.light && <p><strong>Light:</strong> {plant.light}</p>}
          {plant.humidity && <p><strong>Humidity:</strong> {plant.humidity}</p>}
          {plant.difficulty && <p><strong>Difficulty:</strong> {plant.difficulty}</p>}
        </div>

        <div>
          <Link
            to={`/plant/${plant.id}/gallery`}
            className="text-green-600 underline"
          >
            View Gallery
          </Link>
        </div>

        <div>
          <div className="flex space-x-4 border-b" role="tablist">
            <button
              role="tab"
              ref={el => (tabRefs.current[0] = el)}
              aria-selected={tab === 'activity'}
              tabIndex={tab === 'activity' ? 0 : -1}
              className={`py-2 ${tab === 'activity' ? 'border-b-2 border-green-500 font-medium' : ''}`}
              onClick={() => setTab('activity')}
              onKeyDown={e => handleKeyDown(e, 0)}
            >
              Activity
            </button>
            <button
              role="tab"
              ref={el => (tabRefs.current[1] = el)}
              aria-selected={tab === 'notes'}
              tabIndex={tab === 'notes' ? 0 : -1}
              className={`py-2 ${tab === 'notes' ? 'border-b-2 border-green-500 font-medium' : ''}`}
              onClick={() => setTab('notes')}
              onKeyDown={e => handleKeyDown(e, 1)}
            >
              Notes
            </button>
            <button
              role="tab"
              ref={el => (tabRefs.current[2] = el)}
              aria-selected={tab === 'care'}
              tabIndex={tab === 'care' ? 0 : -1}
              className={`py-2 ${tab === 'care' ? 'border-b-2 border-green-500 font-medium' : ''}`}
              onClick={() => setTab('care')}
              onKeyDown={e => handleKeyDown(e, 2)}
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
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Gallery</h2>
        <div className="grid grid-cols-3 gap-2">
          {(plant.gallery || []).map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                alt={`${plant.name} ${i}`}
                className="object-cover w-full h-24 rounded"
              />
              <button
                className="absolute top-1 right-1 bg-white bg-opacity-70 rounded px-1 text-xs"
                onClick={() => removePhoto(plant.id, i)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
        >
          Add Photo
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFiles}
          className="hidden"
        />
      </div>
    </div>
  </div>
)
}
