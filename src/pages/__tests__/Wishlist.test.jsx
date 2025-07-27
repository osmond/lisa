import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { WishlistProvider } from '../../WishlistContext.jsx'
import Wishlist from '../Wishlist.jsx'

jest.mock('../../hooks/useSnackbar.jsx', () => ({
  __esModule: true,
  default: () => ({ showSnackbar: jest.fn() })
}))

function renderWithProvider(ui, wishlist = []) {
  return render(
    <WishlistProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </WishlistProvider>
  )
}

test('shows message when wishlist empty', () => {
  renderWithProvider(<Wishlist />)
  expect(screen.getByText(/no plants in wishlist/i)).toBeInTheDocument()
})

const plant = { id: 1, name: 'Test', image: 't.jpg' }

test('displays plants in wishlist', () => {
  localStorage.setItem('wishlist', JSON.stringify([plant]))
  renderWithProvider(<Wishlist />)
  expect(screen.getByText('Test')).toBeInTheDocument()
  localStorage.clear()
})
