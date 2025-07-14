import { render, screen, fireEvent } from '@testing-library/react'
import PlantSpotlightCard from '../PlantSpotlightCard.jsx'
import { usePlants } from '../../PlantContext.jsx'

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants
const markWatered = jest.fn()
const logEvent = jest.fn()

beforeEach(() => {
  markWatered.mockClear()
  logEvent.mockClear()
  usePlantsMock.mockReturnValue({ markWatered, logEvent })
})

const plant = {
  id: 1,
  name: 'Pothos',
  image: 'a.jpg',
  light: 'Bright',
  difficulty: 'Easy',
}
const nextPlant = { id: 2, name: 'Monstera' }

test('renders plant info and next plant text', () => {
  render(<PlantSpotlightCard plant={plant} nextPlant={nextPlant} />)
  expect(screen.getByText('Pothos')).toBeInTheDocument()
  expect(screen.getByText(/Next up: Monstera/)).toBeInTheDocument()
})

test('water button calls markWatered', () => {
  render(<PlantSpotlightCard plant={plant} />)
  fireEvent.click(screen.getByText('Water'))
  expect(markWatered).toHaveBeenCalledWith(1, '')
})

test('add note button prompts and logs event', () => {
  const promptMock = jest.spyOn(window, 'prompt').mockReturnValue('hi')
  render(<PlantSpotlightCard plant={plant} />)
  fireEvent.click(screen.getByText('Add Note'))
  expect(logEvent).toHaveBeenCalledWith(1, 'Note', 'hi')
  promptMock.mockRestore()
})

test('skip button hides card and calls callback', () => {
  const onSkip = jest.fn()
  render(<PlantSpotlightCard plant={plant} onSkip={onSkip} />)
  fireEvent.click(screen.getByText('Skip'))
  expect(onSkip).toHaveBeenCalled()
  expect(screen.queryByText('Pothos')).toBeNull()
})

