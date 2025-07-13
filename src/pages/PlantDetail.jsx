import { useParams, Link } from 'react-router-dom'
import { useState, useRef, useMemo } from 'react'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from '../components/ActionIcons.jsx'
import { formatMonth } from '../utils/date.js'

export default function PlantDetail() {
  const { id } = useParams()
  const { plants, addPhoto, removePhoto } = usePlants()
  const plant = plants.find(p => p.id === Number(id))

  const tabNames = ['activity', 'notes', 'care', 'timeline']
  const tabRefs = useRef([])
  const [tab, setTab] = useState('activity')
  const [showMore, setShowMore] = useState(false)
  const fileInputRef = useRef()

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
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      const nextIndex = (index + dir + tabNames.length) % tabNames.length
      setTab(tabNames[nextIndex])
      tabRefs.current[nextIndex]?.focus()
    }
  }

  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  return (
    <div className="space-y-2">
      <div className="space-y-4">
        <img src={plant.image} alt={plant.name} loading="lazy" className="w-full h-64 object-cover rounded-xl" />
        <div>
          <h1 className="text-3xl font-bold font-display">{plant.name}</h1>
          {plant.nickname && <p className="text-gray-500">{plant.nickname}</p>}
        </div>

        <div className="grid gap-1 text-sm">
          <p><strong>Last watered:</strong> {plant.lastWatered}</p>
          <p><strong>Next watering:</strong> {plant.nextWater}</p>
          {plant.lastFertilized && (
            <p><strong>Last fertilized:</strong> {plant.lastFertilized}</p>
          )}
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

        <div>
          <Link
            to={`/plant/${plant.id}/gallery`}
            className="text-green-600 underline"
          >
            View Gallery
          </Link>
        </div>

        <div>
          <div className="flex space-x-4 border-b" role="tablist">
            <button
              role="tab"
              ref={el => (tabRefs.current[0] = el)}
              aria-selected={tab === 'activity'}
              tabIndex={tab === 'activity' ? 0 : -1}
              className={`py-2 ${tab === 'activity' ? 'border-b-2 border-green-500 font-medium' : ''}`}
              onClick={() => setTab('activity')}
              onKeyDown={e => handleKeyDown(e, 0)}
            >
              Activity
            </button>
            <button
              role="tab"
              ref={el => (tabRefs.current[1] = el)}
              aria-selected={tab === 'notes'}
              tabIndex={tab === 'notes' ? 0 : -1}
              className={`py-2 ${tab === 'notes' ? 'border-b-2 border-green-500 font-medium' : ''}`}
              onClick={() => setTab('notes')}
              onKeyDown={e => handleKeyDown(e, 1)}
            >
              Notes
            </button>
            <button
              role="tab"
              ref={el => (tabRefs.current[2] = el)}
              aria-selected={tab === 'care'}
              tabIndex={tab === 'care' ? 0 : -1}
              className={`py-2 ${tab === 'care' ? 'border-b-2 border-green-500 font-medium' : ''}`}
              onClick={() => setTab('care')}
              onKeyDown={e => handleKeyDown(e, 2)}
            >
              Advanced
            </button>
            <button
              role="tab"
              ref={el => (tabRefs.current[3] = el)}
              aria-selected={tab === 'timeline'}
              tabIndex={tab === 'timeline' ? 0 : -1}
              className={`py-2 ${tab === 'timeline' ? 'border-b-2 border-green-500 font-medium' : ''}`}
              onClick={() => setTab('timeline')}
              onKeyDown={e => handleKeyDown(e, 3)}
            >
              Timeline
            </button>
          </div>
          <div className="p-4">
            {tab === 'activity' && (
              <ul className="list-disc pl-4 space-y-1">
                {(plant.careLog || []).map((ev, i) => (
                  <li key={i}>
                    {ev.type} on {ev.date}
                    {ev.note ? ` - ${ev.note}` : ''}
                  </li>
                ))}
              </ul>
            )}
            {tab === 'notes' && (
              <div>
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
            {tab === 'care' && (
              <div>{plant.advancedCare || 'No advanced care info.'}</div>
            )}
            {tab === 'timeline' && (
              <div>
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
      <div className="space-y-2">
        <h2 className="text-xl font-semibold font-display">Gallery</h2>
        <div className="grid grid-cols-3 gap-2">
          {(plant.photos || []).map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                alt={`${plant.name} ${i}`}
                className="object-cover w-full h-24 rounded"
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
    </div>
  </div>
)
}
