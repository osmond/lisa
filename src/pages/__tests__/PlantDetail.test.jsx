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

  const buttons = [
    screen.getByRole('button', { name: /Activity/ }),
    screen.getByRole('button', { name: /Notes/ }),
    screen.getByRole('button', { name: /Advanced/ }),
    screen.getByRole('button', { name: /Timeline/ }),
  ]

  expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
  expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')

  buttons[0].focus()
  fireEvent.keyDown(buttons[0], { key: 'ArrowDown' })

  expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
  expect(buttons[1]).toHaveAttribute('aria-expanded', 'true')
  expect(document.activeElement).toBe(buttons[1])
})
