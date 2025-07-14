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


test('does not render add link', () => {
  const { container } = render(
    <MemoryRouter>
      <BottomNav />
    </MemoryRouter>
  )
  const addLink = container.querySelector('a[href="/add"]')
  expect(addLink).toBeNull()
})

test('active link icon has nav-active animation', () => {
  const { container } = render(
    <MemoryRouter initialEntries={["/gallery"]}>
      <BottomNav />
    </MemoryRouter>
  )
  const activeLink = container.querySelector('a[href="/gallery"]')
  const icon = activeLink.querySelector('svg')
  expect(icon).toHaveClass('nav-active')
})

test('active link has bg style applied', () => {
  const { container } = render(
    <MemoryRouter initialEntries={["/gallery"]}>
      <BottomNav />
    </MemoryRouter>
  )
  const activeLink = container.querySelector('a[href="/gallery"]')
  expect(activeLink.className).toEqual(expect.stringContaining('bg-green-50'))
})

test('shows dynamic tasks badge', () => {
  const { container } = render(
    <MemoryRouter>
      <BottomNav dueCount={3} />
    </MemoryRouter>
  )
  const tasksLink = container.querySelector('a[href="/tasks"]')
  const badge = tasksLink.querySelector('span span')
  expect(badge).toHaveTextContent('3')
})
