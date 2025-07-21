import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PlantDetail from '../PlantDetail.jsx'
import plants from '../../plants.json'
import { PlantProvider } from '../../PlantContext.jsx'
import { MenuProvider } from '../../MenuContext.jsx'
import SnackbarProvider, { Snackbar } from '../../hooks/SnackbarProvider.jsx'
import { OpenAIProvider } from '../../OpenAIContext.jsx'

test('renders plant details without duplicates', () => {
  const plant = plants[0]
  render(
    <OpenAIProvider>
      <MenuProvider>
        <PlantProvider>
          <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </PlantProvider>
      </MenuProvider>
    </OpenAIProvider>
  )

  const headings = screen.getAllByRole('heading', { name: plant.name })
  expect(headings).toHaveLength(1)

  const images = screen.getAllByAltText(plant.name)
  expect(images).toHaveLength(1)

  // Care tab is active by default
  expect(
    screen.getByText(/progress toward next scheduled care/i)
  ).toBeInTheDocument()

  const subHeadings = screen.queryAllByRole('heading', { level: 4 })
  expect(subHeadings).toHaveLength(0)
})

test('shows watering progress indicator', () => {
  const plant = plants[0]
  render(
    <OpenAIProvider>
      <MenuProvider>
        <PlantProvider>
          <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </PlantProvider>
      </MenuProvider>
    </OpenAIProvider>
  )

  expect(screen.getByLabelText(/care progress/i)).toBeInTheDocument()
})

test('shows countdown text inside care cards', () => {
  const plant = plants[0]
  jest.useFakeTimers().setSystemTime(new Date('2025-07-20'))
  render(
    <OpenAIProvider>
      <MenuProvider>
        <PlantProvider>
          <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </PlantProvider>
      </MenuProvider>
    </OpenAIProvider>
  )

  expect(screen.getByText(/due in 5 days/i)).toBeInTheDocument()
  expect(screen.getByText(/due in 28 days/i)).toBeInTheDocument()
  jest.useRealTimers()
})

test('tasks tab displays a heading', () => {
  const plant = plants[0]
  render(
    <OpenAIProvider>
      <MenuProvider>
        <PlantProvider>
          <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </PlantProvider>
      </MenuProvider>
    </OpenAIProvider>
  )

  expect(screen.getByTestId('tasks-heading')).toHaveTextContent(/today/i)
})


test('displays all sections', () => {
  const plant = plants[0]
  render(
    <OpenAIProvider>
      <MenuProvider>
        <PlantProvider>
          <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </PlantProvider>
      </MenuProvider>
    </OpenAIProvider>
  )

  expect(screen.getByRole('tab', { name: /tasks/i })).toBeInTheDocument()
  expect(screen.getByRole('tab', { name: /care plan/i })).toBeInTheDocument()
  expect(screen.getByRole('tab', { name: /activity/i })).toBeInTheDocument()
  expect(screen.getByRole('tab', { name: /gallery/i })).toBeInTheDocument()
  expect(screen.queryByRole('tab', { name: /overview/i })).toBeNull()
})




test('opens lightbox from gallery', () => {

  const plant = plants[0]
  render(
    <OpenAIProvider>
      <MenuProvider>
        <PlantProvider>
          <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </PlantProvider>
      </MenuProvider>
    </OpenAIProvider>
  )

  fireEvent.click(screen.getByRole('tab', { name: /gallery/i }))

  // Captions are not displayed with thumbnails
  expect(screen.queryByText(plant.photos[0].caption)).toBeNull()

  const img = screen.getByAltText(
    plant.photos[0].caption || `${plant.name} photo 1`
  )
  fireEvent.click(img.closest('button'))

  const viewerDialog = screen.getByRole('dialog', {
    name: `${plant.name} gallery`,
  })
  expect(viewerDialog).toBeInTheDocument()

  const viewerImg = within(viewerDialog).getByAltText(
    plant.photos[0].caption || /gallery image/i
  )
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
    <OpenAIProvider>
      <MenuProvider>
        <PlantProvider>
          <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </PlantProvider>
      </MenuProvider>
    </OpenAIProvider>
  )

  fireEvent.click(screen.getByRole('tab', { name: /gallery/i }))

  const viewAll = screen.getByRole('button', { name: /view all photos/i })
  fireEvent.click(viewAll)

  const viewerDialog = screen.getByRole('dialog', {
    name: `${plant.name} gallery`,
  })
  const viewerImg = within(viewerDialog).getByAltText(
    plant.photos[0].caption || /gallery image/i
  )
  expect(viewerImg).toHaveAttribute('src', plant.photos[0].src)
})

