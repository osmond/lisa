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
})

test('accordion keyboard navigation works', () => {
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

  const accordionButtons = [
    screen.getByRole('button', { name: /Details/ }),
    screen.getByRole('button', { name: /Timeline/ }),
  ]

  expect(accordionButtons[0]).toHaveAttribute('aria-expanded', 'true')
  expect(accordionButtons[1]).toHaveAttribute('aria-expanded', 'false')

  accordionButtons[0].focus()
  fireEvent.keyDown(accordionButtons[0], { key: 'ArrowDown' })

  expect(accordionButtons[0]).toHaveAttribute('aria-expanded', 'false')
  expect(accordionButtons[1]).toHaveAttribute('aria-expanded', 'true')
  expect(document.activeElement).toBe(accordionButtons[1])

  fireEvent.keyDown(accordionButtons[1], { key: 'ArrowUp' })

  const tabs = [
    screen.getByRole('tab', { name: /Activity/ }),
    screen.getByRole('tab', { name: /Notes/ }),
    screen.getByRole('tab', { name: /Advanced/ }),
  ]

  expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  tabs[0].focus()
  fireEvent.keyDown(tabs[0], { key: 'ArrowRight' })
  expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
  expect(document.activeElement).toBe(tabs[1])
})

test('add note opens log modal', () => {
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

  const group = screen.getByRole('group', { name: /log actions/i })
  expect(within(group).getAllByRole('button')).toHaveLength(3)

  fireEvent.click(screen.getByRole('button', { name: /Add Note/i }))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})

test('view gallery link shows photo count', () => {
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

  const link = screen.getByRole('link', { name: /view gallery/i })
  expect(link).toHaveAttribute('href', `/plant/${plant.id}/gallery`)
  expect(link).toHaveTextContent(String(plant.photos.length))
})

test('gallery preview shows trash icon on hover', () => {
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

  const img = screen.getByAltText(`${plant.name} 0`)
  const button = img.closest('button')
  expect(button).not.toBeNull()

  fireEvent.mouseOver(button)
  const svg = button.querySelector('svg')
  expect(svg).toBeInTheDocument()
})
