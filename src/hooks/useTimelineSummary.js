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
      const openaiKey = enabled ? process.env.VITE_OPENAI_API_KEY : null
      if (!openaiKey) {
        setLoading(false)
        setError('Missing API key')
        return
      }
      const cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - 1)
      const recent = events.filter(e => new Date(e.date) >= cutoff)
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
                  'Summarize the recent plant care events in a scientific tone as if written by a plant expert, for example: "The specimen Sansevieria trifasciata exhibits robust growth..."',
              },
              { role: 'user', content: JSON.stringify(recent) },
            ],
            temperature: 0.7,
          }),
        })
        if (!res.ok) throw new Error('openai failed')
        const data = await res.json()
        const text = data?.choices?.[0]?.message?.content?.trim()
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
