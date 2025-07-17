import { render, fireEvent, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CreateFab from '../CreateFab.jsx'

function Wrapper() {
  return (
    <MemoryRouter>
      <CreateFab />
    </MemoryRouter>
  )
}

test('renders add links when opened', () => {
  render(<Wrapper />)
  fireEvent.click(screen.getByRole('button', { name: /open create menu/i }))
  expect(screen.getByRole('link', { name: /add plant/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /add room/i })).toBeInTheDocument()
})
