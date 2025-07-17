import { useMemo } from 'react'
import { usePlants } from '../PlantContext.jsx'
import { getNextWateringDate } from '../utils/watering.js'

export default function useOverdueCount() {
  const { plants } = usePlants()
  const todayIso = new Date().toISOString().slice(0, 10)

  return useMemo(() => {
    return plants.reduce((m, p) => {
      const { date } = getNextWateringDate(p.lastWatered)
      if (date < todayIso) m += 1
      if (p.nextFertilize && p.nextFertilize < todayIso) m += 1
      return m
    }, 0)
  }, [plants, todayIso])
}
