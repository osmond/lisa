import { useEffect, useState } from 'react'

export default function useTimelineSummary(events = []) {
  const [summary, setSummary] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!events.length) return
    const openaiKey = process.env.VITE_OPENAI_API_KEY
    if (!openaiKey || typeof fetch !== 'function') return

    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    const recent = events.filter(e => new Date(e.date) >= monthAgo)
    if (!recent.length) return

    const key = `timelineSummary_${recent[0].date}_${recent[recent.length - 1].date}`
    const cached = typeof localStorage !== 'undefined' && localStorage.getItem(key)
    if (cached) {
      setSummary(cached)
      return
    }

    let aborted = false
    async function fetchSummary() {
      setLoading(true)
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content:
                  'You summarize plant care timeline events for their owner. Use an encouraging tone and second person. Keep it under three sentences.',
              },
              { role: 'user', content: JSON.stringify(recent) },
            ],
            temperature: 0.7,
          }),
        })
        if (!res.ok) throw new Error('openai failed')
        const data = await res.json()
        const text = data?.choices?.[0]?.message?.content?.trim()
        if (text && !aborted) {
          setSummary(text)
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, text)
          }
          setLoading(false)
          return
        }
      } catch (err) {
        console.error('OpenAI error', err)
        if (!aborted) setError('Failed to load summary')
      }
      if (!aborted) setLoading(false)
    }
    fetchSummary()
    return () => {
      aborted = true
    }
  }, [events])

  return { summary, error, loading }
}
