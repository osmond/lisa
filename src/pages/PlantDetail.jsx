import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef, useMemo, useEffect } from 'react'

import {
  Drop,
  Flower,
  Info,
  CaretDown,
  CaretRight,
  SortDescending,
  Trash,
  ArrowLeft,
} from 'phosphor-react'

import Lightbox from '../components/Lightbox.jsx'
import PageContainer from "../components/PageContainer.jsx"

import { usePlants } from '../PlantContext.jsx'
import actionIcons from '../components/ActionIcons.jsx'
import NoteModal from '../components/NoteModal.jsx'
import { useMenu, defaultMenu } from '../MenuContext.jsx'
import LegendModal from '../components/LegendModal.jsx'
import CareRings from '../components/CareRings.jsx'
import PlantDetailFab from '../components/PlantDetailFab.jsx'
import DetailTabs from '../components/DetailTabs.jsx'
import BaseCard from '../components/BaseCard.jsx'
import UnifiedTaskCard from '../components/UnifiedTaskCard.jsx'

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
  const [offsetY, setOffsetY] = useState(0)

  const progressPct = getWateringProgress(plant?.lastWatered, plant?.nextWater)
  const waterTotal = 3
  const waterCompleted = Math.round(progressPct * waterTotal)

  const fertPct = getWateringProgress(
    plant?.lastFertilized,
    plant?.nextFertilize
  )
  const fertTotal = 3
  const fertCompleted = Math.round(fertPct * fertTotal)

  const todayIso = new Date().toISOString().slice(0, 10)
  const dueWater = plant?.nextWater && plant.nextWater <= todayIso
  const dueFertilize = plant?.nextFertilize && plant.nextFertilize <= todayIso
  const urgent =
    plant?.urgency === 'high' ||
    (dueWater && plant.nextWater === todayIso) ||
    (dueFertilize && plant.nextFertilize === todayIso)
  const overdue =
    (dueWater && plant.nextWater < todayIso) ||
    (dueFertilize && plant.nextFertilize < todayIso)
  const lastCared = [plant?.lastWatered, plant?.lastFertilized]
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0]

  const lightTag = plant?.light ? plant.light.replace(/Low to medium/i, 'Low') : ''
  const humidityTag = plant?.humidity ? plant.humidity.replace(/Average/i, 'Avg') : ''
  const difficultyTag = plant?.difficulty ? plant.difficulty.replace(/Easy/i, 'EZ') : ''

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
    overdueWaterDays > 0 ? 'border-rose-500' : 'border-green-400'
  const fertBorderClass =
    overdueFertDays > 0 ? 'border-rose-500' : 'border-green-500'

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

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY * -0.2)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


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
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      } catch {
        // Canvas API may be missing in some environments (like jsdom)
      }
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
      label: 'Care Summary',
      content: (
        <div className="space-y-4 p-4">
          <div className="space-y-4">
            <div className={`relative rounded-xl p-5 border-l-4 ${waterBorderClass} bg-water-50 dark:bg-water-900/30 shadow-sm mb-6`}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-water-800 dark:text-water-200 mb-2">
                <Drop className="w-4 h-4" aria-hidden="true" />
                Watering Schedule
              </h3>
              <p className="text-sm text-gray-700 mb-1">
                Last watered: {formatDaysAgo(plant.lastWatered)} · Next: {plant.nextWater}
              </p>
              {overdueWaterDays > 0 && (
                <span className="inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  Overdue {overdueWaterDays} {overdueWaterDays === 1 ? 'day' : 'days'}
                </span>
              )}
            </div>
            {plant.nextFertilize && (
              <div className={`relative rounded-xl p-5 border-l-4 ${fertBorderClass} bg-fertilize-50 dark:bg-fertilize-900/30`}>
                <div className="flex justify-between items-start">
                  <h3 className="flex items-center gap-2 font-headline font-medium text-fertilize-800 dark:text-fertilize-200">
                    <Flower className="w-4 h-4" aria-hidden="true" />
                    Fertilizing Needs
                  </h3>
                  {overdueFertDays > 0 && (
                    <span className="inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      Overdue {overdueFertDays} {overdueFertDays === 1 ? 'day' : 'days'}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm">
                  Last fertilized: {plant.lastFertilized ? formatDaysAgo(plant.lastFertilized) : 'Never'}<br />
                  Next: {plant.nextFertilize}
                </p>
              </div>
            )}
          </div>

          {(plant.light || plant.humidity || plant.difficulty) && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
              {plant.light && (
                <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
                  ☀ {plant.light}
                </span>
              )}
              {plant.humidity && (
                <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
                  💧 {plant.humidity}
                </span>
              )}
              {plant.difficulty && (
                <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
                  🪴 {plant.difficulty}
                </span>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'tasks',
      label: 'Tasks',
      content: (
        <div className="p-4 space-y-2">
          {dueWater || dueFertilize ? (
            <BaseCard variant="task">
              <UnifiedTaskCard
                plant={{
                  ...plant,
                  dueWater,
                  dueFertilize,
                  lastCared,
                }}
                urgent={urgent}
                overdue={overdue}
              />
            </BaseCard>
          ) : (
            <p className="text-center text-gray-500">No tasks due.</p>
          )}
        </div>
      ),
    },
    {
      id: 'activity',
      label: 'Activity',
      content: (
        <div className="space-y-4 p-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setLatestFirst(l => !l)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <SortDescending
                className={`w-4 h-4 transform transition-transform ${latestFirst ? '' : 'rotate-180'}`}
                aria-hidden="true"
              />
              <span className="sr-only">
                {latestFirst ? 'Show oldest first' : 'Show newest first'}
              </span>
            </button>
            <button type="button" onClick={() => setShowLegend(true)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Info className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Legend</span>
            </button>
          </div>
          {events.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              No recent activity for {plant.name}. Start logging care to build a timeline.
            </p>
          )}
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
                  className={`${isCollapsed ? 'hidden' : ''} relative ml-3 space-y-8 pl-5 before:absolute before:inset-y-0 before:left-2 before:border-l before:border-dashed before:border-gray-300 dark:before:border-gray-600`}
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
        </div>
      ),
    },
    {
      id: 'gallery',
      label: 'Gallery',
      content: (
        <div className="space-y-4 p-4">
          {(plant.photos || []).length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              Add your first photo
            </p>
          )}
          <div className="flex flex-nowrap gap-4 overflow-x-auto pb-1 sm:pb-2">
            {(plant.photos || [])
              .slice(0, 3)
              .map((photo, i) => {
                const { src, caption } = photo
                const extra = (plant.photos || []).length - 3
                return (
                  <div
                    key={i}
                    className="relative flex flex-col items-center group transition-all ease-in-out duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className="block focus:outline-none"
                    >
                      <img
                        src={src}
                        alt={caption || `${plant.name} photo ${i + 1}`}
                        className="w-24 aspect-[4/3] object-cover rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105"
                      />
                      {i === 2 && extra > 0 && (
                        <span className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                          +{extra}
                        </span>
                      )}
                    </button>
                    <button
                      aria-label="Remove photo"
                      className="absolute top-1 right-1 bg-white/70 rounded p-1 text-gray-600 hover:text-rose-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all ease-in-out duration-200"
                      onClick={() => removePhoto(plant.id, i)}
                    >
                      <Trash className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                )
              })}
          </div>
          {(plant.photos || []).length > 3 && (
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-gray-500">
                Showing 3 of {(plant.photos || []).length} photos
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="text-green-600 hover:underline"
              >
                View All Photos
              </button>
            </div>
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
        </div>
      ),
    },
  ]

  if (!plant) {
    return <div className="text-gray-700 dark:text-gray-200">Plant not found</div>
  }

  return (
    <>
      <div className="full-bleed relative mb-1 -mt-8 lg:sticky top-0 z-10">
        <div className="hidden lg:block absolute inset-0 overflow-hidden -z-10">
          <img
            src={plant.image}
            alt=""
            className="w-full h-full object-cover blur-2xl scale-110"
            aria-hidden="true"
          />
        </div>
        <div
          className="rounded-b-xl shadow-md overflow-hidden relative"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          <img
            src={plant.image}
            alt={plant.name}
            loading="lazy"
            className="w-full h-[45vh] object-cover"
          />
          <div className="img-gradient-overlay" aria-hidden="true"></div>
          <div className="absolute top-2 left-2 flex items-center gap-1 text-white">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-1 rounded-full bg-black/40 hover:bg-black/50"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Back</span>
            </button>
            {plant.room && (
              <span className="text-sm font-medium">{plant.room}</span>
            )}
          </div>
          <div className="absolute bottom-2 left-3 right-3 flex flex-col sm:flex-row justify-between text-white drop-shadow space-y-1 sm:space-y-0">
            <div>
              <h2 className="text-heading font-extrabold font-headline animate-fade-in-down">{plant.name}</h2>
              {plant.nickname && (
                <p className="text-sm text-gray-200 animate-fade-in-down" style={{ animationDelay: '100ms' }}>
                  {plant.nickname}
                </p>
              )}
            </div>
            {/* brief care stats moved to Care Summary tab */}
          </div>
        </div>
      </div>
      <PageContainer className="relative text-left pt-0 space-y-3">
        <Toast />
        <div className="flex justify-center mt-4" aria-label="Care progress">
          <CareRings
            waterCompleted={waterCompleted}
            waterTotal={waterTotal}
            fertCompleted={fertCompleted}
            fertTotal={fertTotal}
          />
        </div>
        <div className="space-y-3">
          <DetailTabs tabs={tabs} />
        </div>
        <PlantDetailFab
          onAddPhoto={openFileInput}
          onAddNote={handleLogEvent}
          onWater={handleWatered}
          onFertilize={handleFertilized}
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
