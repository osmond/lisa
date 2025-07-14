import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PlantProvider } from '../../PlantContext.jsx'
import plants from '../../plants.json'
import { AllGallery } from '../Gallery.jsx'

test('clicking add photos button opens file dialog', () => {
  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <AllGallery />
      </MemoryRouter>
    </PlantProvider>
  )

  const input = container.querySelector('input[type="file"]')
  const clickSpy = jest.spyOn(input, 'click').mockImplementation(() => {})


  fireEvent.click(
    screen.getAllByRole('button', { name: /add photos/i })[0]
  )

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

test('overlay displays plant name on hover and focus', () => {
  const plant = plants[0]
  render(
    <PlantProvider>
      <MemoryRouter>
        <AllGallery />
      </MemoryRouter>
    </PlantProvider>
  )

  const img = screen.getAllByAltText(plant.name)[0]
  const button = img.closest('button')
  expect(button).not.toBeNull()

  fireEvent.mouseOver(button)
  const svgHover = button.querySelector('svg')
  expect(svgHover).toBeInTheDocument()
  expect(within(button).getByText(plant.name)).toBeInTheDocument()

  fireEvent.focus(button)
  const svgFocus = button.querySelector('svg')
  expect(svgFocus).toBeInTheDocument()
  expect(within(button).getByText(plant.name)).toBeInTheDocument()
})
