import { useState, useEffect } from 'react'
import plants from '../plants.json'

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

    try {
      const q = query.toLowerCase()
      const list = plants
        .filter(p => p.name && p.name.toLowerCase().includes(q))
        .map((p, idx) => ({
          id: p.id ?? idx,
          commonName: p.name,
          scientificName: p.name,
        }))
        .slice(0, 10)
      setResults(list)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(list))
      }
    } catch (err) {
      console.error('Failed to load plant suggestions', err)
    }
  }, [query])

  return results
}
