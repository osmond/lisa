import { useEffect, useState } from 'react'

export default function usePlantFact(name) {
  const [fact, setFact] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!name) return
    const key = `plantFact_${name.toLowerCase()}`
    const cached =
      typeof localStorage !== 'undefined' && localStorage.getItem(key)
    if (cached) {
      setFact(cached)
      return
    }

    let aborted = false
    async function fetchFact() {
      setLoading(true)
      try {
        const res = await fetch(`/api/plant-fact?name=${encodeURIComponent(name)}`)
        if (!res.ok) throw new Error('fact fetch failed')
        const data = await res.json()
        const text = data.fact
        if (text && !aborted) {
          setFact(text)
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, text)
          }
        }
      } catch (err) {
        console.error(err)
        if (!aborted) setError('Failed to load fact')
      } finally {
        if (!aborted) setLoading(false)
      }
    }
    fetchFact()
    return () => {
      aborted = true
    }
  }, [name])

  return { fact, error, loading }
}
