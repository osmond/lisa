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
    const unsplashUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(name)}`
    const wikiPromise = fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
    )
      .then(res => (res.ok ? res.json() : null))
      .catch(() => null)

    const choose = info => {
      setPhoto(info)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(info))
      }
    }

    fetch(unsplashUrl, { mode: 'no-cors' })
      .then(() => {
        choose({ src: unsplashUrl, attribution: 'Photo from Unsplash' })
      })
      .catch(async () => {
        const data = await wikiPromise
        const altSrc = data?.thumbnail?.source || data?.originalimage?.source
        if (altSrc) {
          choose({ src: altSrc, attribution: 'Photo from Wikipedia' })
        } else {
          choose({ src: unsplashUrl, attribution: 'Photo from Unsplash' })
        }
      })
  }, [name])

  return photo
}
