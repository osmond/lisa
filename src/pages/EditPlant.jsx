import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import Button from "../components/Button.jsx"

export default function EditPlant() {
  const { id } = useParams()
  const { plants, updatePlant } = usePlants()
  const navigate = useNavigate()

  const plant = plants.find(p => p.id === Number(id))
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [lastWatered, setLastWatered] = useState('')
  const [nextWater, setNextWater] = useState('')

  useEffect(() => {
    if (plant) {
      setName(plant.name || '')
      setImage(plant.image || '')
      setLastWatered(plant.lastWatered || '')
      setNextWater(plant.nextWater || '')
    }
  }, [plant])

  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  const handleSubmit = e => {
    e.preventDefault()
    updatePlant(plant.id, { name, image, lastWatered, nextWater })
    navigate(`/plant/${plant.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h1 className="text-headline leading-heading tracking-heading font-bold font-display">Edit Plant</h1>
      <div className="grid gap-1">
        <label htmlFor="name" className="font-medium text-label leading-label tracking-label">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border rounded p-2"
          required
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="image" className="font-medium text-label leading-label tracking-label">Image URL</label>
        <input
          id="image"
          type="text"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="lastWatered" className="font-medium text-label leading-label tracking-label">Last Watered</label>
        <input
          id="lastWatered"
          type="date"
          value={lastWatered}
          onChange={e => setLastWatered(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="nextWater" className="font-medium text-label leading-label tracking-label">Next Watering</label>
        <input
          id="nextWater"
          type="date"
          value={nextWater}
          onChange={e => setNextWater(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <Button type="submit" className="px-4 py-2 bg-[var(--km-accent)] text-white">
        Save Changes
      </Button>
    </form>
  )
}
