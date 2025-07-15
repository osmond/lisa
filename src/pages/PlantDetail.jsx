import { useParams, Link } from 'react-router-dom'
import { useState, useRef, useMemo } from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import Lightbox from '../components/Lightbox.jsx'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from '../components/ActionIcons.jsx'
import NoteModal from '../components/NoteModal.jsx'
import { formatMonth } from '../utils/date.js'

export default function PlantDetail() {
  const { id } = useParams()
  const { plants, addPhoto, removePhoto, markWatered, markFertilized, logEvent } = usePlants()
  const plant = plants.find(p => p.id === Number(id))

  const sectionNames = ['activity', 'notes', 'care', 'timeline']
  const sectionRefs = useRef([])
  const [openSection, setOpenSection] = useState('activity')
  const [showMore, setShowMore] = useState(false)
  const fileInputRef = useRef()
  const [toast, setToast] = useState('')
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const events = useMemo(() => {
    if (!plant) return []
    const list = []
    if (plant.lastWatered) {
      list.push({ date: plant.lastWatered, label: 'Watered', type: 'water' })
    }
    if (plant.lastFertilized) {
      list.push({
        date: plant.lastFertilized,
        label: 'Fertilized',
        type: 'fertilize',
      })
    }
    ;(plant.activity || []).forEach(a => {
      const m = a.match(/(\d{4}-\d{2}-\d{2})/)
      if (m) {
        list.push({ date: m[1], label: a, type: 'note' })
      }
    })
    ;(plant.careLog || []).forEach(ev => {
      list.push({ date: ev.date, label: ev.type, note: ev.note, type: 'log' })
    })
    return list.sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [plant])

  const groupedEvents = useMemo(() => {
    const map = new Map()
    events.forEach(e => {
      const key = e.date.slice(0, 7)
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(e)
    })
    return Array.from(map.entries())
  }, [events])

  const colors = {
    water: 'bg-blue-500',
    fertilize: 'bg-yellow-500',
    note: 'bg-gray-400',
    log: 'bg-green-400',
  }

  const handleFiles = e => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => addPhoto(plant.id, ev.target.result)
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const dir = e.key === 'ArrowDown' ? 1 : -1
      const nextIndex = (index + dir + sectionNames.length) % sectionNames.length
      setOpenSection(sectionNames[nextIndex])
      sectionRefs.current[nextIndex]?.focus()
    }
  }

  const showTempToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(''), 800)
  }

  const handleWatered = () => {
    markWatered(plant.id, '')
    showTempToast('Watered')
  }

  const handleFertilized = () => {
    markFertilized(plant.id, '')
    showTempToast('Fertilized')
  }

  const handleLogEvent = () => {
    setShowNoteModal(true)
  }

  const saveNote = note => {
    if (note) {
      logEvent(plant.id, 'Note', note)
      showTempToast('Logged')
    }
    setShowNoteModal(false)
  }

  const cancelNote = () => {
    setShowNoteModal(false)
  }

  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  return (
    <div className="space-y-2 relative">
      {toast && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="w-8 h-8 text-green-600 check-pop"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      )}
      <div aria-live="polite" className="sr-only">{toast}</div>
      <div className="space-y-4">
        <img src={plant.image} alt={plant.name} loading="lazy" className="w-full h-64 object-cover" />
        <div>
          <h1 className="text-3xl font-bold font-headline">{plant.name}</h1>
          {plant.nickname && <p className="text-gray-500">{plant.nickname}</p>}
        </div>

        <div className="grid gap-1 text-sm">
          <p><strong>Last watered:</strong> {plant.lastWatered}</p>
          <p><strong>Next watering:</strong> {plant.nextWater}</p>
          {plant.lastFertilized && (
            <p><strong>Last fertilized:</strong> {plant.lastFertilized}</p>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={handleWatered}
            className="px-4 py-1 bg-accent text-white rounded-full"
          >
            Watered
          </button>
          <button
            type="button"
            onClick={handleFertilized}
            className="px-4 py-1 bg-accent text-white rounded-full"
          >
            Fertilized
          </button>
          <button
            type="button"
            onClick={handleLogEvent}
            className="px-4 py-1 bg-accent text-white rounded-full"
          >
            Add Note
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {plant.light && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
              {plant.light}
            </span>
          )}
          {plant.humidity && (
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {plant.humidity}
            </span>
          )}
          {plant.difficulty && (
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800">
              {plant.difficulty}
            </span>
          )}
        </div>


        <div className="space-y-2">
          <div className="border rounded-xl">
            <h3 id="activity-header">
              <button
                ref={el => (sectionRefs.current[0] = el)}
                aria-expanded={openSection === 'activity'}
                aria-controls="activity-panel"
                className="w-full text-left flex justify-between items-center p-2"
                onClick={() =>
                  setOpenSection(openSection === 'activity' ? null : 'activity')
                }
                onKeyDown={e => handleKeyDown(e, 0)}
              >
                Activity
                <span>{openSection === 'activity' ? '-' : '+'}</span>
              </button>
            </h3>
            {openSection === 'activity' && (
              <div
                id="activity-panel"
                role="region"
                aria-labelledby="activity-header"
                className="p-4"
              >
                <ul className="list-disc pl-4 space-y-1">
                  {(plant.careLog || []).map((ev, i) => (
                    <li key={i}>
                      {ev.type} on {ev.date}
                      {ev.note ? ` - ${ev.note}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="border rounded-xl">
            <h3 id="notes-header">
              <button
                ref={el => (sectionRefs.current[1] = el)}
                aria-expanded={openSection === 'notes'}
                aria-controls="notes-panel"
                className="w-full text-left flex justify-between items-center p-2"
                onClick={() =>
                  setOpenSection(openSection === 'notes' ? null : 'notes')
                }
                onKeyDown={e => handleKeyDown(e, 1)}
              >
                Notes
                <span>{openSection === 'notes' ? '-' : '+'}</span>
              </button>
            </h3>
            {openSection === 'notes' && (
              <div
                id="notes-panel"
                role="region"
                aria-labelledby="notes-header"
                className="p-4"
              >
                {plant.notes
                  ? showMore
                    ? plant.notes
                    : plant.notes.slice(0, 160)
                  : 'No notes yet.'}
                {plant.notes && plant.notes.length > 160 && (
                  <button
                    type="button"
                    onClick={() => setShowMore(!showMore)}
                    className="ml-2 text-green-600 underline"
                  >
                    {showMore ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="border rounded-xl">
            <h3 id="care-header">
              <button
                ref={el => (sectionRefs.current[2] = el)}
                aria-expanded={openSection === 'care'}
                aria-controls="care-panel"
                className="w-full text-left flex justify-between items-center p-2"
                onClick={() =>
                  setOpenSection(openSection === 'care' ? null : 'care')
                }
                onKeyDown={e => handleKeyDown(e, 2)}
              >
                Advanced
                <span>{openSection === 'care' ? '-' : '+'}</span>
              </button>
            </h3>
            {openSection === 'care' && (
              <div
                id="care-panel"
                role="region"
                aria-labelledby="care-header"
                className="p-4"
              >
                {plant.advancedCare || 'No advanced care info.'}
              </div>
            )}
          </div>

          <div className="border rounded-xl">
            <h3 id="timeline-header">
              <button
                ref={el => (sectionRefs.current[3] = el)}
                aria-expanded={openSection === 'timeline'}
                aria-controls="timeline-panel"
                className="w-full text-left flex justify-between items-center p-2"
                onClick={() =>
                  setOpenSection(openSection === 'timeline' ? null : 'timeline')
                }
                onKeyDown={e => handleKeyDown(e, 3)}
              >
                Timeline
                <span>{openSection === 'timeline' ? '-' : '+'}</span>
              </button>
            </h3>
            {openSection === 'timeline' && (
              <div
                id="timeline-panel"
                role="region"
                aria-labelledby="timeline-header"
                className="p-4"
              >
                {groupedEvents.map(([monthKey, list]) => (
                  <div key={monthKey}>
                    <h3 className="mt-4 text-sm font-semibold text-gray-500">
                      {formatMonth(monthKey)}
                    </h3>
                    <ul className="relative border-l border-gray-300 pl-4 space-y-6">
                      {list.map((e, i) => {
                        const Icon = actionIcons[e.type]
                        return (
                          <li key={`${e.date}-${i}`} className="relative">
                            <span
                              className={`absolute -left-2 top-1 w-3 h-3 rounded-full ${colors[e.type]}`}
                            ></span>
                            <p className="text-xs text-gray-500">{e.date}</p>
                            <p className="flex items-center gap-1">
                              {Icon && <Icon />}
                              {e.label}
                            </p>
                            {e.note && (
                              <p className="text-xs text-gray-500 italic">{e.note}</p>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold font-headline">Gallery</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <div className="relative flex-shrink-0 w-24 h-24">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full h-full flex items-center justify-center bg-gray-200 rounded"
            >
              <PlusIcon className="w-6 h-6 text-gray-600" aria-hidden="true" />
              <span className="sr-only">Add Photo</span>
            </button>
          </div>
          {(plant.photos || []).map((src, i) => (
            <div key={i} className="relative flex-shrink-0 w-24 h-24">
              <img
                src={src}
                alt={`${plant.name} ${i}`}
                className="object-cover w-full h-full rounded"
                onClick={() => setLightboxIndex(i)}
              />
              <button
                className="absolute top-1 right-1 bg-white bg-opacity-70 rounded px-1 text-xs"
                onClick={() => removePhoto(plant.id, i)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFiles}
          className="hidden"
        />
        {lightboxIndex !== null && (
          <Lightbox
            images={plant.photos}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            label="Photo viewer"
          />
        )}
      </div>
      {showNoteModal && (
        <NoteModal label="Note" onSave={saveNote} onCancel={cancelNote} />
      )}
  </div>
)
}
