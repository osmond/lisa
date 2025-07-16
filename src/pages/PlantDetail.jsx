import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef, useMemo } from 'react'

import {
  Clock,
  Sun,
  Drop,
  Gauge,
  CalendarCheck,
  Flower,
  DotsThreeVertical,
  Image,
  Note,
} from 'phosphor-react'

import { PlusIcon } from '@radix-ui/react-icons'
import Lightbox from '../components/Lightbox.jsx'

import { usePlants } from '../PlantContext.jsx'
import actionIcons from '../components/ActionIcons.jsx'
import NoteModal from '../components/NoteModal.jsx'

import useToast from "../hooks/useToast.jsx"
import Badge from '../components/Badge.jsx'

import { formatMonth, formatDate } from '../utils/date.js'

import { buildEvents, groupEventsByMonth } from '../utils/events.js'


const iconColors = {
  water: 'text-blue-500',
  fertilize: 'text-yellow-500',
  note: 'text-gray-400',
  log: 'text-green-500',
  advanced: 'text-purple-500',
  noteText: 'text-gray-400',
}

const bulletColors = {
  water: 'bg-blue-500',
  fertilize: 'bg-yellow-500',
  note: 'bg-gray-400',
  log: 'bg-green-500',
  advanced: 'bg-purple-500',
  noteText: 'bg-gray-400',
}

