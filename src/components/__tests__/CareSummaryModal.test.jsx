import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PlantProvider } from '../../PlantContext.jsx'
import CareSummaryModal from '../CareSummaryModal.jsx'

const tasks = [
  { id: 'w-1', plantId: 1, plantName: 'Aloe', type: 'Water' },
]

test('lists tasks and closes', () => {
  const onClose = jest.fn()
  render(
    <PlantProvider>
      <MemoryRouter>
        <CareSummaryModal tasks={tasks} onClose={onClose} />
      </MemoryRouter>
    </PlantProvider>
  )
  expect(screen.getByRole('dialog', { name: /care summary/i })).toBeInTheDocument()
  expect(screen.getByText('Water Aloe')).toBeInTheDocument()
  fireEvent.click(screen.getByLabelText(/close/i))
  expect(onClose).toHaveBeenCalled()
})
