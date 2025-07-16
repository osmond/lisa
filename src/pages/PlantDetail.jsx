import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef, useMemo } from 'react'

import {
  Drop,
  DotsThreeVertical,
} from 'phosphor-react'

import QuickStatsCard from '../components/QuickStatsCard.jsx'
import CareProfileCard from '../components/CareProfileCard.jsx'
import ActivityTabs from '../components/ActivityTabs.jsx'
import GalleryPanel from '../components/GalleryPanel.jsx'
import { usePlants } from '../PlantContext.jsx'
import NoteModal from '../components/NoteModal.jsx'
import Accordion from '../components/Accordion.jsx'
import useToast from "../hooks/useToast.jsx"
import { formatDate } from '../utils/date.js'
import { buildEvents, groupEventsByMonth } from '../utils/events.js'

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

export default function PlantDetail() {
  const { id } = useParams()
  const { plants, addPhoto, removePhoto, markWatered, markFertilized, logEvent } = usePlants()
  const plant = plants.find(p => p.id === Number(id))
  const navigate = useNavigate()

  const fileInputRef = useRef()
  const { Toast, showToast } = useToast()
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)

  const events = useMemo(() => buildEvents(plant), [plant])
  const groupedEvents = useMemo(() => groupEventsByMonth(events), [events])

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

        <QuickStatsCard
          lastWatered={plant.lastWatered}
          nextWater={plant.nextWater}
          lastFertilized={plant.lastFertilized}
        />

        {events.length > 0 && (
          <div className="mt-4 border-l-4 border-blue-500 pl-4">
            <p className="text-sm font-medium text-gray-800">
              {events[events.length - 1].label} on {formatDate(events[events.length - 1].date)}
            </p>
            {events[events.length - 1].note && (
              <p className="text-xs italic text-green-700 mt-1">“{events[events.length - 1].note}”</p>
            )}
          </div>
        )}

        <CareProfileCard
          light={plant.light}
          humidity={plant.humidity}
          difficulty={plant.difficulty}
        />

        <ActivityTabs plant={plant} events={events} groupedEvents={groupedEvents} />
      </div>

      <GalleryPanel
        plant={plant}
        addPhoto={addPhoto}
        removePhoto={removePhoto}
        inputRef={fileInputRef}
      />

      {showNoteModal && (
        <NoteModal label="Note" onSave={saveNote} onCancel={cancelNote} />
      )}
    </div>
  )
}
