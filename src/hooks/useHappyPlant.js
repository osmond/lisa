import { useState } from 'react'

export default function useHappyPlant() {
  const [src] = useState(() => {
    const images = [
      '/happy-plant.svg',
      '/happy-plant2.svg',
      '/happy-plant3.svg',
      '/happy-plant4.svg',
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
