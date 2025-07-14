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

test('active link icon has nav-bounce animation', () => {
  const { container } = render(
    <MemoryRouter initialEntries={["/gallery"]}>
      <BottomNav />
    </MemoryRouter>
  )
  const activeLink = container.querySelector('a[href="/gallery"]')
  const icon = activeLink.querySelector('svg')
  expect(icon).toHaveClass('nav-bounce')
})
