import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SimpleTaskCard from '../SimpleTaskCard.jsx'

const plant = {
  id: 1,
  name: 'Fern',
  image: 'fern.jpg',
}

test('shows badges when due for water and fertilize', () => {
  render(
    <MemoryRouter>
      <SimpleTaskCard plant={plant} label="Needs care" dueWater dueFertilize />
    </MemoryRouter>
  )
  expect(screen.getByText('Water')).toBeInTheDocument()
  expect(screen.getByText('Fertilize')).toBeInTheDocument()
})

test('omits badges when not due', () => {
  render(
    <MemoryRouter>
      <SimpleTaskCard plant={plant} label="None" />
    </MemoryRouter>
  )
  expect(screen.queryByText('Water')).toBeNull()
  expect(screen.queryByText('Fertilize')).toBeNull()
})
