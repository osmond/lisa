import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PlantDetail from '../PlantDetail.jsx'
import { MenuProvider } from '../../MenuContext.jsx'
import { OpenAIProvider } from '../../OpenAIContext.jsx'

let mockPlants = []
jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({
    plants: mockPlants,
    addPhoto: jest.fn(),
    removePhoto: jest.fn(),
  }),
  addBase: (u) => u,
}))

beforeEach(() => {
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      careLog: [
        { date: '2025-07-02', type: 'Watered', note: 'deep soak' },
      ],
      photos: [],
    },
  ]
})

test('shows notes from care log in timeline', () => {
  render(
    <OpenAIProvider>
      <MenuProvider>
        <MemoryRouter initialEntries={['/plant/1']}>
          <Routes>
            <Route path="/plant/:id" element={<PlantDetail />} />
          </Routes>
        </MemoryRouter>
      </MenuProvider>
    </OpenAIProvider>
  )

  fireEvent.click(screen.getByRole('tab', { name: /activity/i }))

  expect(screen.getByText('July 2, 2025')).toBeInTheDocument()
  expect(screen.getAllByText(/Watered/).length).toBeGreaterThan(0)
  expect(screen.getByText('deep soak')).toBeInTheDocument()

})

test('timeline bullet markup matches snapshot', () => {
  const { container } = render(
    <OpenAIProvider>
      <MenuProvider>
        <MemoryRouter initialEntries={['/plant/1']}>
          <Routes>
            <Route path="/plant/:id" element={<PlantDetail />} />
          </Routes>
        </MemoryRouter>
      </MenuProvider>
    </OpenAIProvider>
  )

  fireEvent.click(screen.getByRole('tab', { name: /activity/i }))

  const list = container.querySelector('ul')
  expect(list).toMatchSnapshot()
})

test('toggle reverses month ordering', () => {
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      careLog: [
        { date: '2025-07-02', type: 'Watered' },
        { date: '2025-06-01', type: 'Watered' },
      ],
      photos: [],
    },
  ]

  render(
    <OpenAIProvider>
      <MenuProvider>
        <MemoryRouter initialEntries={['/plant/1']}>
          <Routes>
            <Route path="/plant/:id" element={<PlantDetail />} />
          </Routes>
        </MemoryRouter>
      </MenuProvider>
    </OpenAIProvider>
  )

  fireEvent.click(screen.getByRole('tab', { name: /activity/i }))

  let headings = screen.getAllByRole('heading', { level: 3 })
  expect(headings[0]).toHaveTextContent('July 2025')

  fireEvent.click(screen.getByRole('button', { name: /show oldest first/i }))

  headings = screen.getAllByRole('heading', { level: 3 })
  expect(headings[0]).toHaveTextContent('June 2025')
})
