import { useState } from 'react'

export default function useCarePlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async details => {
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
    } finally {
      setLoading(false)
    }
  }

  return { plan, loading, error, generate }
}
