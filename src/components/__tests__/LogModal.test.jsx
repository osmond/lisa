import { render, screen, fireEvent } from '@testing-library/react'
import LogModal from '../LogModal.jsx'

test('submits log data', () => {
  const onSave = jest.fn()
  const onClose = jest.fn()
  render(<LogModal onSave={onSave} onClose={onClose} defaultType="Watered" />)

  fireEvent.change(screen.getByLabelText(/note/i), { target: { value: 'some notes' } })
  fireEvent.click(screen.getByText('Save'))

  expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ type: 'Watered', note: 'some notes' }))
})

test('escape closes modal', () => {
  const onClose = jest.fn()
  render(<LogModal onSave={() => {}} onClose={onClose} />)
  fireEvent.keyDown(window, { key: 'Escape' })
  expect(onClose).toHaveBeenCalled()
})
