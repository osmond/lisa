import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/PageContainer.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { usePlants, addBase } from '../PlantContext.jsx'

export default function Gallery() {
  const { plants } = usePlants()
  const photos = plants.flatMap(p =>
    (p.photos || []).map(photo => ({ ...photo, plant: p.name }))
  )
  const [lightboxIndex, setLightboxIndex] = useState(null)

  if (photos.length === 0) {
    return (
      <PageContainer className="text-center space-y-4">
        <h2 className="text-heading font-headline">Gallery</h2>
        <img
          src={addBase('/happy-plant.svg')}
          alt="Empty gallery"
          className="w-32 h-32 mx-auto"
        />
        <p className="text-gray-700 dark:text-gray-200">
          Gallery will unlock once you add photos.
        </p>
        <Link
          to="/add"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded"
        >
          Add a plant
        </Link>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-4">
      <h2 className="text-heading font-headline text-center">Gallery</h2>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))' }}
      >
        {photos.map((photo, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="focus:outline-none"
          >
            <img
              src={photo.src}
              alt={photo.caption || `${photo.plant} photo ${i + 1}`}
              className="w-full aspect-[4/3] object-cover rounded-lg"
            />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          label="Gallery viewer"
        />
      )}
    </PageContainer>
  )
}
