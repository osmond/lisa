import { render, fireEvent, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
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
