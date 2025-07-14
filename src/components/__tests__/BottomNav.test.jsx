import { render } from '@testing-library/react'
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

test('renders gallery link', () => {
  const { container } = render(
    <MemoryRouter>
      <BottomNav />
    </MemoryRouter>
  )
  const galleryLink = container.querySelector('a[href="/gallery"]')
  expect(galleryLink).not.toBeNull()
})

test('does not render add link', () => {
  const { container } = render(
    <MemoryRouter>
      <BottomNav />
    </MemoryRouter>
  )
  const addLink = container.querySelector('a[href="/add"]')
  expect(addLink).toBeNull()
})