export default function PlantDetail() {
  const { id } = useParams()
  const { plants, addPhoto, removePhoto, markWatered, markFertilized, logEvent } = usePlants()
  const plant = plants.find(p => p.id === Number(id))
  const navigate = useNavigate()

  const fileInputRef = useRef()
  const { Toast, showToast } = useToast()
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [showActionsMenu, setShowActionsMenu] = useState(false)

  const events = useMemo(() => buildEvents(plant), [plant])

  const groupedEvents = useMemo(
    () => groupEventsByMonth(events),
    [events]
  )


  const handleFiles = e => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev =>
        addPhoto(plant.id, { src: ev.target.result, caption: '' })
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }


  const handleWatered = () => {
    markWatered(plant.id, '')
    showToast('Watered')
  }

  const handleFertilized = () => {
    markFertilized(plant.id, '')
    showToast('Fertilized')
  }

  const handleLogEvent = () => {
    setShowNoteModal(true)
  }

  const handleEdit = () => {
    navigate(`/plant/${plant.id}/edit`)
  }


  const saveNote = note => {
    if (note) {
      logEvent(plant.id, 'Note', note)
      showToast('Logged')
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
    <div className="space-y-4 pt-4 pb-safe px-4 relative text-left">
      <Toast />
      <div className="space-y-4">
        <div className="rounded-xl shadow-md overflow-hidden relative">
          <img
            src={plant.image}
            alt={plant.name}
            loading="lazy"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" aria-hidden="true"></div>
          <button
            type="button"
            onClick={() => setShowActionsMenu(v => !v)}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
          >
            <DotsThreeVertical className="w-5 h-5 text-gray-700" aria-hidden="true" />
            <span className="sr-only">More options</span>
          </button>
          <span className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
            <Drop className="w-3 h-3" aria-hidden="true" />
            {plant.lastWatered}
          </span>
          <span className="absolute top-2 left-24 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full animate-fade-in-up">
            🪴 Featured Plant
          </span>
          {showActionsMenu && (
            <ul className="absolute top-10 right-2 bg-white border rounded shadow z-10">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setShowActionsMenu(false)
                    handleEdit()
                  }}
                  className="block px-3 py-1 text-sm text-left w-full hover:bg-gray-100"
                >
                  Edit Plant
                </button>
              </li>
            </ul>
          )}
          <div className="absolute bottom-3 left-4 text-white drop-shadow">
            <h2 className="text-2xl font-semibold font-headline">{plant.name}</h2>
            {plant.nickname && (
              <p className="text-sm text-gray-200">{plant.nickname}</p>
            )}
          </div>
        </div>
        <section className="bg-white rounded-xl shadow-sm p-4 space-y-3">
          <h3 className="flex items-center gap-2 font-semibold font-headline">
            <Clock className="w-5 h-5 text-gray-600" aria-hidden="true" />
            Quick Stats
          </h3>
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1 text-blue-600">
              <Drop className="w-4 h-4" aria-hidden="true" />
              Last watered:
            </span>
            <span className="text-gray-700">{plant.lastWatered}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <CalendarCheck className="w-4 h-4" aria-hidden="true" />
              Next watering:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{plant.nextWater}</span>
              <button
                type="button"
                onClick={handleWatered}
                aria-label={`Mark ${plant.name} as watered`}
                className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs"
              >
                Water Now
              </button>
            </div>
          </div>
          {plant.nextFertilize && (
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-1 text-yellow-600">
                <Flower className="w-4 h-4" aria-hidden="true" />
                Next fertilizing:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{plant.nextFertilize}</span>
                <button
                  type="button"
                  onClick={handleFertilized}
                  aria-label={`Mark ${plant.name} as fertilized`}
                  className="px-2 py-0.5 bg-yellow-600 text-white rounded text-xs"
                >
                  Fertilize Now
                </button>
              </div>
            </div>
          )}
          {plant.lastFertilized && (
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-1 text-yellow-600">
                <Flower className="w-4 h-4" aria-hidden="true" />
                Last fertilized:
              </span>
              <span className="text-gray-700">{plant.lastFertilized}</span>
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow-sm p-4 space-y-3">
          <h3 className="flex items-center gap-2 font-semibold font-headline">
            <Sun className="w-5 h-5 text-yellow-600" aria-hidden="true" />
            Care Profile
          </h3>
          {plant.light && (
            <>
              <h4 className="text-xs font-semibold text-gray-500 mb-1">Light Needs</h4>
              <div className="flex gap-2 mb-3">
                <Badge Icon={Sun} colorClass="bg-yellow-50 text-yellow-800 text-xs">
                  {plant.light}
                </Badge>
              </div>
            </>
          )}
          <h4 className="text-xs font-semibold text-gray-500 mb-1 mt-1">Care Tags</h4>
          <div className="flex flex-wrap gap-2">
            {plant.humidity && (
              <Badge Icon={Drop} colorClass="bg-blue-50 text-blue-800 text-xs">
                {plant.humidity}
              </Badge>
            )}
            {plant.difficulty && (
              <Badge Icon={Gauge} colorClass="bg-green-50 text-green-800 text-xs">
                {plant.difficulty}
              </Badge>
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <h3 className="flex items-center gap-2 font-semibold font-headline mb-1">
            <Note className="w-5 h-5 text-gray-600" aria-hidden="true" />
            Activity & Notes
          </h3>
          {groupedEvents.map(([monthKey, list]) => (
            <div key={monthKey} className="mt-2 first:mt-0">
              <div className="text-sm font-semibold text-gray-500">{formatMonth(monthKey)}</div>
              <div className="ml-3 border-l-2 border-gray-200 space-y-4 mt-2 pl-5">
                {list.map((e, i) => {
                  const Icon = actionIcons[e.type]
                  return (
                    <div key={`${e.date}-${i}`} className="relative text-sm">
                      <div className={`absolute -left-5 top-1 w-3 h-3 rounded-full ${bulletColors[e.type]}`}></div>
                      <p className="flex items-start gap-2 text-gray-700 ml-1">
                        {Icon && <Icon className={`w-4 h-4 ${iconColors[e.type]}`} aria-hidden="true" />}
                        <span>
                          <span className="font-medium">{formatDate(e.date)}</span> — {e.label}
                          {e.note && (
                            <>: <em>{e.note}</em></>
                          )}
                        </span>
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleLogEvent}
            className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
          >
            + Add Note
          </button>
        </section>
      </div>

      <section className="bg-white rounded-xl shadow-sm p-4 space-y-2">
        <h3 className="flex items-center gap-2 font-semibold font-headline mb-1">
          <Image className="w-5 h-5 text-gray-600" aria-hidden="true" />
          Gallery
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {(plant.photos || []).map((photo, i) => {
            const { src, caption } = photo
            return (
              <div key={i} className="relative flex flex-col items-center">
                <button type="button" onClick={() => setLightboxIndex(i)} className="block focus:outline-none">
                  <img
                    src={src}
                    alt={`${plant.name} ${i}`}
                    className="object-cover w-full h-24 rounded"
                  />
                </button>
                {caption && <p className="text-xs mt-1 w-24 text-center">{caption}</p>}

                <button
                  className="absolute top-1 right-1 bg-white bg-opacity-70 rounded px-1 text-xs"
                  onClick={() => removePhoto(plant.id, i)}
                >
                  ✕
                </button>
              </div>
            )
          })}
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
      </section>
      {showNoteModal && (
        <NoteModal label="Note" onSave={saveNote} onCancel={cancelNote} />
      )}
  </div>
)
}
