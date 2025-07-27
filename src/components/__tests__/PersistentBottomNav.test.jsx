import { render, fireEvent, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { useEffect } from 'react'
import { Gear } from 'phosphor-react'
import PersistentBottomNav from '../PersistentBottomNav.jsx'
import { MenuProvider, defaultMenu, useMenu } from '../../MenuContext.jsx'
import useOverdueCount from '../../hooks/useOverdueCount.js'
import { useWishlist } from '../../WishlistContext.jsx'

jest.mock('../../hooks/useOverdueCount.js')
jest.mock('../../WishlistContext.jsx')

const customMenu = {
  ...defaultMenu,
  items: [
    ...defaultMenu.items,
    { to: '/settings', label: 'Profile', Icon: Gear },
    { to: '/extra', label: 'Extra', Icon: Gear },
  ],
}

function CustomMenuProvider({ children }) {
  return (
    <MenuProvider>
      <MenuSetter>{children}</MenuSetter>
    </MenuProvider>
  )
}

function MenuSetter({ children }) {
  const { setMenu } = useMenu()
  useEffect(() => {
    setMenu(customMenu)
  }, [])
  return children
}

test('renders main navigation links', () => {
  useOverdueCount.mockReturnValue(0)
  useWishlist.mockReturnValue({ wishlist: [] })
  const { container } = render(
    <MemoryRouter>
      <CustomMenuProvider>
        <PersistentBottomNav />
      </CustomMenuProvider>
    </MemoryRouter>
  )
  expect(container.querySelector('a[href="/"]')).toBeInTheDocument()
  expect(container.querySelector('a[href="/myplants"]')).toBeInTheDocument()
  expect(container.querySelector('a[href="/timeline"]')).toBeInTheDocument()
  expect(container.querySelector('a[href="/profile"]')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /open add menu/i })).toBeNull()
})

test('shows overdue badge when tasks pending', () => {
  useOverdueCount.mockReturnValue(3)
  useWishlist.mockReturnValue({ wishlist: [] })
  render(
    <MemoryRouter>
      <CustomMenuProvider>
        <PersistentBottomNav />
      </CustomMenuProvider>
    </MemoryRouter>
  )
  expect(screen.getByText('3')).toBeInTheDocument()
})

test('profile link replaces more button when additional links exist', () => {
  useOverdueCount.mockReturnValue(0)
  useWishlist.mockReturnValue({ wishlist: [] })
  const { container } = render(
    <MemoryRouter>
      <CustomMenuProvider>
        <PersistentBottomNav />
      </CustomMenuProvider>
    </MemoryRouter>
  )

  const button = screen.getByRole('button', { name: /open navigation menu/i })
  fireEvent.click(button)
  const overlay = screen.getByRole('dialog', { name: /navigation menu/i })
  expect(overlay).toBeInTheDocument()
  expect(overlay).toHaveClass('backdrop-blur-sm')
  expect(screen.queryByRole('link', { name: /add plant/i })).toBeNull()
  expect(screen.queryByRole('link', { name: /add room/i })).toBeNull()
  expect(overlay.querySelector('a[href="/extra"]')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /close menu/i }))

  expect(screen.queryByRole('dialog', { name: /navigation menu/i })).toBeNull()
})

test('shows wishlist count badge', () => {
  useOverdueCount.mockReturnValue(0)
  useWishlist.mockReturnValue({ wishlist: [{ id: 1 }] })
  const { container } = render(
    <MemoryRouter>
      <CustomMenuProvider>
        <PersistentBottomNav />
      </CustomMenuProvider>
    </MemoryRouter>
  )
  const link = container.querySelector('a[href="/wishlist"]')
  expect(link.querySelector('span').textContent).toBe('1')
})
