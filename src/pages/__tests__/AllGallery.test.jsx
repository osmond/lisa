import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PlantProvider } from '../../PlantContext.jsx'
import { AllGallery } from '../Gallery.jsx'

test('clicking add photos button opens file dialog', () => {
  const clickSpy = jest
    .spyOn(window.HTMLInputElement.prototype, 'click')
    .mockImplementation(() => {})

  render(
    <PlantProvider>
      <MemoryRouter>
        <AllGallery />
      </MemoryRouter>
    </PlantProvider>
  )

  fireEvent.click(screen.getByRole('button', { name: /add photos/i }))
  expect(clickSpy).toHaveBeenCalled()
})
