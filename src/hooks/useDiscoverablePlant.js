import { useEffect, useState, useCallback } from 'react'
import { usePlants } from '../PlantContext.jsx'

export default function useDiscoverablePlant(count = 3) {
  const { plants } = usePlants()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [skipped, setSkipped] = useState(false)

  const fetchPlants = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10)
    const key = `discover_${today}`
    setLoading(true)
    setError('')
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
      const all = Array.isArray(data) ? data : data.plants
      const shuffled = all.sort(() => 0.5 - Math.random())
      const suggestions = shuffled.slice(0, count)
      setList(suggestions)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(suggestions))
      }
    } catch (err) {
      console.error('discoverable error', err)
      setError('Failed to load plant')
    } finally {
      setLoading(false)
    }
  }, [plants, count])

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const key = `discover_${today}`
    const skipKey = `discover_skip_${today}`
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem(skipKey) === 'true') {
        setSkipped(true)
        setList([])
        return
      }
      const cached = localStorage.getItem(key)
      if (cached) {
        try {
          setList(JSON.parse(cached))
          return
        } catch {
          // ignore invalid cache
        }
      }
    }
    fetchPlants()
  }, [plants, fetchPlants])

  const refetch = () => {
    const today = new Date().toISOString().slice(0, 10)
    const key = `discover_${today}`
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key)
    }
    fetchPlants()
  }

  const skipToday = () => {
    const today = new Date().toISOString().slice(0, 10)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`discover_skip_${today}`, 'true')
      localStorage.removeItem(`discover_${today}`)
    }
    setSkipped(true)
    setList([])
  }

  const remindLater = () => {
    const today = new Date().toISOString().slice(0, 10)
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`discover_${today}`)
    }
    setList([])
  }

  return { plants: list, loading, error, refetch, skipToday, remindLater, skipped }
}
