import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef, useMemo, useEffect } from 'react'

import {
  Sun,
  Drop,
  Gauge,
  Flower,
  Info,
  CaretDown,
  CaretRight,
  SortAscending,
  SortDescending,
  Note,
  Image as ImageIcon,
} from 'phosphor-react'

import Lightbox from '../components/Lightbox.jsx'
import PageContainer from "../components/PageContainer.jsx"

import { usePlants } from '../PlantContext.jsx'
import actionIcons from '../components/ActionIcons.jsx'
import NoteModal from '../components/NoteModal.jsx'
import { useMenu, defaultMenu } from '../MenuContext.jsx'
import LegendModal from '../components/LegendModal.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import PageHeader from '../components/PageHeader.jsx'
import PlantDetailFab from '../components/PlantDetailFab.jsx'
import SectionCard from '../components/SectionCard.jsx'
import DetailTabs from '../components/DetailTabs.jsx'

import useToast from "../hooks/useToast.jsx"
import confetti from 'canvas-confetti'

import { formatMonth, formatDate } from '../utils/date.js'
import { formatDaysAgo, formatTimeOfDay } from '../utils/dateFormat.js'
import { getWateringProgress } from '../utils/watering.js'

import { buildEvents, groupEventsByMonth } from '../utils/events.js'

const bulletColors = {
  water: 'bg-blue-500',
  fertilize: 'bg-yellow-500',
  note: 'bg-gray-400',
  log: 'bg-green-500',
  advanced: 'bg-purple-500',
  noteText: 'bg-gray-400',
}

