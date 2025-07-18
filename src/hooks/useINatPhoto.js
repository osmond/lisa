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
    async function fetchPhoto() {
      try {
        const searchUrl =
          `https://api.inaturalist.org/v1/search?q=${encodeURIComponent(name)}&sources=taxa`
        const searchRes = await fetch(searchUrl)
        const searchData = await searchRes.json()
        const id = searchData?.results?.[0]?.record?.id || searchData?.results?.[0]?.id
        if (!id) return
        const taxonRes = await fetch(`https://api.inaturalist.org/v1/taxa/${id}`)
        const taxonData = await taxonRes.json()
        const defaultPhoto = taxonData?.results?.[0]?.default_photo
        if (defaultPhoto?.medium_url) {
          const info = {
            src: defaultPhoto.medium_url,
            attribution: defaultPhoto.attribution,
          }
          if (!aborted) {
            setPhoto(info)
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(key, JSON.stringify(info))
            }
          }
        }
      } catch (err) {
        console.error('Failed to load iNaturalist photo', err)
      }
    }
    fetchPhoto()
    return () => {
      aborted = true
    }
  }, [name])

  return photo
}
