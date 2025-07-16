import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PlantDetail from '../PlantDetail.jsx'
import plants from '../../plants.json'
import { PlantProvider } from '../../PlantContext.jsx'

test('renders plant details without duplicates', () => {
  const plant = plants[0]
  render(
    <PlantProvider>
      <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
        <Routes>
          <Route path="/plant/:id" element={<PlantDetail />} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )

  const headings = screen.getAllByRole('heading', { name: plant.name })
  expect(headings).toHaveLength(1)

  const images = screen.getAllByAltText(plant.name)
  expect(images).toHaveLength(1)

  expect(screen.getByText(plant.light)).toBeInTheDocument()
  expect(screen.getByText(plant.humidity)).toBeInTheDocument()
  expect(screen.getByText(plant.difficulty)).toBeInTheDocument()

  const wateredLabel = screen.getByText('Last watered:')
  expect(within(wateredLabel.parentElement).getByText(plant.lastWatered)).toBeInTheDocument()

  const nextLabel = screen.getByText('Next watering:')
  const nextWrapper = nextLabel.parentElement
  expect(within(nextWrapper).getByText(plant.nextWater)).toBeInTheDocument()
  expect(
    within(nextWrapper).getByRole('button', {
      name: `Mark ${plant.name} as watered`,
    })
  ).toBeInTheDocument()

  const nextFertLabel = screen.getByText('Next fertilizing:')
  const nextFertWrapper = nextFertLabel.parentElement
  expect(within(nextFertWrapper).getByText(plant.nextFertilize)).toBeInTheDocument()
  expect(
    within(nextFertWrapper).getByRole('button', {
      name: `Mark ${plant.name} as fertilized`,
    })
  ).toBeInTheDocument()

  const fertLabel = screen.getByText('Last fertilized:')
  expect(within(fertLabel.parentElement).getByText(plant.lastFertilized)).toBeInTheDocument()

  const subHeadings = screen.getAllByRole('heading', { level: 4 })
  expect(subHeadings).toHaveLength(2)
})


test('sections collapsed by default', () => {
  const plant = plants[0]
  render(
    <PlantProvider>
      <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
        <Routes>
          <Route path="/plant/:id" element={<PlantDetail />} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )

  expect(
    screen.getByRole('button', { name: /Activity & Notes Show Details/i })
  ).toHaveAttribute('aria-expanded', 'false')
  expect(
    screen.getByRole('button', { name: /Gallery Show Details/i })
  ).toHaveAttribute('aria-expanded', 'false')
  expect(
    screen.getByRole('button', { name: /Quick Stats Hide Details/i })
  ).toHaveAttribute('aria-expanded', 'true')
  expect(
    screen.getByRole('button', { name: /Care Profile Hide Details/i })
  ).toHaveAttribute('aria-expanded', 'true')
})


test('opens lightbox from gallery', () => {

  const plant = plants[0]
  render(
    <PlantProvider>
      <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
        <Routes>
          <Route path="/plant/:id" element={<PlantDetail />} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )

  fireEvent.click(screen.getByRole('button', { name: /Gallery Show Details/i }))

  const img = screen.getByAltText(`${plant.name} 0`)
  fireEvent.click(img.closest('button'))

  const dialogsAfterOpen = screen.getAllByRole('dialog', {
    name: `${plant.name} gallery`,
  })
  // First dialog is the gallery overlay
  expect(dialogsAfterOpen[0]).toBeInTheDocument()
  const thumb = screen.getByAltText(`${plant.name} 0`)
  fireEvent.click(thumb)

  const dialogs = screen.getAllByRole('dialog', {
    name: `${plant.name} gallery`,
  })
  // The first dialog is the gallery overlay; the second is the Lightbox viewer
  const viewerDialog = dialogs[1]
  expect(viewerDialog).toBeInTheDocument()

  const viewerImg = screen.getByAltText(/gallery image/i)
  expect(viewerImg).toHaveAttribute('src', plant.photos[0].src)
  expect(screen.getAllByText(plant.photos[0].caption).length).toBeGreaterThan(0)

  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(viewerImg).toHaveAttribute('src', plant.photos[1].src)
  if (plant.photos[1].caption) {
    expect(screen.getAllByText(plant.photos[1].caption).length).toBeGreaterThan(0)
  }

  fireEvent.keyDown(window, { key: 'Escape' })
  expect(
    screen.queryByRole('dialog', { name: `${plant.name} gallery` })
  ).toBeNull()

})
