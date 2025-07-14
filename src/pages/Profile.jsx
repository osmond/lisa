import { useUser } from '../UserContext.jsx'


export default function Profile() {
  const { name } = useUser()
  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-200">
      <h1 className="text-headline leading-heading tracking-heading font-bold font-display">Hi {name}</h1>

import { usePlants } from '../PlantContext.jsx'
import { useMemo } from 'react'

export default function Profile() {
  const { name } = useUser()
  const { plants } = usePlants()

  const careLog = useMemo(() => plants.flatMap(p => p.careLog || []), [plants])

  const wateringDates = useMemo(() =>
    careLog
      .filter(ev => /water/i.test(ev.type))
      .map(ev => ev.date)
      .sort((a, b) => new Date(b) - new Date(a)),
  [careLog])

  const streak = useMemo(() => {
    if (wateringDates.length === 0) return 0
    let count = 1
    for (let i = 1; i < wateringDates.length; i++) {
      const diff =
        (new Date(wateringDates[i - 1]) - new Date(wateringDates[i])) /
        (1000 * 60 * 60 * 24)
      if (diff === 1) count++
      else break
    }
    return count
  }, [wateringDates])

  const recent = useMemo(
    () => [...careLog].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [careLog]
  )

  return (
    <div>
      <h1 data-testid="greeting">Hello, {name}</h1>
      <p>
        Watering Streak: <span data-testid="streak-count">{streak}</span>
      </p>
      <ul data-testid="recent-list">
        {recent.map((ev, i) => (
          <li key={i}>{ev.type}: {ev.note}</li>
        ))}
      </ul>

    </div>
  )
}
