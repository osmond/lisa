import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PlantDetail from '../PlantDetail.jsx'
import plants from '../../plants.json'
import { PlantProvider } from '../../PlantContext.jsx'
import { MenuProvider } from '../../MenuContext.jsx'

test('renders plant details without duplicates', () => {
  const plant = plants[0]
  render(
    <MenuProvider>
      <PlantProvider>
        <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
          <Routes>
            <Route path="/plant/:id" element={<PlantDetail />} />
          </Routes>
        </MemoryRouter>
      </PlantProvider>
    </MenuProvider>
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

  const subHeadings = screen.queryAllByRole('heading', { level: 4 })
  expect(subHeadings).toHaveLength(0)
})


test('displays all sections', () => {
  const plant = plants[0]
  render(
    <MenuProvider>
      <PlantProvider>
        <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
          <Routes>
            <Route path="/plant/:id" element={<PlantDetail />} />
          </Routes>
        </MemoryRouter>
      </PlantProvider>
    </MenuProvider>
  )

  expect(screen.getByRole('heading', { name: /quick stats/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /activity & notes/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /gallery/i })).toBeInTheDocument()
})

test('shows watering progress ring', () => {
  const plant = plants[0]
  render(
    <MenuProvider>
      <PlantProvider>
        <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
          <Routes>
            <Route path="/plant/:id" element={<PlantDetail />} />
          </Routes>
        </MemoryRouter>
      </PlantProvider>
    </MenuProvider>
  )

  expect(screen.getByTestId('watering-ring')).toBeInTheDocument()
})


test('opens lightbox from gallery', () => {

  const plant = plants[0]
  render(
    <MenuProvider>
      <PlantProvider>
        <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
          <Routes>
            <Route path="/plant/:id" element={<PlantDetail />} />
          </Routes>
        </MemoryRouter>
      </PlantProvider>
    </MenuProvider>
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

test('view all button opens the viewer from first image', () => {
  const plant = plants[0]
  render(
    <MenuProvider>
      <PlantProvider>
        <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
          <Routes>
            <Route path="/plant/:id" element={<PlantDetail />} />
          </Routes>
        </MemoryRouter>
      </PlantProvider>
    </MenuProvider>
  )

  const viewAll = screen.getByRole('button', { name: /view all photos/i })
  fireEvent.click(viewAll)

  const viewerImg = screen.getByAltText(/gallery image/i)
  expect(viewerImg).toHaveAttribute('src', plant.photos[0].src)
})

test('back button navigates to previous page', () => {
  const plant = plants[0]
  render(
    <MenuProvider>
      <PlantProvider>
        <MemoryRouter initialEntries={['/myplants', `/plant/${plant.id}`]} initialIndex={1}>
          <Routes>
            <Route path="/myplants" element={<div>My Plants View</div>} />
            <Route path="/plant/:id" element={<PlantDetail />} />
          </Routes>
        </MemoryRouter>
      </PlantProvider>
    </MenuProvider>
  )

  fireEvent.click(screen.getByRole('button', { name: /back/i }))

  expect(screen.getByText(/my plants view/i)).toBeInTheDocument()
})
