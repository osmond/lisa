import { buildEvents, groupEventsByMonth } from '../events.js'

test('buildEvents returns sorted events for a single plant', () => {
  const plant = {
    name: 'Plant A',
    lastWatered: '2025-07-11',
    lastFertilized: '2025-07-01',
    activity: ['Watered on 2025-07-09', 'Repotted'],
    careLog: [{ date: '2025-07-02', type: 'Watered', note: 'deep soak' }],
  }

  const events = buildEvents(plant)
  expect(events).toEqual([
    { date: '2025-07-01', label: 'Fertilized', type: 'fertilize' },
    { date: '2025-07-02', label: 'Watered', note: 'deep soak', type: 'water' },
    { date: '2025-07-09', label: 'Watered', type: 'water' },
    { date: '2025-07-11', label: 'Watered', type: 'water' },
  ])
})

test('buildEvents includes plant names when requested', () => {
  const plants = [
    {
      id: 1,
      name: 'Plant A',
      lastWatered: '2025-07-11',
      lastFertilized: '2025-07-01',
      activity: ['Repotted'],
    },
    {
      id: 2,
      name: 'Plant B',
      lastWatered: '2025-07-10',
      activity: ['Watered on 2025-07-09'],
    },
  ]

  const events = buildEvents(plants, { includePlantName: true })
  expect(events.map(e => e.label)).toEqual([
    'Fertilized Plant A',
    'Plant B: Watered',
    'Watered Plant B',
    'Watered Plant A',
  ])
})

test('buildEvents can include plant id with names', () => {
  const plants = [
    { id: 1, name: 'Plant A', lastWatered: '2025-07-11' },
  ]

  const events = buildEvents(plants, { includePlantName: true, includePlantId: true })
  expect(events[0].plantId).toBe(1)
  expect(events[0].plantName).toBe('Plant A')
})

test('groupEventsByMonth groups by YYYY-MM', () => {
  const events = [
    { date: '2025-07-01', label: 'A' },
    { date: '2025-07-10', label: 'B' },
    { date: '2025-08-02', label: 'C' },
  ]
  const grouped = groupEventsByMonth(events)
  expect(grouped).toEqual([
    ['2025-07', [events[0], events[1]]],
    ['2025-08', [events[2]]],
  ])
})

test('groupEventsByMonth sorts months chronologically', () => {
  const events = [
    { date: '2099-12-25', label: 'Future' },
    { date: '2025-07-01', label: 'Past' },
  ]

  const grouped = groupEventsByMonth(events)

  expect(grouped).toEqual([
    ['2025-07', [events[1]]],
    ['2099-12', [events[0]]],
  ])
})

test('timeline events never have dates in the future', () => {
  const plant = {
    notes: 'keep soil moist',
    advancedCare: 'requires misting',
  }

  const events = buildEvents(plant)
  const today = new Date().toISOString().slice(0, 10)
  const now = new Date()

  const noteEvent = events.find(e => e.type === 'noteText')
  const advEvent = events.find(e => e.type === 'advanced')

  expect(noteEvent.date).toBe(today)
  expect(advEvent.date).toBe(today)

  events.forEach(e => {
    expect(new Date(e.date).getTime()).toBeLessThanOrEqual(now.getTime())
  })
})
