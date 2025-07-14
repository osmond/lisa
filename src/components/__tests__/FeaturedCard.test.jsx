import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FeaturedCard from '../FeaturedCard.jsx'

const task = {
  plantId: 1,
  plantName: 'Aloe',
  image: 'test.jpg',
  type: 'Water',
}

test('shows featured label and plant name', () => {
  render(
    <MemoryRouter>
      <FeaturedCard task={task} />
    </MemoryRouter>
  )
  expect(screen.getByText('🪴 Plant of the Day')).toBeInTheDocument()
  expect(screen.getByText('Aloe')).toBeInTheDocument()
})
