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

test('uses placeholder image when missing', () => {
  const noImagePlant = {
    name: 'No Image',
    lastWatered: '2024-05-01',
    nextWater: '2024-05-07',
  }
  render(
    <PlantProvider>
      <MemoryRouter>
        <PlantCard plant={noImagePlant} />
      </MemoryRouter>
    </PlantProvider>
  )
  const img = screen.getByRole('img')
  expect(img).toHaveAttribute('src', expect.stringContaining('/images/default.jpg'))
})
