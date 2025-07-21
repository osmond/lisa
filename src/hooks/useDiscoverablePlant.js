import { useEffect, useState } from 'react'
import { usePlants } from '../PlantContext.jsx'

export default function useDiscoverablePlant() {
  const { plants } = usePlants()
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const key = `discover_${today}`
    const cached =
      typeof localStorage !== 'undefined' && localStorage.getItem(key)
    if (cached) {
      try {
        setPlant(JSON.parse(cached))
        return
      } catch {
        // ignore invalid cache
      }
    }

    let aborted = false
    async function fetchPlant() {
      setLoading(true)
      if (typeof fetch !== 'function') {
        setLoading(false)
        setError('Failed to load plant')
        return
      }
      const exclude = plants.map(p => p.name).join(',')
      try {
        const params = new URLSearchParams()
        if (exclude) params.set('exclude', exclude)
        const res = await fetch(`/api/discoverable-plants?${params.toString()}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'server error')
        const list = Array.isArray(data) ? data : data.plants
        const suggestion = list[Math.floor(Math.random() * list.length)]
        if (!aborted && suggestion) {
          setPlant(suggestion)
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(suggestion))
          }
        }
      } catch (err) {
        console.error('discoverable error', err)
        if (!aborted) setError('Failed to load plant')
      } finally {
        if (!aborted) setLoading(false)
      }
    }
    fetchPlant()
    return () => {
      aborted = true
    }
  }, [plants])

  return { plant, loading, error }
}
