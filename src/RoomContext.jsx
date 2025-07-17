import { createContext, useContext, useEffect, useState } from 'react'
import { usePlants } from './PlantContext.jsx'

const RoomContext = createContext()

export function RoomProvider({ children }) {
  const { plants } = usePlants()
  const [rooms, setRooms] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('rooms')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          // ignore
        }
      }
    }
    const plantRooms = [...new Set(plants.map(p => p.room).filter(Boolean))]
    return plantRooms
  })

  // keep rooms synced to plant data
  useEffect(() => {
    const plantRooms = [...new Set(plants.map(p => p.room).filter(Boolean))]
    setRooms(prev => {
      const merged = Array.from(new Set([...prev, ...plantRooms]))
      return merged
    })
  }, [plants])

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('rooms', JSON.stringify(rooms))
    }
  }, [rooms])

  const addRoom = name => {
    const trimmed = name.trim()
    if (!trimmed) return
    setRooms(prev => Array.from(new Set([...prev, trimmed])))
  }

  const removeRoom = name => {
    setRooms(prev => prev.filter(r => r !== name))
  }

  return (
    <RoomContext.Provider value={{ rooms, addRoom, removeRoom }}>
      {children}
    </RoomContext.Provider>
  )
}

export const useRooms = () => useContext(RoomContext)
