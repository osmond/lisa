import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef, useMemo } from 'react'

import {
  Activity,
  Note,
  Sun,
  Drop,
  Gauge,
  CalendarCheck,
  Flower,
  DotsThreeVertical,
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


export default function PlantDetail() {
  const { id } = useParams()
  const { plants, addPhoto, removePhoto, markWatered, markFertilized, logEvent } = usePlants()
  const plant = plants.find(p => p.id === Number(id))
  const navigate = useNavigate()

  const tabNames = ['activity', 'notes', 'care', 'timeline']
  const tabRefs = useRef([])
  const [activeTab, setActiveTab] = useState('timeline')
  const [showMore, setShowMore] = useState(false)
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

  const iconColors = {
    water: 'text-blue-500',
    fertilize: 'text-yellow-500',
    note: 'text-gray-400',
    log: 'text-green-500',
  }

  const bulletColors = {
    water: 'bg-blue-500',
    fertilize: 'bg-yellow-500',
    note: 'bg-gray-400',
    log: 'bg-green-500',
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
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      const nextIndex = (index + dir + tabNames.length) % tabNames.length
      setActiveTab(tabNames[nextIndex])
      tabRefs.current[nextIndex]?.focus()
    }
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

  const handleAddPhoto = () => {
    fileInputRef.current?.click()
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
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setShowActionsMenu(false)
                    handleAddPhoto()
                  }}
                  className="block px-3 py-1 text-sm text-left w-full hover:bg-gray-100"
                >
                  Add Photo
                </button>
              </li>
            </ul>
          )}
          <div className="absolute bottom-3 left-4 text-white drop-shadow">
            <h2 className="text-xl font-semibold">{plant.name}</h2>
            {plant.nickname && (
              <p className="text-sm text-gray-200">{plant.nickname}</p>
            )}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-blue-700">
              <Drop className="w-3 h-3" aria-hidden="true" />
              Last watered:
            </span>
            <span className="font-medium text-gray-900">{plant.lastWatered}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-green-700">
              <CalendarCheck className="w-3 h-3" aria-hidden="true" />
              Next watering:
            </span>
            <span className="font-medium text-gray-900">{plant.nextWater}</span>
          </div>
          {plant.lastFertilized && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-amber-700">
                <Flower className="w-3 h-3" aria-hidden="true" />
                Last fertilized:
              </span>
              <span className="font-medium text-gray-900">{plant.lastFertilized}</span>
            </div>
          )}
        </div>


        <div className="space-y-1 mt-4">
          <h3 className="text-base font-semibold font-headline">Care Profile</h3>
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
        </div>


        <div className="space-y-2 mt-4">
          <div role="tablist" className="flex gap-2">
            <button
              ref={el => (tabRefs.current[0] = el)}
              role="tab"
              id="activity-tab"
              aria-controls="activity-panel"
              aria-selected={activeTab === 'activity'}
              onClick={() => setActiveTab('activity')}
              onKeyDown={e => handleKeyDown(e, 0)}
              className={`relative px-3 py-2 rounded-full text-sm font-medium focus:outline-none after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-white after:transition-transform after:duration-300 ${
                activeTab === 'activity'
                  ? 'bg-green-600 text-white after:scale-x-100'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 after:scale-x-0'
              }`}
            >
              Activity
            </button>
            <button
              ref={el => (tabRefs.current[1] = el)}
              role="tab"
              id="notes-tab"
              aria-controls="notes-panel"
              aria-selected={activeTab === 'notes'}
              onClick={() => setActiveTab('notes')}
              onKeyDown={e => handleKeyDown(e, 1)}
              className={`relative px-3 py-2 rounded-full text-sm font-medium focus:outline-none after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-white after:transition-transform after:duration-300 ${
                activeTab === 'notes'
                  ? 'bg-green-600 text-white after:scale-x-100'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 after:scale-x-0'
              }`}
            >
              Notes
            </button>
            <button
              ref={el => (tabRefs.current[2] = el)}
              role="tab"
              id="care-tab"
              aria-controls="care-panel"
              aria-selected={activeTab === 'care'}
              onClick={() => setActiveTab('care')}
              onKeyDown={e => handleKeyDown(e, 2)}
              className={`relative px-3 py-2 rounded-full text-sm font-medium focus:outline-none after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-white after:transition-transform after:duration-300 ${
                activeTab === 'care'
                  ? 'bg-green-600 text-white after:scale-x-100'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 after:scale-x-0'
              }`}
            >
              Advanced
            </button>
            <button
              ref={el => (tabRefs.current[3] = el)}
              role="tab"
              id="timeline-tab"
              aria-controls="timeline-panel"
              aria-selected={activeTab === 'timeline'}
              onClick={() => setActiveTab('timeline')}
              onKeyDown={e => handleKeyDown(e, 3)}
              className={`relative px-3 py-2 rounded-full text-sm font-medium focus:outline-none after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-white after:transition-transform after:duration-300 ${
                activeTab === 'timeline'
                  ? 'bg-green-600 text-white after:scale-x-100'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 after:scale-x-0'
              }`}
            >
              Timeline
            </button>
          </div>
          <div
            role="tabpanel"
            id="activity-panel"
            aria-labelledby="activity-tab"
            hidden={activeTab !== 'activity'}
            className="p-4 border rounded-xl"
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
          <div
            role="tabpanel"
            id="notes-panel"
            aria-labelledby="notes-tab"
            hidden={activeTab !== 'notes'}
            className="p-4 border rounded-xl"
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
          <div
            role="tabpanel"
            id="care-panel"
            aria-labelledby="care-tab"
            hidden={activeTab !== 'care'}
            className="p-4 border rounded-xl"
          >
            {plant.advancedCare || 'No advanced care info.'}
          </div>
          <div
            role="tabpanel"
            id="timeline-panel"
            aria-labelledby="timeline-tab"
            hidden={activeTab !== 'timeline'}
            className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm"
          >
            {groupedEvents.map(([monthKey, list]) => (
              <div key={monthKey} className="mt-6 first:mt-0">
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

            <div key={i} className="relative">
              <button type="button" onClick={() => setLightboxIndex(i)} className="block focus:outline-none">
                <img
                  src={src}
                  alt={`${plant.name} ${i}`}
                  className="object-cover w-full h-24 rounded"
                />
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
      {showNoteModal && (
        <NoteModal label="Note" onSave={saveNote} onCancel={cancelNote} />
      )}
  </div>
)
}
