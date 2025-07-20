import { render, screen, fireEvent } from '@testing-library/react'
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

  const dialogs = screen.getAllByRole('dialog', { name: /gallery viewer/i })
  const viewer = dialogs[0]
  expect(viewer).toBeInTheDocument()

  const viewerImg = screen.getAllByAltText('first')[1]
  expect(viewerImg).toHaveAttribute('src', 'a.jpg')

  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(screen.getAllByAltText('second')[1]).toHaveAttribute('src', 'b.jpg')

  fireEvent.keyDown(window, { key: 'Escape' })
  expect(screen.queryByRole('dialog', { name: /gallery viewer/i })).toBeNull()
})
