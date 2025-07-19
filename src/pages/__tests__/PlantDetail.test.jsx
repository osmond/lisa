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

  // Care Summary tab is active by default
  const wateredLabels = screen.getAllByText(/Last watered/i)
  const wateredLabel = wateredLabels[wateredLabels.length - 1]
  expect(wateredLabel.textContent).toMatch(/Last watered:/i)
  expect(wateredLabel.textContent).toMatch(new RegExp(plant.nextWater))

  const fertHeading = screen.getByText('Fertilizing Needs')
  expect(fertHeading).toBeInTheDocument()
  const fertLabel = screen.getAllByText(new RegExp(plant.nextFertilize))
  const fertText = fertLabel[fertLabel.length - 1]
  expect(fertText.textContent).toMatch(new RegExp(plant.nextFertilize))

  expect(screen.getByText(plant.light)).toBeInTheDocument()
  expect(screen.getByText(plant.humidity)).toBeInTheDocument()
  expect(screen.getByText(plant.difficulty)).toBeInTheDocument()

  const subHeadings = screen.queryAllByRole('heading', { level: 4 })
  expect(subHeadings).toHaveLength(0)
})

test('shows watering progress indicator', () => {
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

  expect(screen.getByLabelText(/watering progress/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/fertilizing progress/i)).toBeInTheDocument()
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

  expect(screen.getByRole('tab', { name: /care summary/i })).toBeInTheDocument()
  expect(screen.getByRole('tab', { name: /activity/i })).toBeInTheDocument()
  expect(screen.getByRole('tab', { name: /gallery/i })).toBeInTheDocument()
  expect(screen.queryByRole('tab', { name: /overview/i })).toBeNull()
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

  fireEvent.click(screen.getByRole('tab', { name: /gallery/i }))

  // Captions are not displayed with thumbnails
  expect(screen.queryByText(plant.photos[0].caption)).toBeNull()

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

  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(viewerImg).toHaveAttribute('src', plant.photos[1].src)

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

  fireEvent.click(screen.getByRole('tab', { name: /gallery/i }))

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
  const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
  const items = within(nav).getAllByRole('listitem')
  expect(items).toHaveLength(3)
  fireEvent.click(screen.getByRole('link', { name: plant.room }))

  expect(screen.getByText(/room view/i)).toBeInTheDocument()
})
