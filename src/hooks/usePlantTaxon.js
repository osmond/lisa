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
    if (typeof fetch !== 'function') return

    let aborted = false
    const controller = new AbortController()
    const { signal } = controller

    async function fetchTaxa() {
      try {
        const url = `https://api.inaturalist.org/v1/taxa/autocomplete?q=${encodeURIComponent(query)}`
        const res = await fetch(url, { signal })
        const data = await res.json()
        const list = (data?.results || []).map(t => ({
          id: t.id,
          commonName: t.preferred_common_name || t.name,
          scientificName: t.name,
        }))
        if (!aborted) {
          setResults(list)
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(list))
          }
        }
      } catch (err) {
        if (err?.name !== 'AbortError') {
          console.error('Failed to load iNaturalist taxon', err)
        }
      }
    }
    fetchTaxa()
    return () => {
      aborted = true
      controller.abort()
    }
  }, [query])

  return results
}
