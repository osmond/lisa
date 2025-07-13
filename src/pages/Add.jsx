import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'

export default function Add() {
  const { addPlant } = usePlants()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [lastWatered, setLastWatered] = useState('')
  const [nextWater, setNextWater] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (!name) return
    addPlant({ name, image, lastWatered, nextWater })
    navigate('/myplants')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Add Plant</h1>
      <div className="grid gap-1">
        <label className="font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border rounded p-2"
          required
        />
      </div>
      <div className="grid gap-1">
        <label className="font-medium">Image URL</label>
        <input
          type="text"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div className="grid gap-1">
        <label className="font-medium">Last Watered</label>
        <input
          type="date"
          value={lastWatered}
          onChange={e => setLastWatered(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div className="grid gap-1">
        <label className="font-medium">Next Watering</label>
        <input
          type="date"
          value={nextWater}
          onChange={e => setNextWater(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Add Plant
      </button>
    </form>
  )
}
