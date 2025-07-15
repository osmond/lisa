import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Gallery from '../Gallery.jsx'
import plants from '../../plants.json'
import { PlantProvider } from '../../PlantContext.jsx'

test('renders gallery images for plant', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const plant = plants[0]
  render(
    <PlantProvider>
      <MemoryRouter initialEntries={[`/plant/${plant.id}/gallery`]}>
        <Routes>
          <Route path="/plant/:id/gallery" element={<Gallery />} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )

  const images = screen.getAllByAltText(plant.name)
  expect(images.length).toBeGreaterThanOrEqual(plant.photos.length)
  expect(errorSpy).not.toHaveBeenCalled()
  errorSpy.mockRestore()
})

test('lightbox opens when image clicked', () => {
  const plant = plants[0]
  render(
    <PlantProvider>
      <MemoryRouter initialEntries={[`/plant/${plant.id}/gallery`]}>
        <Routes>
          <Route path="/plant/:id/gallery" element={<Gallery />} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )

  const img = screen.getAllByAltText(plant.name)[0]
  fireEvent.click(img)

  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
