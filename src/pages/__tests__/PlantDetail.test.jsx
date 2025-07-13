import { render, screen, fireEvent } from '@testing-library/react'
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

  const tabs = screen.getAllByRole('tab')
  expect(tabs).toHaveLength(3)
  expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

  tabs[0].focus()
  fireEvent.keyDown(tabs[0], { key: 'ArrowRight' })

  const updatedTabs = screen.getAllByRole('tab')
  expect(updatedTabs[1]).toHaveAttribute('aria-selected', 'true')
  expect(document.activeElement).toBe(updatedTabs[1])
})

test('shows placeholder when image missing', () => {
  const plant = { id: 123, name: 'Placeholder Test' }
  localStorage.setItem('plants', JSON.stringify([plant]))
  render(
    <PlantProvider>
      <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
        <Routes>
          <Route path="/plant/:id" element={<PlantDetail />} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )
  const img = screen.getByRole('img')
  expect(img).toHaveAttribute('src', expect.stringContaining('/images/default.jpg'))
  localStorage.removeItem('plants')
})
