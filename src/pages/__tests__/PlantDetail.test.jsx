import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PlantDetail from '../PlantDetail.jsx'
import plants from '../../plants.json'

const mapPlant = p => ({ ...p, photos: p.photos.map(src => ({ src })) })
import { PlantProvider } from '../../PlantContext.jsx'

test('renders plant details without duplicates', () => {
  const plant = mapPlant(plants[0])
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
  expect(wateredLabel).toHaveClass('font-semibold')
  expect(within(wateredLabel.parentElement).getByText(plant.lastWatered)).toBeInTheDocument()

  const nextLabel = screen.getByText('Next watering:')
  expect(nextLabel).toHaveClass('font-semibold')
  expect(within(nextLabel.parentElement).getByText(plant.nextWater)).toBeInTheDocument()

  const fertLabel = screen.getByText('Last fertilized:')
  expect(fertLabel).toHaveClass('font-semibold')
  expect(within(fertLabel.parentElement).getByText(plant.lastFertilized)).toBeInTheDocument()
})

test('tab keyboard navigation works', () => {
  const plant = mapPlant(plants[0])
  render(
    <PlantProvider>
      <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
        <Routes>
          <Route path="/plant/:id" element={<PlantDetail />} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )

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


test('opens lightbox from gallery', () => {

  const plant = mapPlant(plants[0])
  render(
    <PlantProvider>
      <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
        <Routes>
          <Route path="/plant/:id" element={<PlantDetail />} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )

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

  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(viewerImg).toHaveAttribute('src', plant.photos[1].src)

  fireEvent.keyDown(window, { key: 'Escape' })
  expect(
    screen.queryByRole('dialog', { name: `${plant.name} gallery` })
  ).toBeNull()

})

test('View All opens gallery modal', () => {
  const plant = mapPlant(plants[0])
  render(
    <PlantProvider>
      <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
        <Routes>
          <Route path="/plant/:id" element={<PlantDetail />} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )

  fireEvent.click(screen.getByRole('button', { name: /view all/i }))
  const modal = screen.getByRole('dialog', { name: `${plant.name} gallery` })
  expect(modal).toBeInTheDocument()

  const first = within(modal).getByAltText(`${plant.name} gallery 0`)
  fireEvent.click(first)

  const viewerImg = screen.getByAltText(/gallery image/i)
  expect(viewerImg).toHaveAttribute('src', plant.photos[0].src)
})
