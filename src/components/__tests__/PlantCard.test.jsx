import { render, screen, fireEvent } from '@testing-library/react'
import PlantCard from '../PlantCard.jsx'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { usePlants } from '../../PlantContext.jsx'

const navigateMock = jest.fn()
const markWatered = jest.fn()
const removePlant = jest.fn()

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: jest.fn() }
})

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants

beforeEach(() => {
  navigateMock.mockClear()
  markWatered.mockClear()
  removePlant.mockClear()
  useNavigate.mockReturnValue(navigateMock)
  usePlantsMock.mockReturnValue({
    plants: [],
    markWatered,
    removePlant,
    updatePlant: jest.fn(),
    addPlant: jest.fn(),
    addPhoto: jest.fn(),
    removePhoto: jest.fn(),
  })
})

const plant = {
  id: 1,
  image: 'test.jpg',
  name: 'Aloe Vera',
  lastWatered: '2024-05-01',
  nextWater: '2024-05-07'
}

test('renders plant name', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  expect(screen.getByText('Aloe Vera')).toBeInTheDocument()
})

test('water button triggers watering', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Water'))
  expect(markWatered).toHaveBeenCalledWith(1)
})

test('edit button navigates to edit page', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Edit'))
  expect(navigateMock).toHaveBeenCalledWith('/plant/1/edit')
})

test('delete button removes plant', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Delete'))
  expect(removePlant).toHaveBeenCalledWith(1)
})
