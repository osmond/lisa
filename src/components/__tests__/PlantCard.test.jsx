import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PlantCard from '../PlantCard.jsx'

const plant = {
  image: 'test.jpg',
  name: 'Aloe Vera',
  lastWatered: '2024-05-01',
  nextWater: '2024-05-07'
};

test('renders plant name', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  expect(screen.getByText('Aloe Vera')).toBeInTheDocument()
})
