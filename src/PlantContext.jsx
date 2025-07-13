import { createContext, useContext, useEffect, useState } from 'react'
import initialPlants from './plants.json'
import useWeather from './useWeather.js'
import { getNextWateringDate } from './utils/watering.js'

const PlantContext = createContext()

export function PlantProvider({ children }) {
  const [plants, setPlants] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('plants')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          // fall through to initial plants
        }
      }
    }
    return initialPlants.map(p => ({ ...p, gallery: p.gallery || [] }))
  })

  const weather = useWeather()

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('plants', JSON.stringify(plants))
    }
  }, [plants])

  const markWatered = id => {
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
  }

  const addPlant = plant => {
    setPlants(prev => {
      const nextId = prev.reduce((m, p) => Math.max(m, p.id), 0) + 1
      return [...prev, { id: nextId, ...plant, gallery: [] }]
    })
  }

  const updatePlant = (id, updates) => {
    setPlants(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)))
  }

  const removePlant = id => {
    setPlants(prev => prev.filter(p => p.id !== id))
  }

  const addPhoto = (id, url) => {
    setPlants(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, gallery: [...(p.gallery || []), url] }
          : p
      )
    )
  }

  const removePhoto = (id, index) => {
    setPlants(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = (p.gallery || []).filter((_, i) => i !== index)
          return { ...p, gallery: updated }
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
