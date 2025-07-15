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
    { date: '2025-07-02', label: 'Watered', note: 'deep soak', type: 'log' },
    { date: '2025-07-09', label: 'Watered on 2025-07-09', type: 'note' },
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
    'Plant B: Watered on 2025-07-09',
    'Watered Plant B',
    'Watered Plant A',
  ])
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
