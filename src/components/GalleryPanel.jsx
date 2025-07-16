import React, { useRef, useState } from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import Lightbox from './Lightbox.jsx'

export default function GalleryPanel({ plant, addPhoto, removePhoto, inputRef }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const fileInputRef = inputRef || useRef()

  const handleFiles = e => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => addPhoto(plant.id, ev.target.result)
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold font-headline">Gallery</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {(plant.photos || []).map((src, i) => (
          <div key={i} className="relative">
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="block focus:outline-none"
            >
              <img src={src} alt={`${plant.name} ${i}`} className="object-cover w-full h-24 rounded" />
            </button>
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
        className="mt-2 inline-flex items-center gap-1 px-3 py-2 bg-gray-200 rounded shadow"
      >
        <PlusIcon className="w-4 h-4" aria-hidden="true" />
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
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${plant.name} gallery`}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
        >
          <Lightbox
            images={plant.photos}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            label={`${plant.name} gallery`}
          />
        </div>
      )}
    </div>
  )
}
