import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Gallery from '../Gallery.jsx'
import plants from '../../plants.json'
import { PlantProvider } from '../../PlantContext.jsx'

const Wrapper = ({ children }) => <PlantProvider>{children}</PlantProvider>

test('renders gallery images for plant', () => {
  const plant = plants[0]
  render(
    <Wrapper>
      <MemoryRouter initialEntries={[`/plant/${plant.id}/gallery`]}>
        <Routes>
          <Route path="/plant/:id/gallery" element={<Gallery />} />
        </Routes>
      </MemoryRouter>
    </Wrapper>
  )

  const images = screen.getAllByAltText(plant.name)
  expect(images.length).toBeGreaterThanOrEqual(plant.photos.length)
})

test('lightbox opens when image clicked', () => {
  const plant = plants[0]
  render(
    <Wrapper>
      <MemoryRouter initialEntries={[`/plant/${plant.id}/gallery`]}> 
        <Routes>
          <Route path="/plant/:id/gallery" element={<Gallery />} />
        </Routes>
      </MemoryRouter>
    </Wrapper>
  )

  const img = screen.getAllByAltText(plant.name)[0]
  fireEvent.click(img)

  expect(screen.getByRole('dialog')).toBeInTheDocument()
})

test('photo note persists after saving', () => {
  const plant = plants[0]
  const { rerender } = render(
    <Wrapper>
      <MemoryRouter initialEntries={[`/plant/${plant.id}/gallery`]}>
        <Routes>
          <Route path="/plant/:id/gallery" element={<Gallery />} />
        </Routes>
      </MemoryRouter>
    </Wrapper>
  )

  fireEvent.click(screen.getAllByText('Edit')[0])
  fireEvent.change(screen.getByPlaceholderText('Note'), {
    target: { value: 'hello' },
  })
  fireEvent.click(screen.getByText('Save'))

  expect(screen.getByText('hello')).toBeInTheDocument()

  rerender(
    <Wrapper>
      <MemoryRouter initialEntries={[`/plant/${plant.id}/gallery`]}>
        <Routes>
          <Route path="/plant/:id/gallery" element={<Gallery />} />
        </Routes>
      </MemoryRouter>
    </Wrapper>
  )

  expect(screen.getByText('hello')).toBeInTheDocument()
})
