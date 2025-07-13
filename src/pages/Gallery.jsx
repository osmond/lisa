import { useState } from 'react'
import { usePlants } from '../PlantContext.jsx'
import Lightbox from '../components/Lightbox.jsx'

export default function Gallery() {
  const { plants } = usePlants()
  const images = plants.map(p => p.image)
  const [index, setIndex] = useState(null)

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Gallery</h1>
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <button key={i} onClick={() => setIndex(i)} className="focus:outline-none">
            <img src={src} alt={`Plant ${i + 1}`} loading="lazy" className="w-full h-32 object-cover rounded" />
          </button>
        ))}
      </div>
      {index !== null && (
        <Lightbox images={images} startIndex={index} onClose={() => setIndex(null)} />
      )}
    </div>
  )
}
