import { useState } from 'react'
import { useOpenAI } from '../OpenAIContext.jsx'

export default function useCarePlan() {
  const [plan, setPlan] = useState(null)
  const [history, setHistory] = useState([])
  const [index, setIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { enabled } = useOpenAI()

  const DEFAULT_PLAN = {
    text: '',
    water: 0,
    water_volume_ml: 0,
    water_volume_oz: 0,
    fertilize: 0,
  }

  const generate = async details => {
    if (!enabled) {
      setError('Missing API key')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/care-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'server error')
      setPlan(data)
      setHistory(h => [...h.slice(0, index + 1), data])
      setIndex(i => i + 1)
    } catch (err) {
      console.error('care plan error', err)
      setError('Failed to generate plan')
      setPlan(DEFAULT_PLAN)
      setHistory(h => [...h.slice(0, index + 1), DEFAULT_PLAN])
      setIndex(i => i + 1)
    } finally {
      setLoading(false)
    }
  }

  const revert = i => {
    if (i < 0 || i >= history.length) return
    setIndex(i)
    setPlan(history[i])
  }

  return { plan, loading, error, generate, history, revert, index }
}
