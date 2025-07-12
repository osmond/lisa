import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PlantDetail from '../PlantDetail.jsx'
import plants from '../../plants.json'

test('renders plant details', () => {
  const plant = plants[0]
  render(
    <MemoryRouter initialEntries={[`/plant/${plant.id}`]}>
      <Routes>
        <Route path="/plant/:id" element={<PlantDetail />} />
      </Routes>
    </MemoryRouter>
  )
  expect(screen.getAllByText(plant.name).length).toBeGreaterThan(0)
})
