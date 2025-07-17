import { render, fireEvent, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { useEffect } from 'react'
import { Gear } from 'phosphor-react'
import PersistentBottomNav from '../PersistentBottomNav.jsx'
import { MenuProvider, defaultMenu, useMenu } from '../../MenuContext.jsx'

const customMenu = {
  ...defaultMenu,
  items: [...defaultMenu.items, { to: '/profile', label: 'Profile', Icon: Gear }],
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
})

test('more menu opens and closes with additional links', () => {
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
  expect(container.querySelector('a[href="/profile"]')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
  expect(screen.queryByRole('dialog', { name: /navigation menu/i })).toBeNull()

})
