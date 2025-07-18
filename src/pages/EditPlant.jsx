import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from "../components/PageContainer.jsx"
import { usePlants, addBase } from '../PlantContext.jsx'

export default function EditPlant() {
  const { id } = useParams()
  const { plants, updatePlant } = usePlants()
  const navigate = useNavigate()

  const plant = plants.find(p => p.id === Number(id))
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [lastWatered, setLastWatered] = useState('')
  const [nextWater, setNextWater] = useState('')
  const nameInputRef = useRef(null)

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  const handleFileChange = e => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => setImage(ev.target.result)
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

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
    <PageContainer>
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold font-headline">Edit Plant</h1>
      <div className="grid gap-1">
        <label htmlFor="name" className="font-medium">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          ref={nameInputRef}
          className="border rounded p-2"
          required
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="image" className="font-medium">Image URL</label>
        <input
          id="image"
          type="text"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="imageFile" className="font-medium">Upload Photo</label>
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border rounded p-2"
        />
      </div>
      {image && (
        <img
          src={addBase(image)}
          alt="Preview"
          className="object-cover w-24 h-24 rounded"
        />
      )}
      <div className="grid gap-1">
        <label htmlFor="lastWatered" className="font-medium">Last Watered</label>
        <input
          id="lastWatered"
          type="date"
          value={lastWatered}
          onChange={e => setLastWatered(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="nextWater" className="font-medium">Next Watering</label>
        <input
          id="nextWater"
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
        Save Changes
      </button>
    </form>
    </PageContainer>
  )
}
