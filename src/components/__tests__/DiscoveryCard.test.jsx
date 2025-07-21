import { render, screen, fireEvent } from '@testing-library/react'
import DiscoveryCard from '../DiscoveryCard.jsx'

const plant = {
  id: 1,
  name: 'Test Plant',
  image: 'img.jpg',
  origin: 'Asia',
  light: 'Bright',
  humidity: 'High',
  difficulty: 'Easy'
}

test('renders plant info and button', () => {
  render(<DiscoveryCard plant={plant} />)
  expect(screen.getByText('Test Plant')).toBeInTheDocument()
  expect(screen.getByText(/Add to Wishlist/i)).toBeInTheDocument()
})

test('calls callback when adding', () => {
  const onAdd = jest.fn()
  render(<DiscoveryCard plant={plant} onAdd={onAdd} />)
  fireEvent.click(screen.getByText(/Add to Wishlist/i))
  expect(onAdd).toHaveBeenCalledWith(plant)
})
