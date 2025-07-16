import { render, fireEvent, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from '../BottomNav.jsx'

test('all icons are aria-hidden', () => {
  const { container } = render(
    <MemoryRouter>
      <BottomNav />
    </MemoryRouter>
  )
  const svgs = container.querySelectorAll('svg')
  svgs.forEach(svg => {
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})

test('does not render gallery link', () => {
  const { container } = render(
    <MemoryRouter>
      <BottomNav />
    </MemoryRouter>
  )
  // open the menu
  fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
  const galleryLink = container.querySelector('a[href="/gallery"]')
  expect(galleryLink).toBeNull()
})

test('renders timeline navigation link', () => {
  const { container } = render(
    <MemoryRouter>
      <BottomNav />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))
  const timelineLink = container.querySelector('a[href="/timeline"]')
  expect(timelineLink).toBeInTheDocument()
})
