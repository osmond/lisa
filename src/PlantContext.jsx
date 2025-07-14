import { createContext, useContext, useEffect, useState } from 'react'
import initialPlants from './plants.json'
import { useWeather } from './WeatherContext.jsx'
import { getNextWateringDate } from './utils/watering.js'

const PlantContext = createContext()

export function PlantProvider({ children }) {
  const addBase = url => {
    if (!url) return url
    if (/^https?:/.test(url) || url.startsWith('data:')) return url
    const base = (process.env.VITE_BASE_PATH || '/').replace(/\/$/, '')
    if (url.startsWith(base)) return url
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`
  }

  const [plants, setPlants] = useState(() => {
    const mapPlant = p => ({
      ...p,
      image: addBase(p.image),
      photos: (p.photos || p.gallery || []).map(photo =>
        typeof photo === 'string'
          ? { url: addBase(photo), date: '', note: '', tags: [] }
          : { ...photo, url: addBase(photo.url) }
      ),
      careLog: p.careLog || [],
    })

    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('plants')
      if (stored) {
        try {
          return JSON.parse(stored).map(mapPlant)
        } catch {
          // fall through to initial plants
        }
      }
    }
    return initialPlants.map(mapPlant)
  })

  const weatherCtx = useWeather()
  const weather = { rainTomorrow: weatherCtx?.forecast?.rainfall || 0 }
  const timezone = weatherCtx?.timezone

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('plants', JSON.stringify(plants))
    }
  }, [plants])


  const logEvent = (
    id,
    type,
    note = '',
    date = new Date().toISOString().slice(0, 10),
    mood = ''
  ) => {
    setPlants(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              careLog: [...(p.careLog || []), { date, type, note, mood }],
            }
          : p
      )
    )
  }

  const markWatered = (id, note) => {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: timezone })
    )
    const today = now.toISOString().slice(0, 10)
    setPlants(prev =>
      prev.map(p => {
        if (p.id === id) {
          const { date: nextStr, reason } = getNextWateringDate(today, weather)
          return {
            ...p,
            lastWatered: today,
            nextWater: nextStr,
            nextWaterReason: reason,
          }
        }
        return p
      })
    )
    logEvent(id, 'Watered', note)
  }

  const addPlant = plant => {
    setPlants(prev => {
      const nextId = prev.reduce((m, p) => Math.max(m, p.id), 0) + 1
      return [
        ...prev,
        { id: nextId, ...plant, photos: [], careLog: [] },
      ]
    })
  }

  const updatePlant = (id, updates) => {
    setPlants(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)))
  }

  const removePlant = id => {
    setPlants(prev => prev.filter(p => p.id !== id))
  }

  const addPhoto = (id, photo) => {
    const entry =
      typeof photo === 'string'
        ? { url: photo, date: '', note: '', tags: [] }
        : photo
    setPlants(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, photos: [...(p.photos || []), entry] }
          : p
      )
    )
  }

  const removePhoto = (id, index) => {
    setPlants(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = (p.photos || []).filter((_, i) => i !== index)
          return { ...p, photos: updated }
        }
        return p
      })
    )
  }

  return (
    <PlantContext.Provider
      value={{
        plants,
        markWatered,
        logEvent,
        addPlant,
        updatePlant,
        removePlant,
        addPhoto,
        removePhoto,
      }}
    >
      {children}
    </PlantContext.Provider>
  )
}

export const usePlants = () => useContext(PlantContext)
