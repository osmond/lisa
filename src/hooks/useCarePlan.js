import { useState } from 'react'
import { useOpenAI } from '../OpenAIContext.jsx'

export default function useCarePlan() {
  const [plan, setPlan] = useState(null)
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
    } catch (err) {
      console.error('care plan error', err)
      setError('Failed to generate plan')
      setPlan(DEFAULT_PLAN)
    } finally {
      setLoading(false)
    }
  }

  return { plan, loading, error, generate }
}
