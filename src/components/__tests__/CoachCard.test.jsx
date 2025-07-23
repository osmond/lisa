import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CoachCard from '../CoachCard.jsx'

test('links to the coach page for the plant', () => {
  render(
    <MemoryRouter>
      <CoachCard plantId={1} />
    </MemoryRouter>
  )
  const link = screen.getByRole('link', { name: /coach/i })
  expect(link).toHaveAttribute('href', '/plant/1/coach')
})
