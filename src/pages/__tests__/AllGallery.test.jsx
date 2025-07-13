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

test('newly uploaded image is added to gallery', () => {
  const original = global.FileReader
  class MockFileReader {
    readAsDataURL() {
      this.onload?.({ target: { result: 'data:test' } })
    }
  }
  global.FileReader = MockFileReader

  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <AllGallery />
      </MemoryRouter>
    </PlantProvider>
  )

  const input = container.querySelector('input[type="file"]')
  const initialCount = container.querySelectorAll('img').length

  fireEvent.change(input, { target: { files: [new File(['x'], 'x.png')] } })

  const updatedCount = container.querySelectorAll('img').length
  expect(updatedCount).toBe(initialCount + 1)

  global.FileReader = original
})
