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
} from 'phosphor-react'

import { PlusIcon } from '@radix-ui/react-icons'
import Lightbox from '../components/Lightbox.jsx'

import { usePlants } from '../PlantContext.jsx'
import actionIcons from '../components/ActionIcons.jsx'
import NoteModal from '../components/NoteModal.jsx'

import useToast from "../hooks/useToast.jsx"
import Badge from '../components/Badge.jsx'

import { formatMonth } from '../utils/date.js'

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

  const colors = {
    water: 'bg-blue-500',
    fertilize: 'bg-yellow-500',
    note: 'bg-gray-400',
    log: 'bg-green-400',
    iconBlue: 'text-blue-500',
    iconYellow: 'text-yellow-500',
    iconGray: 'text-gray-400',
    iconGreen: 'text-green-500',
  }

  const iconColors = {
    water: colors.iconBlue,
    fertilize: colors.iconYellow,
    note: colors.iconGray,
    log: colors.iconGreen,
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
    <div className="space-y-2 relative">
      <Toast />
      <div className="space-y-4">
        <div className="relative rounded-t-2xl overflow-hidden">
          <img
            src={plant.image}
            alt={plant.name}
            loading="lazy"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/30 to-transparent text-white">
            <h1 className="text-3xl font-bold font-headline">{plant.name}</h1>
            {plant.nickname && <p className="text-gray-200">{plant.nickname}</p>}
          </div>
        </div>


        <div className="flex flex-wrap gap-2 text-base">
          <Badge Icon={Drop} colorClass="bg-blue-100 text-blue-800">
            <Drop className="w-4 h-4" />

            <span className="font-semibold">Last watered:</span>
            <span>{plant.lastWatered}</span>
          </Badge>
          <Badge Icon={CalendarCheck} colorClass="bg-green-100 text-green-800">
            <span className="font-semibold">Next watering:</span>
            <span>{plant.nextWater}</span>
          </Badge>
          {plant.lastFertilized && (
            <Badge Icon={Flower} colorClass="bg-orange-100 text-orange-800">
              <span className="font-semibold">Last fertilized:</span>
              <span>{plant.lastFertilized}</span>
            </Badge>
          )}
        </div>
        <div className="flex gap-2 mt-3 items-center">
          <button
            type="button"
            onClick={handleWatered}
            className="px-3 py-1 rounded-full bg-accent text-white text-sm font-medium flex items-center gap-1"
          >
            <Drop className="w-4 h-4" aria-hidden="true" />
            Watered
          </button>
          <button
            type="button"
            onClick={handleFertilized}
            className="px-3 py-1 rounded-full bg-accent text-white text-sm font-medium flex items-center gap-1"
          >
            <Flower className="w-4 h-4" aria-hidden="true" />
            Fertilized
          </button>
          <button
            type="button"
            onClick={handleLogEvent}
            className="px-3 py-1 rounded-full bg-accent text-white text-sm font-medium flex items-center gap-1"
          >
            <Note className="w-4 h-4" aria-hidden="true" />
            Add Note
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowActionsMenu(v => !v)}
              className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm font-medium flex items-center gap-1"
            >
              More…
            </button>
            {showActionsMenu && (
              <ul className="absolute right-0 mt-1 bg-white border rounded shadow z-10">
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
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold font-headline">Care Profile</h3>
          <div className="flex flex-wrap gap-2 text-base">
            {plant.light && (
              <Badge Icon={Sun} colorClass="bg-yellow-100 text-yellow-800">
                {plant.light}
              </Badge>
            )}
            {plant.humidity && (
              <Badge Icon={Drop} colorClass="bg-blue-100 text-blue-800">
                {plant.humidity}
              </Badge>
            )}
            {plant.difficulty && (
              <Badge Icon={Gauge} colorClass="bg-green-100 text-green-800">
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
            className="p-4 border rounded-xl"
          >
            {groupedEvents.map(([monthKey, list]) => (
              <div key={monthKey}>
                <h3 className="mt-6 text-base font-semibold text-gray-600">
                  {formatMonth(monthKey)}
                </h3>
                <ul className="relative border-l border-gray-300 pl-6 ml-2 space-y-8">
                  {list.map((e, i) => {
                    const Icon = actionIcons[e.type]
                    return (
                      <li key={`${e.date}-${i}`} className="relative pl-4">
                        <div
                          className={`absolute -left-3 top-0 flex items-center justify-center w-6 h-6 rounded-full ${colors[e.type]}`}
                        >
                          {Icon && <Icon className={`w-4 h-4 ${iconColors[e.type]}`} />}
                        </div>
                        <p className="text-xs text-gray-400">{e.date}</p>
                        <p className="font-medium">{e.label}</p>
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
