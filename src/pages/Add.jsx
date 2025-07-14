import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import Button from "../components/Button.jsx"

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

    const imgUrl = image || '/placeholder.svg'
    addPlant({ name, image: imgUrl, lastWatered, nextWater })

    navigate('/myplants')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h1 className="text-headline leading-heading tracking-heading font-bold font-display">Add Plant</h1>
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
      <Button type="submit" className="px-4 py-2 bg-primary-green text-white">
        Add Plant
      </Button>
    </form>
  )
}
