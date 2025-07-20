export function buildEvents(source, { includePlantName = false } = {}) {
  const plants = Array.isArray(source) ? source : [source].filter(Boolean)
  const events = []
  const added = new Set()
  const today = new Date().toISOString().slice(0, 10)

  const addEvent = (e) => {
    const key = `${e.type}-${e.date}`
    if (!added.has(key)) {
      added.add(key)
      events.push(e)
    }
  }

  plants.forEach(p => {
    if (!p) return

    const waterDates = new Set()
    const fertilizeDates = new Set()

    ;(p.activity || []).forEach(a => {
      const m = a.match(/(\d{4}-\d{2}-\d{2})/)
      if (!m) return

      const cleaned = a.replace(/\s*on\s+\d{4}-\d{2}-\d{2}$/, '')
      const lower = cleaned.toLowerCase()
      let type = 'note'
      if (lower.includes('watered')) {
        type = 'water'
        waterDates.add(m[1])
      } else if (lower.includes('fertilized')) {
        type = 'fertilize'
        fertilizeDates.add(m[1])
      }

      addEvent({
        date: m[1],
        label: includePlantName ? `${p.name}: ${cleaned}` : cleaned,
        type,
      })
    })

    ;(p.careLog || []).forEach(ev => {
      const lowerType = (ev.type || '').toLowerCase()
      if (lowerType.includes('water')) waterDates.add(ev.date)
      if (lowerType.includes('fertilize')) fertilizeDates.add(ev.date)
      let type = 'log'
      if (lowerType.includes('water')) type = 'water'
      else if (lowerType.includes('fertilize')) type = 'fertilize'
      addEvent({
        date: ev.date,
        label: includePlantName ? `${ev.type} ${p.name}` : ev.type,
        note: ev.note,
        type,
      })
    })

    if (p.lastWatered && !waterDates.has(p.lastWatered)) {
      addEvent({
        date: p.lastWatered,
        label: includePlantName ? `Watered ${p.name}` : 'Watered',
        type: 'water',
      })
    }

    if (p.lastFertilized && !fertilizeDates.has(p.lastFertilized)) {
      addEvent({
        date: p.lastFertilized,
        label: includePlantName ? `Fertilized ${p.name}` : 'Fertilized',
        type: 'fertilize',
      })
    }

    if (p.notes) {
      addEvent({
        date: today,
        label: includePlantName ? `${p.name} note` : 'Note',
        note: p.notes,
        type: 'noteText',
      })
    }

    if (p.advancedCare) {
      addEvent({
        date: today,
        label: includePlantName ? `${p.name} care tip` : 'Advanced care',
        note: p.advancedCare,
        type: 'advanced',
      })
    }
  })

  return events.sort((a, b) => a.date.localeCompare(b.date))
}

export function groupEventsByMonth(events) {
  const map = new Map()
  events.forEach(e => {
    const key = e.date.slice(0, 7)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(e)
  })
  for (const [, list] of map) {
    list.sort((a, b) => a.date.localeCompare(b.date))
  }
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
}
