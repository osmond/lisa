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
  expect(container.querySelector('a[href="/profile"]')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
  expect(screen.queryByRole('dialog', { name: /navigation menu/i })).toBeNull()
=======
import PersistentBottomNav from '../PersistentBottomNav.jsx'
import { MenuProvider } from '../../MenuContext.jsx'

test('all icons are aria-hidden', () => {
  const { container } = render(
    <MemoryRouter>
      <MenuProvider>
        <PersistentBottomNav />
      </MenuProvider>
    </MemoryRouter>
  )
  const svgs = container.querySelectorAll('svg')
  svgs.forEach(svg => {
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})

test('renders my plants link', () => {
  const { container } = render(
    <MemoryRouter>
      <MenuProvider>
        <PersistentBottomNav />
      </MenuProvider>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
  const plantsLink = container.querySelector('a[href="/myplants"]')
  expect(plantsLink).toBeInTheDocument()
})

test('renders timeline navigation link', () => {
  const { container } = render(
    <MemoryRouter>
      <MenuProvider>
        <PersistentBottomNav />
      </MenuProvider>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
  const timelineLink = container.querySelector('a[href="/timeline"]')
  expect(timelineLink).toBeInTheDocument()
})

test('does not render add links', () => {
  const { container } = render(
    <MemoryRouter>
      <MenuProvider>
        <PersistentBottomNav />
      </MenuProvider>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
  expect(container.querySelector('a[href="/add"]')).toBeNull()
  expect(container.querySelector('a[href="/room/add"]')).toBeNull()
})

test('overlay has blur effect', () => {
  const { container } = render(
    <MemoryRouter>
      <MenuProvider>
        <PersistentBottomNav />
      </MenuProvider>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
  const overlay = container.querySelector('div[role="dialog"]')
  expect(overlay).toHaveClass('backdrop-blur-sm')

})
