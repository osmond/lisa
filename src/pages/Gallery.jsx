
import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import Lightbox from '../components/Lightbox.jsx'

export function AllGallery() {
  const { plants, addPhoto } = usePlants()
  const images = plants.flatMap(p => [p.image, ...(p.gallery || [])])
  const [index, setIndex] = useState(null)
  const [selected, setSelected] = useState(plants[0]?.id || '')
  const fileInputRef = useRef()

  const handleFiles = e => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => addPhoto(Number(selected), ev.target.result)
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Gallery</h1>
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <button key={i} onClick={() => setIndex(i)} className="focus:outline-none">
            <img
              src={src}
              alt={`Plant ${i + 1}`}
              loading="lazy"
              className="w-full h-32 object-cover rounded"
            />
          </button>
        ))}
      </div>
      {index !== null && (
        <Lightbox images={images} startIndex={index} onClose={() => setIndex(null)} />
      )}

      <select
        aria-label="Select plant"
        className="fixed bottom-20 right-4 bg-white dark:bg-gray-800 border rounded p-1"
        value={selected}
        onChange={e => setSelected(e.target.value)}
      >
        {plants.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        aria-label="Add photos"
        onClick={() => fileInputRef.current.click()}
        className="fixed bottom-4 right-4 bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      >
        +
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
  )
}

export default function Gallery() {
  const { id } = useParams()
  const { plants } = usePlants()
  const plant = plants.find(p => p.id === Number(id))

  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  const photos = plant.photos || []

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{plant.name} Gallery</h1>

      {/* desktop grid */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        {photos.map((src, i) => (
          <div
            key={i}
            className="aspect-video overflow-hidden rounded-lg shadow-lg bg-gray-900"
          >
            <img
              src={src}
              alt={plant.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* mobile carousel */}
      <div className="flex md:hidden space-x-4 overflow-x-auto snap-x snap-mandatory">
        {photos.map((src, i) => (
          <div key={i} className="snap-center shrink-0 w-full">
            <div className="aspect-video overflow-hidden rounded-lg shadow-lg bg-gray-900">
              <img
                src={src}
                alt={plant.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
