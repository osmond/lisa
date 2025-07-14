
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import Lightbox from '../components/Lightbox.jsx'
import FadeInImage from '../components/FadeInImage.jsx'

export function AllGallery() {
  const { plants, addPhoto } = usePlants()
  const images = plants.flatMap(p => [p.image, ...(p.photos || []).map(ph => ph.url)])
  const [index, setIndex] = useState(null)
  const [selected, setSelected] = useState(plants[0]?.id || '')
  const [bouncing, setBouncing] = useState(false)
  const fileInputRef = useRef()

  useEffect(() => {
    if (!bouncing) return
    const t = setTimeout(() => setBouncing(false), 300)
    return () => clearTimeout(t)
  }, [bouncing])

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
      <h1 className="text-headline font-bold font-display mb-4">Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
        {images.map((src, i) => (
          <button key={i} onClick={() => setIndex(i)} className="focus:outline-none">
            <FadeInImage
              src={src}
              alt={`Plant ${i + 1}`}
              loading="lazy"
              className="w-full h-32 object-cover rounded transition-transform transform hover:scale-105 active:scale-105"
            />
          </button>
        ))}
      </div>
      {index !== null && (
        <Lightbox
          images={images}
          startIndex={index}
          onClose={() => setIndex(null)}
          label="Photo viewer"
        />
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
        onClick={() => {
          fileInputRef.current.click()
          setBouncing(true)
        }}
        className={`fixed bottom-4 right-4 bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg ${bouncing ? 'bounce-once' : ''}`}
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
  const [index, setIndex] = useState(null)

  return (
    <div className="space-y-4">
      <h1 className="text-headline font-bold font-display">{plant.name} Gallery</h1>

      {/* desktop grid */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="aspect-video overflow-hidden rounded-lg shadow-lg bg-gray-900 focus:outline-none"
          >
            <FadeInImage
              src={photo.url}
              alt={plant.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform transform hover:scale-105 active:scale-105"
            />
          </button>
        ))}
      </div>

      {/* mobile carousel */}
      <div className="flex md:hidden space-x-4 overflow-x-auto snap-x snap-mandatory">
        {photos.map((photo, i) => (
          <div key={i} className="snap-center shrink-0 w-full">
            <button
              onClick={() => setIndex(i)}
              className="aspect-video overflow-hidden rounded-lg shadow-lg bg-gray-900 w-full h-full focus:outline-none"
            >
              <FadeInImage
                src={photo.url}
                alt={plant.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform transform hover:scale-105 active:scale-105"
              />
            </button>
          </div>
        ))}
      </div>
      {index !== null && (
        <Lightbox
          images={photos.map(p => p.url)}
          startIndex={index}
          onClose={() => setIndex(null)}
          label="Photo viewer"
        />
      )}

    </div>
  )
}
