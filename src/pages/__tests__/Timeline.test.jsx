import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { OpenAIProvider } from '../../OpenAIContext.jsx'
import { PlantProvider } from '../../PlantContext.jsx'
import Timeline from '../Timeline.jsx'

let mockPlants

function renderWithRouter(ui) {
  return render(
    <OpenAIProvider>
      <PlantProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </PlantProvider>
    </OpenAIProvider>
  )
}

beforeEach(() => {
  mockPlants = [
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
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockPlants) })
  )
  localStorage.clear()
  localStorage.setItem('plants', JSON.stringify(mockPlants))
})

afterEach(() => {
  global.fetch = undefined
})

test.skip('ignores activities without valid dates and shows newest first', async () => {
  renderWithRouter(<Timeline />)

  await screen.findByText('Watered Plant A')
  expect(screen.queryByText(/Repotted/)).toBeNull()

  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(4)
  expect(items[0]).toHaveTextContent('Watered Plant A')
  expect(items[1]).toHaveTextContent('Watered Plant B')
  expect(items[2]).toHaveTextContent('Plant B: Watered')
  expect(items[3]).toHaveTextContent('Fertilized Plant A')
})

test.skip('renders care log notes', async () => {
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      careLog: [
        { date: '2025-07-02', type: 'Watered', note: 'deep soak' },
      ],
    },
  ]

  renderWithRouter(<Timeline />)
  await screen.findByText('deep soak')
  expect(screen.getByRole('link', { name: 'Plant A' })).toBeInTheDocument()
  expect(screen.getByText('deep soak')).toBeInTheDocument()
})

test.skip('renders an icon for events', async () => {
  const { container } = renderWithRouter(<Timeline />)
  await screen.findByText('Watered Plant A')
  const svg = container.querySelector('svg[aria-hidden="true"]')
  expect(svg).toBeInTheDocument()
})

test.skip('displays month headers when events span months', async () => {
  mockPlants = [
    { id: 1, name: 'A', lastWatered: '2025-07-01' },
    { id: 2, name: 'B', lastWatered: '2025-08-02' },
  ]

  renderWithRouter(<Timeline />)
  const headings = await screen.findAllByRole('heading', { level: 3 })
  expect(headings).toHaveLength(2)
  expect(headings[0]).toHaveTextContent('August 2025')
  expect(headings[1]).toHaveTextContent('July 2025')
})

test('toggle reverses the order of events', async () => {
  renderWithRouter(<Timeline />)
  const items = await screen.findAllByRole('listitem')
  expect(items[0]).toHaveTextContent('Watered Plant A')

  const toggle = screen.getByRole('button', { name: /show oldest first/i })
  fireEvent.click(toggle)

  const reversed = screen.getAllByRole('listitem')
  expect(reversed[0]).toHaveTextContent('Fertilized Plant A')
  expect(toggle).toHaveAccessibleName('Show newest first')
})

test('plant name links to detail page', async () => {
  renderWithRouter(<Timeline />)
  const links = await screen.findAllByRole('link', { name: 'Plant A' })
  expect(links[0]).toHaveAttribute('href', '/plant/1')
})
