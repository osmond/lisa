import { useEffect, useState } from 'react'
import { usePlants } from '../PlantContext.jsx'
import { useWeather } from '../WeatherContext.jsx'

export default function usePlantCoach(question, plantId) {
  const { plants } = usePlants()
  const { forecast } = useWeather() || {}

  const plant =
    typeof plantId === 'object'
      ? plantId
      : plants.find(p => p.id === plantId)

  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!question || !plant) return
    let aborted = false

    async function fetchAnswer() {
      setLoading(true)
      try {
        const res = await fetch('/api/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            plantType: plant.name,
            lastWatered: plant.lastWatered,
            weather: forecast,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'server error')
        if (!aborted) setAnswer(data.answer)
      } catch (err) {
        console.error('Coach error', err)
        if (!aborted) setError('Failed to load answer')
      } finally {
        if (!aborted) setLoading(false)
      }
    }
    fetchAnswer()
    return () => {
      aborted = true
    }
  }, [question, plant, forecast])

  return { answer, error, loading }
}
