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

test('renders gallery link', () => {
  const { container } = render(
    <MemoryRouter>
      <MenuProvider>
        <BottomNav />
      </MenuProvider>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
  const galleryLink = container.querySelector('a[href="/gallery"]')
  expect(galleryLink).toBeInTheDocument()
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
