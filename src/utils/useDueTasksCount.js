import { usePlants } from '../PlantContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { useMemo } from 'react'
import { getNextWateringDate } from './watering.js'

export default function useDueTasksCount() {
  const { plants } = usePlants()
  const weatherCtx = useWeather()
  const weatherData = { rainTomorrow: weatherCtx?.forecast?.rainfall || 0 }
  const timezone = weatherCtx?.timezone

  return useMemo(() => {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: timezone })
    )
    const todayIso = now.toISOString().slice(0, 10)
    let count = 0
    plants.forEach(p => {
      if (p.lastWatered) {
        const { date } = getNextWateringDate(p.lastWatered, weatherData)
        if (date <= todayIso) count++
      }
      if (p.nextFertilize && p.nextFertilize <= todayIso) count++
    })
    return count
  }, [plants, weatherData.rainTomorrow, timezone])
}
