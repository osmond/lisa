import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App.jsx'

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: [] }),
}))

jest.mock('../../RoomContext.jsx', () => ({
  useRooms: () => ({ rooms: [] }),
}))

jest.mock('../../components/CreateFab.jsx', () => () => null)
jest.mock('../../components/PersistentBottomNav.jsx', () => () => null)

test("navigating to /plants redirects to My Plants", () => {
  render(
    <MemoryRouter initialEntries={['/plants']}>
      <App />
    </MemoryRouter>
  )
  expect(screen.getByRole('heading', { name: /my plants/i })).toBeInTheDocument()
})
