import { render, fireEvent, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from '../BottomNav.jsx'
import { MenuProvider } from '../../MenuContext.jsx'

test('all icons are aria-hidden', () => {
  const { container } = render(
    <MemoryRouter>
      <MenuProvider>
        <BottomNav />
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
        <BottomNav />
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
        <BottomNav />
      </MenuProvider>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
  const timelineLink = container.querySelector('a[href="/timeline"]')
  expect(timelineLink).toBeInTheDocument()
})

test('renders add plant navigation link', () => {
  const { container } = render(
    <MemoryRouter>
      <MenuProvider>
        <BottomNav />
      </MenuProvider>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
  const addLink = container.querySelector('a[href="/add"]')
  expect(addLink).toBeInTheDocument()
})

test('renders add room navigation link', () => {
  const { container } = render(
    <MemoryRouter>
      <MenuProvider>
        <BottomNav />
      </MenuProvider>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
  const addRoomLink = container.querySelector('a[href="/room/add"]')
  expect(addRoomLink).toBeInTheDocument()
})
