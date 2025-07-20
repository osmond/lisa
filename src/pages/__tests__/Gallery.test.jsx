import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Gallery from '../Gallery.jsx'
import { usePlants } from '../../PlantContext.jsx'

jest.mock('../../PlantContext.jsx', () => {
  const actual = jest.requireActual('../../PlantContext.jsx')
  return {
    ...actual,
    usePlants: jest.fn(),
  }
})

const usePlantsMock = usePlants

let mockPlants = []

beforeEach(() => {
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      photos: [
        { src: 'a.jpg', caption: 'first' },
        { src: 'b.jpg', caption: 'second' },
      ],
    },
  ]
  usePlantsMock.mockReturnValue({ plants: mockPlants })
})

afterEach(() => {
  jest.resetAllMocks()
})

test('clicking a photo opens the lightbox viewer', () => {
  render(
    <MemoryRouter>
      <Gallery />
    </MemoryRouter>
  )

  const img = screen.getByAltText('first')
  fireEvent.click(img)

  const viewer = screen.getByRole('dialog', { name: /gallery viewer/i })
  expect(viewer).toBeInTheDocument()

  const viewerImg = within(viewer).getByAltText('first')
  expect(viewerImg).toHaveAttribute('src', 'a.jpg')

  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(within(viewer).getByAltText('second')).toHaveAttribute('src', 'b.jpg')

  fireEvent.keyDown(window, { key: 'Escape' })
  expect(screen.queryByRole('dialog', { name: /gallery viewer/i })).toBeNull()
})
