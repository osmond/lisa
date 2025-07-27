import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DiscoveryCard from '../DiscoveryCard.jsx'
import { WishlistProvider } from '../../WishlistContext.jsx'

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
  render(
    <WishlistProvider>
      <DiscoveryCard plant={plant} />
    </WishlistProvider>
  )
  expect(screen.getByText('Test Plant')).toBeInTheDocument()
  expect(screen.getByText(/Add to Wishlist/i)).toBeInTheDocument()
})

test('calls callback when adding', () => {
  const onAdd = jest.fn()
  render(
    <WishlistProvider>
      <DiscoveryCard plant={plant} onAdd={onAdd} />
    </WishlistProvider>
  )
  fireEvent.click(screen.getByText(/Add to Wishlist/i))
  expect(onAdd).toHaveBeenCalledWith(plant)
})

test('shows disabled state when already in wishlist', () => {
  localStorage.setItem('wishlist', JSON.stringify([plant]))
  render(
    <WishlistProvider>
      <DiscoveryCard plant={plant} />
    </WishlistProvider>
  )
  const button = screen.getByText(/in wishlist/i)
  expect(button).toBeDisabled()
  localStorage.clear()
})

afterEach(async () => {
  await waitFor(() => {})
})