test('back button navigates to previous page', () => {
  const plant = plants[0]
  render(
    <OpenAIProvider>
      <MenuProvider>
        <PlantProvider>
          <MemoryRouter
            initialEntries={[
              '/myplants',
              { pathname: `/plant/${plant.id}`, state: { from: '/myplants' } },
            ]}
            initialIndex={1}
          >
            <Routes>
              <Route path="/myplants" element={<div>All Plants View</div>} />
              <Route path="/room/:roomName" element={<div>Room View</div>} />
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </PlantProvider>
      </MenuProvider>
    </OpenAIProvider>
  )

  const backBtn = screen.getByRole('button', { name: /back/i })
  expect(backBtn).toBeInTheDocument()
  fireEvent.click(backBtn)

  expect(screen.getByText(/all plants view/i)).toBeInTheDocument()
})

test('care tab hides kebab menu for due tasks', () => {
  const plant = plants[0]
  jest.useFakeTimers().setSystemTime(new Date('2025-07-25'))
  render(
    <OpenAIProvider>
      <SnackbarProvider>
        <MenuProvider>
          <PlantProvider>
            <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
              <Routes>
                <Route path="/plant/:id" element={<PlantDetail />} />
              </Routes>
            </MemoryRouter>
          </PlantProvider>
        </MenuProvider>
        <Snackbar />
      </SnackbarProvider>
    </OpenAIProvider>
  )

  expect(screen.queryByRole('button', { name: /open task menu/i })).toBeNull()
  jest.useRealTimers()
})

test('care plan tab displays stored onboarding values', () => {
  localStorage.setItem(
    'plants',
    JSON.stringify([
      {
        id: 1,
        name: 'Aloe',
        image: 'a.jpg',
        diameter: 4,
        waterPlan: { volume: 10, interval: 7 },
        smartWaterPlan: { volume: 12, interval: 5, reason: 'test reason' },
        notes: 'keep soil moist',
        photos: [],
        careLog: [],
      },
    ])
  )

  render(
    <OpenAIProvider>
      <MenuProvider>
        <PlantProvider>
          <MemoryRouter initialEntries={['/plant/1']}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </PlantProvider>
      </MenuProvider>
    </OpenAIProvider>
  )

  fireEvent.click(screen.getByRole('tab', { name: /care plan/i }))

  const panel = screen.getByTestId('care-plan-tab')
  expect(
    within(panel).getByText((c, el) => el.textContent === 'Pot diameter: 4 in')
  ).toBeInTheDocument()
  expect(
    within(panel).getByRole('heading', { name: /recommended plan/i })
  ).toBeInTheDocument()
  expect(
    within(panel).getByText((c, el) => el.textContent === 'Water every: 7 days')
  ).toBeInTheDocument()
  expect(
    within(panel).getByText((c, el) => el.textContent === 'Amount: 10 in³')
  ).toBeInTheDocument()
  expect(
    within(panel).getByTestId('smart-water-plan-details')
  ).toHaveTextContent('12 in³ every 5 days — test reason')
  expect(within(panel).getByText('keep soil moist')).toBeInTheDocument()

  localStorage.clear()
})
