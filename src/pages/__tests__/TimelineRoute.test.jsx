import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App.jsx'

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: [{ id: 1, name: 'Plant A', lastWatered: '2025-07-10' }] }),
}))

test('navigating to /timeline renders the Timeline page', () => {
  render(
    <MemoryRouter initialEntries={['/timeline']}>
      <App />
    </MemoryRouter>
  )

  expect(screen.getByText(/Watered Plant A/)).toBeInTheDocument()
})
