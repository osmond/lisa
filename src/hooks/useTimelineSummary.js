import { useEffect, useState } from 'react'
import { useOpenAI } from '../OpenAIContext.jsx'

export default function useTimelineSummary(events) {
  const [summary, setSummary] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { enabled } = useOpenAI()

  useEffect(() => {
    if (!events || events.length === 0) return
    if (typeof fetch !== 'function') return

    let aborted = false
    async function fetchSummary() {
      setLoading(true)
      setError('')
      if (!enabled) {
        setLoading(false)
        setError('Missing API key')
        return
      }
      const cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - 1)
      const recent = events.filter(e => new Date(e.date) >= cutoff)
      try {
        const res = await fetch('/api/timeline-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events: recent }),
        })
        if (!res.ok) throw new Error('summary failed')
        const data = await res.json()
        const text = data.summary
        if (!aborted && text) setSummary(text)
      } catch (err) {
        console.error('OpenAI error', err)
        if (!aborted) setError('Failed to load summary')
      } finally {
        if (!aborted) setLoading(false)
      }
    }

    fetchSummary()
    return () => {
      aborted = true
    }
  }, [events, enabled])

  return { summary, error, loading }
}