const ringColors = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  low: 'text-green-600',
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
  const [collapsedMonths, setCollapsedMonths] = useState({})
  const [latestFirst, setLatestFirst] = useState(true)
  const [activeTab, setActiveTab] = useState('summary')

  const ringClass = ringColors[plant?.urgency] || 'text-green-600'
  const progressPct = getWateringProgress(plant?.lastWatered, plant?.nextWater)
  const fertProgressPct = getWateringProgress(
    plant?.lastFertilized,
    plant?.nextFertilize
  )

  const fabIcons = {
    summary: Drop,
    activity: Note,
    gallery: ImageIcon,
  }

  const now = new Date()
  const nextWaterDate = plant?.nextWater ? new Date(plant.nextWater) : null
  const overdueWaterDays =
    nextWaterDate && now > nextWaterDate
      ? Math.floor((now - nextWaterDate) / 86400000)
      : 0
  const nextFertDate = plant?.nextFertilize
    ? new Date(plant.nextFertilize)
    : null
  const overdueFertDays =
    nextFertDate && now > nextFertDate
      ? Math.floor((now - nextFertDate) / 86400000)
      : 0

  const waterBorderClass =
    overdueWaterDays > 0 ? 'border-red-500' : 'border-green-500'
  const fertBorderClass =
    overdueFertDays > 0 ? 'border-red-500' : 'border-green-500'

  const events = useMemo(() => buildEvents(plant), [plant])
  const groupedEvents = useMemo(() => {
    const grouped = groupEventsByMonth(events)
    if (latestFirst) {
      return grouped
        .map(([month, list]) => [month, [...list].reverse()])
        .reverse()
    }
    return grouped
  }, [events, latestFirst])


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
    if (typeof HTMLCanvasElement !== 'undefined' &&
        HTMLCanvasElement.prototype.getContext) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
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


  // Menu is now consistent across pages so no override here

  useEffect(() => {
    const defaults = {}
    if (groupedEvents.length > 0) {
      groupedEvents.slice(0, -1).forEach(([key]) => {
        defaults[key] = true
      })
    }
    setCollapsedMonths(defaults)
  }, [groupedEvents])


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

  const tabs = [
    {
      id: 'summary',
      label: (
        <span>
          <span role="img" aria-label="Care Summary" className="mr-1">🩺</span>
          Care Summary
        </span>
      ),
      content: (
        <SectionCard className="space-y-3 bg-gray-50 dark:bg-gray-800/40">
          <p className="font-semibold mb-2 flex items-center gap-1 text-lg">
            <span role="img" aria-label="recent care">🌱</span>
            Recent Care Summary
          </p>
          <div className="space-y-3">
            <div className={`relative rounded-lg p-3 border-l-4 ${waterBorderClass} bg-water-50 dark:bg-water-900/30`}>
              <div className="flex items-center gap-1 font-headline font-semibold text-water-700 dark:text-water-200">
                <Drop className="w-4 h-4" aria-hidden="true" />
                Watering
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  Last watered: {formatDaysAgo(plant.lastWatered)} · Next: {plant.nextWater}
                </p>
                {overdueWaterDays > 0 && (
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <span className="mr-1" role="img" aria-label="Overdue">❗</span>
                    {overdueWaterDays} {overdueWaterDays === 1 ? 'day' : 'days'} overdue
                  </div>
                )}
              </div>
            </div>
            {plant.nextFertilize && (
              <div className={`relative rounded-lg p-3 border-l-4 ${fertBorderClass} bg-fertilize-50 dark:bg-fertilize-900/30`}>
                <div className="flex items-center gap-1 font-headline font-semibold text-fertilize-700 dark:text-fertilize-200">
                  <Flower className="w-4 h-4" aria-hidden="true" />
                  Fertilizing
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    Last fertilized:{' '}
                    {plant.lastFertilized ? formatDaysAgo(plant.lastFertilized) : 'Never'} · Next: {plant.nextFertilize}
                  </p>
                  {overdueFertDays > 0 && (
                    <div className="flex items-center text-red-600 dark:text-red-400">
                      <span className="mr-1" role="img" aria-label="Overdue">❗</span>
                      {overdueFertDays} {overdueFertDays === 1 ? 'day' : 'days'} overdue
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {(plant.light || plant.humidity || plant.difficulty) && (
            <ul className="space-y-1 text-sm">
              {plant.light && (
                <li className="flex items-center gap-2">
                  <Sun className="w-4 h-4" aria-hidden="true" /> {plant.light}
                </li>
              )}
              {plant.humidity && (
                <li className="flex items-center gap-2">
                  <Drop className="w-4 h-4" aria-hidden="true" /> {plant.humidity}
                </li>
              )}
              {plant.difficulty && (
                <li className="flex items-center gap-2">
                  <Gauge className="w-4 h-4" aria-hidden="true" /> {plant.difficulty}
                </li>
              )}
            </ul>
          )}
        </SectionCard>
      ),
    },
    {
      id: 'activity',
      label: (
        <span>
          <span role="img" aria-label="Activity" className="mr-1">📅</span>
          Activity
        </span>
      ),
      content: (
        <SectionCard className="space-y-4 bg-gray-50 dark:bg-gray-800/40">
          <p className="font-semibold mb-2 flex items-center gap-1 text-lg">
            <span role="img" aria-label="recent activity">📝</span>
            Recent Activity
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setLatestFirst(l => !l)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {latestFirst ? (
                <SortDescending className="w-4 h-4" aria-hidden="true" />
              ) : (
                <SortAscending className="w-4 h-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {latestFirst ? 'Show oldest first' : 'Show newest first'}
              </span>
            </button>
            <button type="button" onClick={() => setShowLegend(true)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Info className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Legend</span>
            </button>
          </div>
          {groupedEvents.map(([monthKey, list]) => {
            const isCollapsed = collapsedMonths[monthKey]
            return (
              <div key={monthKey} className="mt-6 first:mt-0">
                <h3 className="sticky top-0 z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-1 text-timestamp uppercase tracking-wider text-gray-300 mb-2 flex items-center">
                  <button
                    type="button"
                    aria-expanded={!isCollapsed}
                    onClick={() => setCollapsedMonths(c => ({ ...c, [monthKey]: !isCollapsed }))}
                    className="mr-1"
                  >
                    {isCollapsed ? (
                      <CaretRight className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <CaretDown className="w-3 h-3" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {isCollapsed ? 'Expand month' : 'Collapse month'}
                    </span>
                  </button>
                  {formatMonth(monthKey)}
                </h3>
                <ul
                  className={`${isCollapsed ? 'hidden' : ''} relative ml-3 space-y-8 pl-5 before:absolute before:inset-y-0 before:left-2 before:w-px before:bg-gray-200`}
                >
                  {list.map((e, i) => {
                    const Icon = actionIcons[e.type]
                    return (
                      <li key={`${e.date}-${i}`} className="relative text-xs sm:text-sm">
                        {Icon && (
                          <div className={`absolute -left-5 top-[0.25rem] w-4 h-4 flex items-center justify-center rounded-full ${bulletColors[e.type]} z-10`}>
                            <Icon className="w-3 h-3 text-white" aria-hidden="true" />
                          </div>
                        )}
                        <div className={`flex items-start ${e.note ? 'bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-sm' : ''}`}>
                          <div>
                            <span className="font-medium">{formatDate(e.date)}</span> — {e.label}
                            {e.note && (
                              <div className="text-xs italic text-green-700 mt-1">{e.note}</div>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </SectionCard>
      ),
    },
    {
      id: 'gallery',
      label: (
        <span>
          <span role="img" aria-label="Gallery" className="mr-1">🖼</span>
          Gallery
        </span>
      ),
      content: (
        <SectionCard className="space-y-2 bg-gray-50 dark:bg-gray-800/40">
          <p className="font-semibold mb-2 flex items-center gap-1 text-lg">
            <span role="img" aria-label="plant gallery">📷</span>
            Your Plant Gallery
          </p>
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1 sm:pb-2">
            {(plant.photos || [])
              .slice(0, 3)
              .map((photo, i) => {
                const { src, caption } = photo
                return (
                  <div key={i} className="relative flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className="block focus:outline-none"
                    >
                      <img
                        src={src}
                        alt={caption || `${plant.name} photo ${i + 1}`}
                        className="plant-thumb w-24 rounded-lg shadow-sm"
                      />
                    </button>
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
        </SectionCard>
      ),
    },
  ]

  if (!plant) {
    return <div className="text-gray-700 dark:text-gray-200">Plant not found</div>
  }

  return (
    <>
      <div className="full-bleed relative mb-1 -mt-8">
        <div className="hidden lg:block absolute inset-0 overflow-hidden -z-10">
          <img
            src={plant.image}
            alt=""
            className="w-full h-full object-cover blur-2xl scale-110"
            aria-hidden="true"
          />
        </div>
        <div className="rounded-b-xl shadow-md overflow-hidden relative">
          <img
            src={plant.image}
            alt={plant.name}
            loading="lazy"
            className="w-full h-64 object-cover"
          />
          <div className="img-gradient-overlay" aria-hidden="true"></div>
          <div className="absolute bottom-2 left-3 right-3 flex flex-col sm:flex-row justify-between text-white drop-shadow space-y-1 sm:space-y-0">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-heading font-semibold font-headline">{plant.name}</h2>
                <div className="relative" style={{ width: 24, height: 24 }} aria-label="Watering progress">
                  <ProgressRing percent={progressPct} size={24} colorClass={ringClass} />
                </div>
              </div>
              {plant.nickname && <p className="text-sm text-gray-200">{plant.nickname}</p>}
            </div>
            {/* brief care stats moved to Care Summary tab */}
          </div>
        </div>
      </div>
      <PageContainer className="relative text-left pt-0 space-y-3">
        <Toast />
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <PageHeader
              breadcrumb={{ room: plant.room, plant: plant.name }}
              className="mb-1"
            />
          </div>

          <DetailTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
        </div>
        <PlantDetailFab
          onAddPhoto={openFileInput}
          onAddNote={handleLogEvent}
          onWater={handleWatered}
          onFertilize={handleFertilized}
          icon={fabIcons[activeTab]}
        />
        {showNoteModal && (
          <NoteModal label="Note" onSave={saveNote} onCancel={cancelNote} />
        )}
        {showLegend && (
          <LegendModal onClose={() => setShowLegend(false)} />
        )}
      </PageContainer>
    </>
  )
}
