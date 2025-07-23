import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { OpenAIProvider } from '../../OpenAIContext.jsx'
import App from '../../App.jsx'

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: [{ id: 1, name: 'Plant A', lastWatered: '2025-07-10' }] }),
  addBase: (u) => u,
}))

test('navigating to /timeline renders the Timeline page', () => {
  render(
    <OpenAIProvider>
      <MemoryRouter initialEntries={['/timeline']}>
        <App />
      </MemoryRouter>
    </OpenAIProvider>
  )

  expect(screen.getByRole('link', { name: 'Plant A' })).toBeInTheDocument()
})
