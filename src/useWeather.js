import { useState } from 'react'

export default function useWeather() {
  // Placeholder hook - real implementation would fetch data
  const [data] = useState({ rainTomorrow: 0, eto: 0 })
  return data
}
