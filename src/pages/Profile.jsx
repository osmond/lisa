
import { useMemo } from 'react'
import { usePlants } from '../PlantContext.jsx'

export default function Profile() {
  const { plants } = usePlants()
  const userName = typeof localStorage !== 'undefined'
    ? localStorage.getItem('userName') || 'Gardener'
    : 'Gardener'

  const wateringDates = useMemo(() => {
    const set = new Set()
    plants.forEach(p => {
      if (p.lastWatered) set.add(p.lastWatered)
      ;(p.careLog || []).forEach(ev => {
        if (/water/i.test(ev.type)) set.add(ev.date)
      })
    })
    return Array.from(set)
  }, [plants])

  const streak = useMemo(() => {
    const dateSet = new Set(wateringDates)
    let count = 0
    let d = new Date()
    while (true) {
      const iso = d.toISOString().slice(0, 10)
      if (dateSet.has(iso)) {
        count++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }

import { useUser } from '../UserContext.jsx'
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


  const recentLogs = useMemo(() => {
    const all = []
    plants.forEach(p => {
      ;(p.careLog || []).forEach(ev => {
        all.push({ ...ev, plant: p.name })
      })
    })
    return all
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  }, [plants])

  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-200">
      <h1 className="text-headline leading-heading tracking-heading font-bold font-display">
        Hello, {userName}!
      </h1>
      <p data-testid="streak">Watering Streak: {streak}</p>
      <section>
        <h2 className="font-semibold font-display text-subhead leading-heading tracking-heading mb-2">
          Recent Care
        </h2>
        {recentLogs.length === 0 ? (
          <p>No recent notes</p>
        ) : (
          <ul>
            {recentLogs.map((ev, i) => (
              <li key={i}>
                <span>{ev.date} - {ev.type} {ev.plant}</span>
                {ev.note && <span>: {ev.note}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

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
