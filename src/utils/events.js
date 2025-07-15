export function buildEvents(source, { includePlantName = false } = {}) {
  const plants = Array.isArray(source) ? source : [source].filter(Boolean)
  const events = []
  plants.forEach(p => {
    if (!p) return
    if (p.lastWatered) {
      events.push({
        date: p.lastWatered,
        label: includePlantName ? `Watered ${p.name}` : 'Watered',
        type: 'water',
      })
    }
    if (p.lastFertilized) {
      events.push({
        date: p.lastFertilized,
        label: includePlantName ? `Fertilized ${p.name}` : 'Fertilized',
        type: 'fertilize',
      })
    }
    ;(p.activity || []).forEach(a => {
      const m = a.match(/(\d{4}-\d{2}-\d{2})/)
      if (m) {
        events.push({
          date: m[1],
          label: includePlantName ? `${p.name}: ${a}` : a,
          type: 'note',
        })
      }
    })
    ;(p.careLog || []).forEach(ev => {
      events.push({
        date: ev.date,
        label: includePlantName ? `${ev.type} ${p.name}` : ev.type,
        note: ev.note,
        type: 'log',
      })
    })
  })
  return events.sort((a, b) => new Date(a.date) - new Date(b.date))
}

export function groupEventsByMonth(events) {
  const map = new Map()
  events.forEach(e => {
    const key = e.date.slice(0, 7)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(e)
  })
  return Array.from(map.entries())
}
