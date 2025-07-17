import { createContext, useContext, useEffect, useState } from 'react'
import initialPlants from './plants.json'
import { useWeather } from './WeatherContext.jsx'
import { getNextWateringDate } from './utils/watering.js'

const PlantContext = createContext()

export const addBase = url => {
  if (!url) return url
  if (/^https?:/.test(url) || url.startsWith('data:')) return url
  const base = (process.env.VITE_BASE_PATH || '/').replace(/\/$/, '')
  if (url.startsWith(base)) return url
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

const mapPhoto = photo => {
  if (!photo) return photo
  if (typeof photo === 'string') {
    return { src: addBase(photo) }
  }
  return { ...photo, src: addBase(photo.src) }
}

export function PlantProvider({ children }) {

  const [plants, setPlants] = useState(() => {
    const mapPlant = p => ({
      ...p,
      image: addBase(p.image),
      photos: (p.photos || p.gallery || []).map(mapPhoto),
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

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('plants', JSON.stringify(plants))
    }
  }, [plants])

  const logEvent = (id, type, note = '') => {
    const date = new Date().toISOString().slice(0, 10)
    setPlants(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, careLog: [...(p.careLog || []), { date, type, note }] }
          : p
      )
    )
  }

  const markWatered = (id, note) => {
    setPlants(prev =>
      prev.map(p => {
        if (p.id === id) {
          const today = new Date().toISOString().slice(0, 10)
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

  const markFertilized = (id, note) => {
    setPlants(prev =>
      prev.map(p => {
        if (p.id === id) {
          const today = new Date().toISOString().slice(0, 10)
          let nextDate = new Date(today)
          if (p.lastFertilized && p.nextFertilize) {
            const last = new Date(p.lastFertilized)
            const next = new Date(p.nextFertilize)
            const diff = Math.round((next - last) / 86400000) || 30
            nextDate.setDate(nextDate.getDate() + diff)
          } else {
            nextDate.setMonth(nextDate.getMonth() + 1)
          }
          return {
            ...p,
            lastFertilized: today,
            nextFertilize: nextDate.toISOString().slice(0, 10),
          }
        }
        return p
      })
    )
    logEvent(id, 'Fertilized', note)
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

  const restorePlant = (plant, index) => {
    setPlants(prev => {
      const arr = [...prev]
      const pos = index != null ? index : arr.length
      arr.splice(pos, 0, plant)
      return arr
    })
  }

  const addPhoto = (id, photo) => {
    const newPhoto = mapPhoto(photo)
    setPlants(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, photos: [...(p.photos || []), newPhoto] }
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
        markFertilized,
        logEvent,
        addPlant,
        updatePlant,
        removePlant,
        restorePlant,
        addPhoto,
        removePhoto,
      }}
    >
      {children}
    </PlantContext.Provider>
  )
}

export const usePlants = () => useContext(PlantContext)
