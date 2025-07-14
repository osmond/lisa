import { useParams, Link } from 'react-router-dom'
import { useState, useRef, useMemo } from 'react'
import { usePlants } from '../PlantContext.jsx'
import { Drop } from 'phosphor-react'
import actionIcons from '../components/ActionIcons.jsx'
import LogModal from '../components/LogModal.jsx'
import { formatMonth } from '../utils/date.js'
import FadeInImage from '../components/FadeInImage.jsx'
import EditNoteModal from '../components/EditNoteModal.jsx'
import PhotoThumb from '../components/PhotoThumb.jsx'

export default function PlantDetail() {
  const { id } = useParams()
  const {
    plants,
    addPhoto,
    removePhoto,
    markWatered,
    logEvent,
    updatePlant,
  } = usePlants()
  const plant = plants.find(p => p.id === Number(id))

  const sectionNames = ['activity', 'notes', 'care', 'timeline']
  const sectionRefs = useRef([])
  const [openSection, setOpenSection] = useState('activity')
  const [showMore, setShowMore] = useState(false)
  const fileInputRef = useRef()
  const [toast, setToast] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('Note')
  const [noteModal, setNoteModal] = useState(false)

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
      list.push({
        date: ev.date,
        label: ev.type,
        note: ev.note,
        mood: ev.mood,
        type: 'log',
      })
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

  const handleLogEvent = () => {
    setModalType('Note')
    setShowModal(true)
  }

  const handleAddCareLog = () => {
    setModalType('')
    setShowModal(true)
  }

  const handleSharePhoto = src => {
    if (navigator.share) {
      navigator.share({ url: src }).catch(() => {})
    }
  }

  const handleSetCover = src => {
    updatePlant(plant.id, { image: src })
  }

  const handleEditNote = () => {
    setNoteModal(true)
  }

  const handleSaveLog = ({ type, note, date, mood }) => {
    if (!type) return
    logEvent(plant.id, type, note, date, mood)
    showTempToast('Logged')
  }

  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  return (
    <div className="space-y-2 relative">
      {toast && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {toast === 'Watered' ? (
            <Drop aria-hidden="true" className="w-8 h-8 text-blue-600 water-drop" />
          ) : (
            <div className="w-8 h-8 border-4 border-green-600 rounded-full ring-pop"></div>
          )}
        </div>
      )}
      <div aria-live="polite" className="sr-only">{toast}</div>
      <div className="space-y-4">
        <div className="relative -mx-4">
          <FadeInImage
            src={plant.image}
            alt={plant.name}
            loading="lazy"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-4 space-y-1">
            <h1 className="text-headline font-bold font-display text-white">{plant.name}</h1>
            {plant.nickname && <p className="text-white text-sm">{plant.nickname}</p>}
            <div className="flex flex-wrap gap-2 text-xs">
              {plant.light && (
                <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">{plant.light}</span>
              )}
              {plant.humidity && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">{plant.humidity}</span>
              )}
              {plant.difficulty && (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800">{plant.difficulty}</span>
              )}
            </div>
          </div>
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
            onClick={handleLogEvent}
            className="px-4 py-1 bg-accent text-white rounded-full"
          >
            Add Note
          </button>
          <button
            type="button"
            onClick={handleAddCareLog}
            className="px-4 py-1 bg-accent text-white rounded-full"
          >
            + Add care log
          </button>
        </div>


        <div>
          <Link
            to={`/plant/${plant.id}/gallery`}
            className="text-green-600 underline"
          >
            View Gallery
          </Link>
        </div>

        <div className="space-y-2 mt-4 divide-y divide-gray-200 rounded-xl shadow-sm bg-stone">
          <div>
            <h3 id="activity-header">
              <button
                ref={el => (sectionRefs.current[0] = el)}
                aria-expanded={openSection === 'activity'}
                aria-controls="activity-panel"
                className="w-full text-left flex justify-between items-center p-2 text-subhead"
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
                className="p-4 pb-4"
              >
                <ul className="list-disc pl-4 space-y-1">
                  {(plant.careLog || []).map((ev, i) => (
                    <li key={i}>
                      {ev.type} on {ev.date}
                      {ev.note ? ` - ${ev.note}` : ''}
                      {ev.mood ? ` (${ev.mood})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <h3 id="notes-header">
              <button
                ref={el => (sectionRefs.current[1] = el)}
                aria-expanded={openSection === 'notes'}
                aria-controls="notes-panel"
                className="w-full text-left flex justify-between items-center p-2 text-subhead"
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
                className="p-4 pb-4 shadow-sm bg-stone rounded"
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

          <div>
            <h3 id="care-header">
              <button
                ref={el => (sectionRefs.current[2] = el)}
                aria-expanded={openSection === 'care'}
                aria-controls="care-panel"
                className="w-full text-left flex justify-between items-center p-2 text-subhead"
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
                className="p-4 pb-4"
              >
                {plant.advancedCare || 'No advanced care info.'}
              </div>
            )}
          </div>

          <div>
            <h3 id="timeline-header">
              <button
                ref={el => (sectionRefs.current[3] = el)}
                aria-expanded={openSection === 'timeline'}
                aria-controls="timeline-panel"
                className="w-full text-left flex justify-between items-center p-2 text-subhead"
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
                className="p-4 pb-4"
              >
                {groupedEvents.map(([monthKey, list]) => (
                  <div key={monthKey}>
                    <h3 className="mt-4 text-label font-semibold text-gray-500">
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
                            {e.mood && (
                              <p className="text-xs">{e.mood}</p>
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
      <div className="space-y-2 mt-4 p-4 shadow-sm bg-stone rounded-xl">
        <h2 className="text-subhead font-semibold font-display">Gallery</h2>
        <div className="grid grid-cols-3 gap-2">
          {(plant.photos || []).map((src, i) => (
            <PhotoThumb
              key={i}
              src={src}
              alt={`${plant.name} ${i}`}
              onRemove={() => removePhoto(plant.id, i)}
              onShare={() => handleSharePhoto(src)}
              onEdit={handleEditNote}
              onCover={() => handleSetCover(src)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
        >
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
      </div>
      {showModal && (
        <LogModal
          onSave={handleSaveLog}
          onClose={() => setShowModal(false)}
          defaultType={modalType}
        />
      )}
      {noteModal && (
        <EditNoteModal
          initial={plant.notes || ''}
          onSave={note => updatePlant(plant.id, { notes: note })}
          onClose={() => setNoteModal(false)}
        />
      )}
  </div>
)
}
