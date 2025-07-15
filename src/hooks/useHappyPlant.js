import { useState } from 'react'
import { addBase as addBaseFn } from '../PlantContext.jsx'

export default function useHappyPlant() {
  const [src] = useState(() => {
    const addBase = addBaseFn || (u => u)
    const images = [
      addBase('/happy-plant.svg'),
      addBase('/happy-plant2.svg'),
      addBase('/happy-plant3.svg'),
      addBase('/happy-plant4.svg'),
    ]
    const today = new Date().toISOString().slice(0, 10)

    if (typeof localStorage !== 'undefined') {
      const storedRaw = localStorage.getItem('happyPlant')
      const stored = storedRaw ? JSON.parse(storedRaw) : {}
      if (stored.date === today && images[stored.index]) {
        return images[stored.index]
      }
      let index = Math.floor(Math.random() * images.length)
      if (index === stored.index && images.length > 1) {
        index = (index + 1) % images.length
      }
      localStorage.setItem(
        'happyPlant',
        JSON.stringify({ date: today, index })
      )
      return images[index]
    }

    return images[0]
  })

  return src
}
