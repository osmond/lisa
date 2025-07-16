import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef, useMemo } from 'react'

import {
  Clock,
  Sun,
  Drop,
  Gauge,
  CalendarCheck,
  Flower,
  Image,
  Note,
  Info,
} from 'phosphor-react'

import { PlusIcon } from '@radix-ui/react-icons'
import Lightbox from '../components/Lightbox.jsx'

import { usePlants } from '../PlantContext.jsx'
import actionIcons from '../components/ActionIcons.jsx'
import NoteModal from '../components/NoteModal.jsx'
import PlantDetailFab from '../components/PlantDetailFab.jsx'
import LegendModal from '../components/LegendModal.jsx'

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
  const [showLegend, setShowLegend] = useState(false)

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

  const openFileInput = () => {
    fileInputRef.current?.click()
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
    return <div className="text-gray-700 dark:text-gray-200">Plant not found</div>
  }

  return (

    <div className="space-y-8 pt-4 pb-safe px-4 relative text-left">

      <Toast />
      <div className="space-y-4">
        <div className="relative">
          <div className="hidden lg:block absolute inset-0 rounded-xl overflow-hidden -z-10">
            <img
              src={plant.image}
              alt=""
              className="w-full h-full object-cover blur-2xl scale-110"
              aria-hidden="true"
            />
          </div>
          <div className="rounded-xl shadow-md overflow-hidden relative">
          <img
            src={plant.image}
            alt={plant.name}
            loading="lazy"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" aria-hidden="true"></div>
          <div className="absolute bottom-3 left-4 text-white drop-shadow">
            <h2 className="text-2xl font-semibold font-headline">{plant.name}</h2>
            {plant.nickname && (
              <p className="text-sm text-gray-200">{plant.nickname}</p>
            )}
          </div>
          <div
            className="absolute top-2 right-2 z-10 flex flex-wrap gap-2"
            aria-label="Care tags"
          >
            {plant.light && (
              <Badge Icon={Sun} colorClass="bg-yellow-50 text-yellow-800 text-xs">
                {plant.light}
              </Badge>
            )}
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
        </div>
        </div>
        <section className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4 space-y-3">
          <h3 className="flex items-center gap-2 font-semibold font-headline">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-200" aria-hidden="true" />
            Quick Stats
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Drop className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span className="flex-1">Last watered:</span>
              <span className="text-gray-700 dark:text-gray-200">{plant.lastWatered}</span>
            </li>
            <li className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-green-600" aria-hidden="true" />
              <span className="flex-1">Next watering:</span>
              <span className="text-gray-700 dark:text-gray-200">{plant.nextWater}</span>
              <button
                type="button"
                onClick={handleWatered}
                aria-label={`Mark ${plant.name} as watered`}
                className="ml-2 px-2 py-0.5 border border-blue-600 text-blue-600 rounded text-xs"
              >
                Water Now
              </button>
            </li>
            {plant.nextFertilize && (
              <li className="flex items-center gap-2">
                <Flower className="w-4 h-4 text-yellow-600" aria-hidden="true" />
                <span className="flex-1">Next fertilizing:</span>
                <span className="text-gray-700 dark:text-gray-200">{plant.nextFertilize}</span>
                <button
                  type="button"
                  onClick={handleFertilized}
                  aria-label={`Mark ${plant.name} as fertilized`}
                  className="ml-2 px-2 py-0.5 border border-yellow-600 text-yellow-600 rounded text-xs"
                >
                  Fertilize Now
                </button>
              </li>
            )}
            {plant.lastFertilized && (
              <li className="flex items-center gap-2">
                <Flower className="w-4 h-4 text-yellow-600" aria-hidden="true" />
                <span className="flex-1">Last fertilized:</span>
                <span className="text-gray-700 dark:text-gray-200">{plant.lastFertilized}</span>
              </li>
            )}
          </ul>

        </section>


        <section className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4 space-y-4">
          <h3 className="flex items-center gap-2 font-semibold font-headline mb-1">
            <Note className="w-5 h-5 text-gray-600 dark:text-gray-200" aria-hidden="true" />
            Activity & Notes
            <button type="button" onClick={() => setShowLegend(true)} className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Info className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Legend</span>
            </button>
          </h3>
          {groupedEvents.map(([monthKey, list]) => (
            <div key={monthKey} className="mt-2 first:mt-0">
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">{formatMonth(monthKey)}</div>
              <div className="ml-3 border-l-2 border-gray-200 space-y-4 mt-2 pl-5">
                {list.map((e, i) => {
                  const Icon = actionIcons[e.type]
                  return (
                    <div key={`${e.date}-${i}`} className="relative text-sm">
                      <div className={`absolute -left-5 top-1 w-3 h-3 rounded-full ${bulletColors[e.type]}`}></div>
                      <p className="flex items-start gap-2 text-gray-700 dark:text-gray-200 ml-1">
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
            className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-sm"
          >
            + Add Note
          </button>
        </section>
      </div>

      <section className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4 space-y-2">
        <h3 className="flex items-center gap-2 font-semibold font-headline mb-1">
          <Image className="w-5 h-5 text-gray-600 dark:text-gray-200" aria-hidden="true" />
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
                    className="object-cover w-full h-24 rounded-lg"
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
        {(plant.photos || []).length > 3 && (
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="mt-2 text-sm text-blue-600 underline"
          >
            View All Photos
          </button>
        )}
        <button
          type="button"
          onClick={openFileInput}
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
      {showLegend && (
        <LegendModal onClose={() => setShowLegend(false)} />
      )}
      <PlantDetailFab
        onAddNote={handleLogEvent}
        onAddPhoto={openFileInput}
        onEdit={handleEdit}
      />
    </div>
  )
}
