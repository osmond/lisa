import { render, screen, fireEvent } from '@testing-library/react'
import Timeline from '../Timeline.jsx'
import { usePlants } from '../../PlantContext.jsx'
import { OpenAIProvider } from '../../OpenAIContext.jsx'

const addTimelineNote = jest.fn()

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants

beforeEach(() => {
  addTimelineNote.mockClear()
  usePlantsMock.mockReturnValue({ plants: [], timelineNotes: [], addTimelineNote })
})

test('fab opens note modal', () => {
  render(
    <OpenAIProvider>
      <Timeline />
    </OpenAIProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: /add first entry/i }))
  expect(screen.getByRole('dialog', { name: /note/i })).toBeInTheDocument()
})

test('saving note calls addTimelineNote', () => {
  render(
    <OpenAIProvider>
      <Timeline />
    </OpenAIProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: /add first entry/i }))
  fireEvent.change(
    screen.getByRole('textbox', { name: /note/i }),
    { target: { value: 'hi' } }
  )
  fireEvent.click(screen.getByRole('button', { name: /save/i }))
  expect(addTimelineNote).toHaveBeenCalledWith('hi')
})
