import { useState, useEffect } from 'react'

export default function usePlaceholderPhoto(name) {
  const [photo, setPhoto] = useState(null)

  useEffect(() => {
    if (!name) return
    const controller = new AbortController()
    const { signal } = controller
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
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`

    const choose = info => {
      setPhoto(info)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(info))
      }
    }

    fetch(wikiUrl, { signal })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        const src = data?.thumbnail?.source || data?.originalimage?.source
        if (src) {
          choose({ src, attribution: 'Photo from Wikipedia' })
        } else {
          choose({ src: '/placeholder.svg', attribution: 'Placeholder' })
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          choose({ src: '/placeholder.svg', attribution: 'Placeholder' })
        }
      })
    return () => {
      controller.abort()
    }
  }, [name])

  return photo
}
