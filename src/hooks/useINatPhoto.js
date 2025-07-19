import { useState, useEffect } from 'react'

export default function useINatPhoto(name) {
  const [photo, setPhoto] = useState(null)

  useEffect(() => {
    if (!name) return
    const key = `inat_${name.toLowerCase()}`
    const cached = typeof localStorage !== 'undefined' && localStorage.getItem(key)
    if (cached) {
      try {
        setPhoto(JSON.parse(cached))
        return
      } catch {
        // ignore corrupt cache
      }
    }

    if (typeof fetch !== 'function') return

    let aborted = false
    const controller = new AbortController()
    const { signal } = controller
    const verifyImage = url =>
      new Promise((resolve, reject) => {
        if (typeof Image === 'undefined') {
          resolve()
          return
        }
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('image failed'))
        img.src = url
      })

    async function fetchPhoto() {
      try {
        const searchUrl =
          `https://api.inaturalist.org/v1/search?q=${encodeURIComponent(name)}&sources=taxa`
        const searchRes = await fetch(searchUrl, { signal })
        const searchData = await searchRes.json()
        const results = searchData?.results || []
        for (const result of results) {
          const id = result?.record?.id || result?.id
          if (!id) continue
          const taxonRes = await fetch(`https://api.inaturalist.org/v1/taxa/${id}`, { signal })
          const taxonData = await taxonRes.json()
          const defaultPhoto = taxonData?.results?.[0]?.default_photo
          const url = defaultPhoto?.medium_url
          if (!url) continue
          try {
            await verifyImage(url)
          } catch {
            continue
          }
          const info = { src: url, attribution: defaultPhoto.attribution }
          if (!aborted) {
            setPhoto(info)
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(key, JSON.stringify(info))
            }
          }
          break
        }
      } catch (err) {
        console.error('Failed to load iNaturalist photo', err)
      }
    }
    fetchPhoto()
    return () => {
      aborted = true
      controller.abort()
    }
  }, [name])

  return photo
}
