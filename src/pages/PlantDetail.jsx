import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef, useMemo, useEffect } from 'react'

import {
  Clock,
  Sun,
  Drop,
  Gauge,
  Flower,
  Image,
  Note,
  Info,
  ArrowLeft,
  CaretDown,
  CaretRight,
} from 'phosphor-react'

import Lightbox from '../components/Lightbox.jsx'

import { usePlants } from '../PlantContext.jsx'
import actionIcons from '../components/ActionIcons.jsx'
import NoteModal from '../components/NoteModal.jsx'
import { PlusIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { useMenu, defaultMenu } from '../MenuContext.jsx'
import LegendModal from '../components/LegendModal.jsx'
import ProgressRing from '../components/ProgressRing.jsx'

import useToast from "../hooks/useToast.jsx"
import Badge from '../components/Badge.jsx'

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

  const ringClass = ringColors[plant?.urgency] || 'text-green-600'
  const progressPct = getWateringProgress(plant?.lastWatered, plant?.nextWater)

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

  const handleBack = () => {
    navigate(-1)
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
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back"
            className="absolute top-2 left-2 bg-white bg-opacity-70 rounded p-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
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
          <div
            className="absolute bottom-2 right-2"
            data-testid="watering-ring"
            aria-label={`Watering progress ${Math.round(progressPct * 100)}%`}
          >
            <div className="relative" style={{ width: 48, height: 48 }}>
              <ProgressRing percent={progressPct} size={48} colorClass={ringClass} />
              <div className="absolute inset-1 rounded-full bg-white/80 flex items-center justify-center text-[10px] font-semibold">
                {Math.round(progressPct * 100)}%
              </div>
            </div>
          </div>
        </div>
        </div>

<section className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4 space-y-3">
  <h3 className="flex items-center gap-2 font-semibold font-headline">
    <Clock className="w-5 h-5 text-gray-600 dark:text-gray-200" aria-hidden="true" />
    Quick Stats
  </h3>
  <div className="space-y-3">
    <div className={`rounded-lg p-3 border-l-4 ${waterBorderClass} bg-water-50 dark:bg-water-900/30`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 font-headline font-semibold text-water-700 dark:text-water-200">
          <Drop className="w-4 h-4" aria-hidden="true" />
          Watering
        </div>
        <button
          type="button"
          onClick={handleWatered}
          aria-label={`Mark ${plant.name} as watered`}
          className="px-2 py-1 border border-water-600 text-water-600 rounded text-xs flex items-center gap-1 group"
        >
          <Drop className="w-3 h-3 group-active:drip-pulse" aria-hidden="true" />
          Mark Watered
        </button>
      </div>
      <p className="text-sm mt-1">
        <span className="text-gray-500">Last watered:</span>{' '}
        <span className="text-gray-900 dark:text-gray-100">
          {formatDaysAgo(plant.lastWatered)}
          {formatTimeOfDay(plant.lastWatered) ? ` \u00B7 ${formatTimeOfDay(plant.lastWatered)}` : ''} (
          <span>{plant.lastWatered}</span>
          )
        </span>
      </p>
      <p className={"text-sm " + (overdueWaterDays > 0 ? 'text-red-600 dark:text-red-400' : '')}>
        <span className={overdueWaterDays > 0 ? '' : 'text-gray-500'}>Next due:</span>{' '}
        <span className={overdueWaterDays > 0 ? '' : 'text-gray-900 dark:text-gray-100'}>{plant.nextWater}</span>
        {overdueWaterDays > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100">
            Needs love soon – overdue by {overdueWaterDays} {overdueWaterDays === 1 ? 'day' : 'days'}
          </span>
        )}
      </p>
    </div>
    {plant.nextFertilize && (
      <div className={`rounded-lg p-3 border-l-4 ${fertBorderClass} bg-fertilize-50 dark:bg-fertilize-900/30`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 font-headline font-semibold text-fertilize-700 dark:text-fertilize-200">
            <Flower className="w-4 h-4" aria-hidden="true" />
            Fertilizing
          </div>
          <button
            type="button"
            onClick={handleFertilized}
            aria-label={`Mark ${plant.name} as fertilized`}
            className="px-2 py-1 border border-fertilize-600 text-fertilize-600 rounded text-xs flex items-center gap-1"
          >
            <Flower className="w-3 h-3" aria-hidden="true" /> Mark Fertilized
          </button>
        </div>
        {plant.lastFertilized && (
          <p className="text-sm mt-1">
            <span className="text-gray-500">Last fertilized:</span>{' '}
            <span className="text-gray-900 dark:text-gray-100">
              {formatDaysAgo(plant.lastFertilized)}
              {formatTimeOfDay(plant.lastFertilized) ? ` \u00B7 ${formatTimeOfDay(plant.lastFertilized)}` : ''} (
              <span>{plant.lastFertilized}</span>
              )
            </span>
          </p>
        )}
        <p className={"text-sm " + (overdueFertDays > 0 ? 'text-red-600 dark:text-red-400' : '')}>
          <span className={overdueFertDays > 0 ? '' : 'text-gray-500'}>Next due:</span>{' '}
          <span className={overdueFertDays > 0 ? '' : 'text-gray-900 dark:text-gray-100'}>{plant.nextFertilize}</span>
          {overdueFertDays > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100">
              Needs love soon – overdue by {overdueFertDays} {overdueFertDays === 1 ? 'day' : 'days'}
            </span>
          )}
        </p>
      </div>
    )}
  </div>
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
          {groupedEvents.map(([monthKey, list], idx) => {
            const isCollapsed = collapsedMonths[monthKey]
            return (
              <div key={monthKey} className="mt-6 first:mt-0">
                <h3 className="text-[0.7rem] uppercase tracking-wider text-gray-300 mb-2 flex items-center">
                  <button
                    type="button"
                    aria-expanded={!isCollapsed}
                    onClick={() =>
                      setCollapsedMonths(c => ({ ...c, [monthKey]: !isCollapsed }))
                    }
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
                  className={`${
                    isCollapsed ? 'hidden' : ''
                  } ml-3 border-l-2 border-gray-200 space-y-6 pl-5`}
                >
                  {list.map((e, i) => {
                    const Icon = actionIcons[e.type]
                    return (
                      <li key={`${e.date}-${i}`} className="relative text-xs sm:text-sm">
                        {Icon && (
                          <div
                            className={`absolute -left-5 top-[0.25rem] w-4 h-4 flex items-center justify-center rounded-full ${bulletColors[e.type]}`}
                          >
                            <Icon className="w-3 h-3 text-white" aria-hidden="true" />
                          </div>
                        )}
                        <div
                          className={`flex items-start ${
                            e.note ? 'bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-sm' : ''
                          }`}
                        >
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
                    alt={caption || `${plant.name} photo ${i + 1}`}
                    className="object-cover w-full h-24 rounded-lg"
                  />
                </button>
                {caption && (
                  <p className="text-xs font-medium mt-0.5 px-2 w-24 text-center">
                    {caption}
                  </p>
                )}

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
      </section>
      {showNoteModal && (
        <NoteModal label="Note" onSave={saveNote} onCancel={cancelNote} />
      )}
      {showLegend && (
        <LegendModal onClose={() => setShowLegend(false)} />
      )}
    </div>
  )
}
