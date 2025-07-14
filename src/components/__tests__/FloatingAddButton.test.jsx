import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FloatingAddButton from '../FloatingAddButton.jsx'

test('renders link to /add with plus icon', () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/']}> 
      <FloatingAddButton />
    </MemoryRouter>
  )
  const link = screen.getByRole('link', { name: /add plant/i })
  expect(link).toHaveAttribute('href', '/add')
  const svg = container.querySelector('svg')
  expect(svg).toHaveAttribute('aria-hidden', 'true')
})

test('does not render on add page', () => {
  const { queryByRole } = render(
    <MemoryRouter initialEntries={['/add']}>
      <FloatingAddButton />
    </MemoryRouter>
  )
  expect(queryByRole('link', { name: /add plant/i })).toBeNull()
})
