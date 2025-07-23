import { useEffect, useState } from 'react'
import { useOpenAI } from '../OpenAIContext.jsx'

export default function usePlantFact(name) {
  const [fact, setFact] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { enabled } = useOpenAI()

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
      if (typeof fetch !== 'function') {
        setLoading(false)
        setError('Failed to load fact')
        return
      }
      try {
        if (enabled) {
          const res = await fetch('/api/plant-fact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
          })
          if (!res.ok) throw new Error('fact failed')
          const data = await res.json()
          const text = data.fact
          if (text && !aborted) {
            setFact(text)
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(key, text)
            }
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.error('OpenAI error', err)
      }

      try {
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          name
        )}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('wiki failed')
        const data = await res.json()
        const sentence = data.extract?.split(/\.\s/)[0]?.trim()
        if (sentence && !aborted) {
          setFact(sentence)
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, sentence)
          }
        }
      } catch (err) {
        console.error('Wiki error', err)
        if (!aborted) setError('Failed to load fact')
      } finally {
        if (!aborted) setLoading(false)
      }
    }
    fetchFact()
    return () => {
      aborted = true
    }
  }, [name, enabled])

  return { fact, error, loading }
}
