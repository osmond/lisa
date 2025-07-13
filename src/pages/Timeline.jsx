import { usePlants } from '../PlantContext.jsx'
import { useMemo } from 'react'

export default function Timeline() {
  const { plants } = usePlants()

  const events = useMemo(() => {
    const all = []
    plants.forEach(p => {
      if (p.lastWatered) {
        all.push({
          date: p.lastWatered,
          label: `Watered ${p.name}`,
          type: 'water',
        })
      }
      if (p.lastFertilized) {
        all.push({
          date: p.lastFertilized,
          label: `Fertilized ${p.name}`,
          type: 'fertilize',
        })
      }
      ;(p.activity || []).forEach(a => {
        const m = a.match(/(\d{4}-\d{2}-\d{2})/)
        if (m) {
          all.push({
            date: m[1],
            label: `${p.name}: ${a}`,
            type: 'note',
          })
        }
      })
      ;(p.careLog || []).forEach(ev => {
        all.push({
          date: ev.date,
          label: `${ev.type} ${p.name}`,
          note: ev.note,
          type: 'log',
        })
      })
    })
    return all.sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [plants])

  const colors = {
    water: 'bg-blue-500',
    fertilize: 'bg-yellow-500',
    note: 'bg-gray-400',
    log: 'bg-green-400',
  }

  return (
    <div className="overflow-y-auto max-h-full p-4 text-gray-700 dark:text-gray-200">
      <ul className="relative border-l border-gray-300 pl-4 space-y-6">
        {events.map((e, i) => (
          <li key={`${e.date}-${e.label}-${i}`} className="relative">
            <span
              className={`absolute -left-2 top-1 w-3 h-3 rounded-full ${colors[e.type]}`}
            ></span>
            <p className="text-xs text-gray-500">{e.date}</p>
            <p>{e.label}</p>
            {e.note && (
              <p className="text-xs text-gray-500 italic">{e.note}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
