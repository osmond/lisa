import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PlantCard from '../PlantCard.jsx'
import { PlantProvider } from '../../PlantContext.jsx'

const plant = {
  image: 'test.jpg',
  name: 'Aloe Vera',
  lastWatered: '2024-05-01',
  nextWater: '2024-05-07'
};

test('renders plant name', () => {
  render(
    <PlantProvider>
      <MemoryRouter>
        <PlantCard plant={plant} />
      </MemoryRouter>
    </PlantProvider>
  )
  expect(screen.getByText('Aloe Vera')).toBeInTheDocument()
})
