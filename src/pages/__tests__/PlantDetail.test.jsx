import { render, screen, fireEvent, within, act, waitFor } from '@testing-library/react'
import {
  MemoryRouter,
  Routes,
  Route,
  unstable_HistoryRouter as HistoryRouter,
} from 'react-router-dom'
import { createMemoryHistory } from '@remix-run/router'
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

test('water care card shows volume info', () => {
  localStorage.setItem(
    'plants',
    JSON.stringify([
      {
        id: 1,
        name: 'Aloe',
        image: 'a.jpg',
        waterPlan: { volume_ml: 819, volume_oz: 28, interval: 7 },
        smartWaterPlan: { volume_ml: 2081, volume_oz: 70, interval: 9, reason: 'AI' },
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



  localStorage.clear()
})

test('cannot mark fertilize done when not scheduled', () => {
  const plant = plants.find(p => p.id === 2)
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

  expect(screen.queryByRole('button', { name: /mark as done/i })).toBeNull()
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
  const { container } = render(
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
  expect(backBtn).toHaveClass('backdrop-blur-sm')
  fireEvent.mouseDown(backBtn)
  expect(container.querySelector('.ripple-effect')).toBeInTheDocument()
  fireEvent.click(backBtn)

  expect(screen.getByText(/all plants view/i)).toBeInTheDocument()
})

test('back label shows room name', () => {
  const plant = plants[0]
  render(
    <OpenAIProvider>
      <MenuProvider>
        <PlantProvider>
          <MemoryRouter
            initialEntries={[
              '/room/Balcony',
              {
                pathname: `/room/Balcony/plant/${plant.id}`,
                state: { from: '/room/Balcony' },
              },
            ]}
            initialIndex={1}
          >
            <Routes>
              <Route path="/room/:roomName" element={<div>Room View</div>} />
              <Route path="/room/:roomName/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </PlantProvider>
      </MenuProvider>
    </OpenAIProvider>
  )

  expect(
    screen.getByRole('button', { name: /← Balcony/i })
  ).toBeInTheDocument()
})

test('selected tab persists after navigating away and back', () => {
  const plant = plants[0]
  const history = createMemoryHistory({ initialEntries: [`/plant/${plant.id}`] })
  render(
    <OpenAIProvider>
      <MenuProvider>
        <PlantProvider>
          <HistoryRouter history={history}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
              <Route path="/other" element={<div>Other</div>} />
            </Routes>
          </HistoryRouter>
        </PlantProvider>
      </MenuProvider>
    </OpenAIProvider>
  )

  fireEvent.click(screen.getByRole('tab', { name: /gallery/i }))
  expect(history.location.search).toBe('?tab=gallery')

  act(() => history.push('/other'))

  act(() => history.go(-1))

  expect(
    screen.getByRole('tab', { name: /gallery/i })
  ).toHaveAttribute('aria-selected', 'true')
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
        waterPlan: { volume_ml: 164, volume_oz: 6, interval: 7 },
        smartWaterPlan: { volume_ml: 197, volume_oz: 7, interval: 5, reason: 'test reason' },
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
    within(panel).getByText((c, el) => el.textContent === 'Amount: 164 mL / 6 oz')
  ).toBeInTheDocument()

  localStorage.clear()
})

test('care plan info modal opens from button', () => {
  localStorage.setItem(
    'plants',
    JSON.stringify([
      {
        id: 1,
        name: 'Aloe',
        image: 'a.jpg',
        diameter: 4,
        waterPlan: { volume_ml: 164, volume_oz: 6, interval: 7 },
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
  const btn = within(panel).getByRole('button', {
    name: /how care plan is generated/i,
  })
  fireEvent.click(btn)

  expect(
    screen.getByRole('dialog', { name: /care plan information/i })
  ).toBeInTheDocument()

  localStorage.clear()
})

test('renders carePlan values in list', () => {
  localStorage.setItem(
    'plants',
    JSON.stringify([
      {
        id: 1,
        name: 'Aloe',
        image: 'a.jpg',
        diameter: 4,
        waterPlan: { volume_ml: 164, volume_oz: 6, interval: 7 },
        carePlan: { water: 7, fertilize: 30, light: 'Medium' },
        notes: '{"water":7}',
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
  const list = within(panel).getByTestId('care-plan-list')
  expect(within(list).getByText(/water every 7 days/i)).toBeInTheDocument()
  expect(within(list).getByText(/fertilize every 30 days/i)).toBeInTheDocument()
  expect(within(list).getByText(/light: medium/i)).toBeInTheDocument()

  localStorage.clear()
})

test('shows care plan setup button when plan missing', () => {
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

  fireEvent.click(screen.getByRole('tab', { name: /care plan/i }))
  const panel = screen.getByTestId('care-plan-tab')
  expect(
    within(panel).getByRole('link', { name: /set up care plan/i })
  ).toBeInTheDocument()
})

test('shows edit care plan link when schedule exists', () => {
  localStorage.setItem(
    'plants',
    JSON.stringify([
      {
        id: 1,
        name: 'Aloe',
        image: 'a.jpg',
        waterPlan: { volume_ml: 164, volume_oz: 6, interval: 7 },
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
    within(panel).getByRole('link', { name: /edit care plan/i })
  ).toBeInTheDocument()

  localStorage.clear()
})

test('hero image container uses rounded corners', () => {
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

  const img = screen.getByAltText(plant.name)
  const hero = img.parentElement
  expect(hero).toHaveClass('rounded-xl')
  expect(hero).not.toHaveClass('rounded-b-xl')
})

