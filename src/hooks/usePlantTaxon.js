import { useState, useEffect } from 'react'

export default function usePlantTaxon(query) {
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query || query.length < 2) return
    const key = `taxon_${query.toLowerCase()}`
    const cached = typeof localStorage !== 'undefined' && localStorage.getItem(key)
    if (cached) {
      try {
        setResults(JSON.parse(cached))
        return
      } catch {
        // ignore invalid cached data
      }
    }

    async function load() {
      try {
        const res = await fetch(`/api/taxon?query=${encodeURIComponent(query)}`)
        if (!res.ok) throw new Error('Request failed')
        const data = await res.json()
        setResults(data)
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(data))
        }
      } catch (err) {
        console.error('Failed to load plant suggestions', err)
      }
    }
    load()
  }, [query])

  return results
}
