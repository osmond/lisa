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
  expect(within(nextLabel.parentElement).getByText(plant.nextWater)).toBeInTheDocument()

  const fertLabel = screen.getByText('Last fertilized:')
  expect(within(fertLabel.parentElement).getByText(plant.lastFertilized)).toBeInTheDocument()
})

test('tab keyboard navigation works', () => {
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

  // Expand section first
  fireEvent.click(screen.getByRole('button', { name: /Activity & Notes Expand/i }))

  const tabs = [
    screen.getByRole('tab', { name: /Activity/ }),
    screen.getByRole('tab', { name: /Notes/ }),
    screen.getByRole('tab', { name: /Advanced/ }),
    screen.getByRole('tab', { name: /Timeline/ }),
  ]

  expect(tabs[3]).toHaveAttribute('aria-selected', 'true')
  expect(tabs[0]).toHaveAttribute('aria-selected', 'false')

  tabs[0].focus()
  fireEvent.keyDown(tabs[0], { key: 'ArrowRight' })

  expect(tabs[3]).toHaveAttribute('aria-selected', 'false')
  expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
  expect(document.activeElement).toBe(tabs[1])
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
    screen.getByRole('button', { name: /Activity & Notes Expand/i })
  ).toHaveAttribute('aria-expanded', 'false')
  expect(
    screen.getByRole('button', { name: /Gallery Expand/i })
  ).toHaveAttribute('aria-expanded', 'false')
  expect(
    screen.getByRole('button', { name: /Quick Stats Collapse/i })
  ).toHaveAttribute('aria-expanded', 'true')
  expect(
    screen.getByRole('button', { name: /Care Profile Collapse/i })
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

  fireEvent.click(screen.getByRole('button', { name: /Gallery Expand/i }))

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
  expect(viewerImg).toHaveAttribute('src', plant.photos[0])

  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(viewerImg).toHaveAttribute('src', plant.photos[1])

  fireEvent.keyDown(window, { key: 'Escape' })
  expect(
    screen.queryByRole('dialog', { name: `${plant.name} gallery` })
  ).toBeNull()

})
