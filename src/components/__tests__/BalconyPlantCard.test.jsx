import { render, screen } from '@testing-library/react'
import BalconyPlantCard from '../BalconyPlantCard.jsx'

test('shows last fertilized info', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  const plant = {
    id: 1,
    name: 'Rose',
    image: 'rose.jpg',
    placeholderSrc: 'rose.jpg',
    lastWatered: '2025-07-08',
    nextWater: '2025-07-15',
    lastFertilized: '2025-07-05'
  }
  render(<BalconyPlantCard plant={plant} />)
  expect(screen.getByText(/last fertilized 5 days ago/i)).toBeInTheDocument()
  expect(screen.getByText(/needs water in 5 days/i)).toBeInTheDocument()
  jest.useRealTimers()
})
