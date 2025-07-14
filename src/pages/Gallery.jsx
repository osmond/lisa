
import { useState, useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Calendar, MagnifyingGlassPlus } from 'phosphor-react'
import { usePlants } from '../PlantContext.jsx'
import Lightbox from '../components/Lightbox.jsx'
import FadeInImage from '../components/FadeInImage.jsx'

import Button from "../components/Button.jsx"
export function AllGallery() {
  const { plants, addPhoto } = usePlants()
  const images = plants.flatMap(p => [
    p.image,
    ...(p.photos || []).map(ph => (typeof ph === 'object' ? ph.src : ph)),
  ])
  const alts = plants.flatMap(p => [
    p.name,
    ...(p.photos || []).map(ph =>
      typeof ph === 'object' ? ph.note || p.name : p.name
    ),
  ])
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
      <h1 className="text-headline leading-heading tracking-heading font-bold font-display mb-4">Gallery</h1>
      <Link
        to="/gallery/timeline"
        className="inline-flex items-center gap-1 px-3 py-1 mb-2 bg-accent text-white rounded"
      >
        <Calendar className="w-4 h-4" aria-hidden="true" />
        <span>View by date</span>
      </Link>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
        {images.map((src, i) => (
          <Button
            key={i}
            onClick={() => setIndex(i)}
            className="relative group aspect-square overflow-hidden focus:outline-none"
          >

            <FadeInImage
              src={src}
              alt={alts[i] || `Plant ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover rounded transition-transform transform hover:scale-105 active:scale-105"
              onError={e => (e.target.src = '/placeholder.svg')}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity">
              {alts[i]}
            </span>

          </Button>
        ))}
        <Button
          type="button"
          aria-label="Add photos"
          onClick={() => {
            fileInputRef.current.click()
            setBouncing(true)
          }}
          className={`relative group focus:outline-none ${bouncing ? 'bounce-once' : ''}`}
        >
          <div className="w-full h-32 rounded bg-gray-200 dark:bg-gray-700"></div>
          <span className="absolute inset-0 flex items-center justify-center text-4xl text-primary-green">+</span>
        </Button>
      </div>
      {index !== null && (
        <Lightbox
          images={images}
          alts={alts}
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

      <Button
        type="button"
        aria-label="Add photos"
        onClick={() => {
          fileInputRef.current.click()
          setBouncing(true)
        }}
        className={`fixed bottom-4 right-4 bg-[var(--km-accent)] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg ${bouncing ? 'bounce-once' : ''}`}
      >
        +
      </Button>

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
  const { plants, updatePhoto } = usePlants()
  const plant = plants.find(p => p.id === Number(id))

  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  const photos = plant.photos || []
  const alts = photos.map(ph =>
    typeof ph === 'object' ? ph.note || plant.name : plant.name
  )
  const [index, setIndex] = useState(null)
  const [editIndex, setEditIndex] = useState(null)
  const [note, setNote] = useState('')
  const [tags, setTags] = useState('')

  const startEdit = i => {
    const ph = photos[i] || {}
    setNote(ph.note || '')
    setTags((ph.tags || []).join(', '))
    setEditIndex(i)
  }

  const handleSave = e => {
    e.preventDefault()
    updatePhoto(plant.id, editIndex, {
      note,
      tags: tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    })
    setEditIndex(null)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-headline leading-heading tracking-heading font-bold font-display">{plant.name} Gallery</h1>

      {/* desktop grid */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((ph, i) => {
          const src = typeof ph === 'object' ? ph.src : ph
          return (
            <Button
              key={i}
              onClick={() => setIndex(i)}
              className="relative group aspect-video overflow-hidden rounded-lg shadow-lg bg-gray-900 focus:outline-none"
            >
              <FadeInImage

                src={src}
                alt={plant.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform transform hover:scale-105 active:scale-105"
                onError={e => (e.target.src = '/placeholder.svg')}
              />

              <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity">
                {plant.name}
              </span>
            </Button>

          )
        })}
      </div>

      {/* mobile carousel */}
      <div className="flex md:hidden space-x-4 overflow-x-auto snap-x snap-mandatory">
        {photos.map((ph, i) => {
          const src = typeof ph === 'object' ? ph.src : ph
          return (
          <div key={i} className="snap-center shrink-0 w-full">
            <Button
              onClick={() => setIndex(i)}
              className="relative group aspect-video overflow-hidden rounded-lg shadow-lg bg-gray-900 w-full h-full focus:outline-none"
            >
              <FadeInImage
                src={src}
                alt={plant.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform transform hover:scale-105 active:scale-105"
                onError={e => (e.target.src = '/placeholder.svg')}
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                <MagnifyingGlassPlus className="w-6 h-6 text-white" aria-hidden="true" />
              </span>

              <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity">
                {plant.name}
              </span>

              </Button>



          </div>
          )
        })}
      </div>
      {index !== null && (
        <Lightbox
          images={photos.map(ph => (typeof ph === 'object' ? ph.src : ph))}
          alts={alts}
          startIndex={index}
          onClose={() => setIndex(null)}
          label="Photo viewer"
        />
      )}

      <div className="space-y-4 mt-4">
        {photos.map((ph, i) => (
          <div key={i} className="border p-4 rounded">
            <div className="flex items-center gap-2">
              <img
                src={typeof ph === 'object' ? ph.src : ph}
                alt={plant.name}
                className="w-20 h-20 object-cover rounded"
                onError={e => (e.target.src = '/placeholder.svg')}
              />
              <div className="flex-1">
                {editIndex === i ? (
                  <form onSubmit={handleSave} className="space-y-1">
                    <textarea
                      placeholder="Note"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      className="w-full border rounded p-1 text-sm"
                    ></textarea>
                    <input
                      placeholder="Tags (comma separated)"
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      className="w-full border rounded p-1 text-sm"
                    />
                    <div className="flex gap-2 text-sm">
                      <Button type="submit" className="px-2 py-0.5 bg-[var(--km-accent)] text-white">Save</Button>
                      <Button type="button" onClick={() => setEditIndex(null)} className="px-2 py-0.5 border">Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-1 text-sm">
                    {ph.note && <p>{ph.note}</p>}
                    {ph.tags && ph.tags.length > 0 && (
                      <p className="text-xs text-gray-500">{ph.tags.join(', ')}</p>
                    )}
                    <Button type="button" onClick={() => startEdit(i)} className="text-xs text-[var(--km-accent)] underline">Edit</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
