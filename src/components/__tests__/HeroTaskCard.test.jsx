import { render, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HeroTaskCard from '../HeroTaskCard.jsx'
import { PlantProvider } from '../../PlantContext.jsx'

const task = {
  id: 1,
  plantId: 1,
  plantName: 'Monstera',
  image: 'https://images.pexels.com/photos/5699660/pexels-photo-5699660.jpeg',
  type: 'Water',
  difficulty: 'Easy',
  light: 'Bright'
}

test('clears timeout on unmount', () => {
  jest.useFakeTimers()
  const clearSpy = jest.spyOn(global, 'clearTimeout')
  const { unmount, getByRole } = render(
    <PlantProvider>
      <MemoryRouter>
        <HeroTaskCard task={task} />
      </MemoryRouter>
    </PlantProvider>
  )
  fireEvent.click(getByRole('checkbox'))
  unmount()
  expect(clearSpy).toHaveBeenCalled()
  clearSpy.mockRestore()
  jest.useRealTimers()
})
