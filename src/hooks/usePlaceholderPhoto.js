import { useState, useEffect } from 'react'

export default function usePlaceholderPhoto(name) {
  const [photo, setPhoto] = useState(null)

  useEffect(() => {
    if (!name) return
    const key = `placeholder_${name.toLowerCase()}`
    const cached = typeof localStorage !== 'undefined' && localStorage.getItem(key)
    if (cached) {
      try {
        setPhoto(JSON.parse(cached))
        return
      } catch {
        // ignore invalid cache
      }
    }
    const url = `https://source.unsplash.com/featured/?${encodeURIComponent(name)}`
    const info = { src: url, attribution: 'Photo from Unsplash' }
    setPhoto(info)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(info))
    }
  }, [name])

  return photo
}
