import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from '../BottomNav.jsx'

test('all icons are aria-hidden', () => {
  const { container } = render(
    <MemoryRouter>
      <BottomNav dueCount={2} />
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
      <BottomNav dueCount={0} />
    </MemoryRouter>
  )
  const galleryLink = container.querySelector('a[href="/gallery"]')
  expect(galleryLink).not.toBeNull()
})

test('shows dynamic tasks label', () => {
  const { getByText } = render(
    <MemoryRouter>
      <BottomNav dueCount={3} />
    </MemoryRouter>
  )
  expect(getByText('To-Do (3)')).toBeInTheDocument()
})
