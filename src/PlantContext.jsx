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

  return (
    <PlantContext.Provider value={{ plants, markWatered }}>
      {children}
    </PlantContext.Provider>
  )
}

export const usePlants = () => useContext(PlantContext)
