import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { PlantProvider } from '../../PlantContext.jsx'
import { AllGallery } from '../Gallery.jsx'

test('clicking add photos button opens file dialog and focuses input', () => {
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
  const input = screen.getByLabelText(/add photos input/i)
  expect(clickSpy).toHaveBeenCalled()
  expect(document.activeElement).toBe(input)
})

test('add photos button is keyboard accessible', async () => {
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

  const button = screen.getByRole('button', { name: /add photos/i })
  const user = userEvent.setup()
  button.focus()
  await user.keyboard('{Enter}')

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
