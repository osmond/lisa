import { createContext, useContext, useState } from 'react'
import initialPlants from './plants.json'

const PlantContext = createContext()

export function PlantProvider({ children }) {
  const [plants, setPlants] = useState(initialPlants)

  const markWatered = id => {
    setPlants(prev =>
      prev.map(p => {
        if (p.id === id) {
          const today = new Date()
          const todayStr = today.toISOString().slice(0, 10)
          const next = new Date(today)
          next.setDate(today.getDate() + 7)
          const nextStr = next.toISOString().slice(0, 10)
          return { ...p, lastWatered: todayStr, nextWater: nextStr }
        }
        return p
      })
    )
  }

  const addPlant = plant => {
    setPlants(prev => {
      const nextId = prev.reduce((m, p) => Math.max(m, p.id), 0) + 1
      return [...prev, { id: nextId, ...plant }]
    })
  }

  return (
    <PlantContext.Provider value={{ plants, markWatered, addPlant }}>
      {children}
    </PlantContext.Provider>
  )
}

export const usePlants = () => useContext(PlantContext)
