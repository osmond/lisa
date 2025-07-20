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
      const openaiKey = enabled ? process.env.VITE_OPENAI_API_KEY : null
      try {
        if (openaiKey) {
          const prompt = `Give me a short fun or cultural fact about the plant "${name}". One sentence.`
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openaiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7,
            }),
          })
          if (!res.ok) throw new Error('openai failed')
          const data = await res.json()
          const text = data?.choices?.[0]?.message?.content?.trim()
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
