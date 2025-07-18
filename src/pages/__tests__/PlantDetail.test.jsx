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

  const wateredLabel = screen.getByText(/Last watered/i)
  expect(
    within(wateredLabel.parentElement).getByText(new RegExp(plant.lastWatered))
  ).toBeInTheDocument()

  const waterHeading = screen.getByText('Watering')
  const nextLabels = screen.getAllByText(/Next due:/i)
  expect(screen.getByText(new RegExp(plant.nextWater))).toBeInTheDocument()
  expect(
    screen.getByRole('button', {
      name: `Mark ${plant.name} as watered`,
    })
  ).toBeInTheDocument()

  const fertHeading = screen.getByText('Fertilizing')
  const nextFertLabel = nextLabels.find(label => label !== nextLabels[0])
  expect(screen.getAllByText(new RegExp(plant.nextFertilize)).length).toBeGreaterThan(0)
  expect(
    screen.getByRole('button', {
      name: `Mark ${plant.name} as fertilized`,
    })
  ).toBeInTheDocument()

  const fertLabel = screen.getByText(/Last fertilized/i)
  expect(
    within(fertLabel.parentElement).getByText(new RegExp(plant.lastFertilized))
  ).toBeInTheDocument()

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

  const img = screen.getByAltText(
    plant.photos[0].caption || `${plant.name} photo 1`
  )
  fireEvent.click(img.closest('button'))

  const dialogsAfterOpen = screen.getAllByRole('dialog', {
    name: `${plant.name} gallery`,
  })
  // First dialog is the gallery overlay
  expect(dialogsAfterOpen[0]).toBeInTheDocument()
  fireEvent.click(img)

  const dialogs = screen.getAllByRole('dialog', {
    name: `${plant.name} gallery`,
  })
  // The first dialog is the gallery overlay; the second is the Lightbox viewer
  const viewerDialog = dialogs[1]
  expect(viewerDialog).toBeInTheDocument()

  const viewerImg = screen.getAllByAltText(
    plant.photos[0].caption || /gallery image/i
  )[1]
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

  const viewerImg = screen.getAllByAltText(
    plant.photos[0].caption || /gallery image/i
  )[1]
  expect(viewerImg).toHaveAttribute('src', plant.photos[0].src)
})

test('breadcrumb link navigates to room page and no back button is shown', () => {
  const plant = plants[0]
  render(
    <MenuProvider>
      <PlantProvider>
        <MemoryRouter initialEntries={['/myplants', `/plant/${plant.id}`]} initialIndex={1}>
          <Routes>
            <Route path="/myplants" element={<div>All Plants View</div>} />
            <Route path="/room/:roomName" element={<div>Room View</div>} />
            <Route path="/plant/:id" element={<PlantDetail />} />
          </Routes>
        </MemoryRouter>
      </PlantProvider>
    </MenuProvider>
  )

  expect(screen.queryByRole('button', { name: /back/i })).toBeNull()
  fireEvent.click(screen.getByRole('link', { name: plant.room }))

  expect(screen.getByText(/room view/i)).toBeInTheDocument()
})
