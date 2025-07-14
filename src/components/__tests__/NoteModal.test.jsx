import { render, screen, fireEvent } from '@testing-library/react'
import NoteModal from '../NoteModal.jsx'

test('submits note data', () => {
  const onSave = jest.fn()
  const onClose = jest.fn()
  render(<NoteModal onSave={onSave} onClose={onClose} />)

  fireEvent.change(screen.getByLabelText(/note/i), { target: { value: 'hello' } })
  fireEvent.click(screen.getByText('Save'))

  expect(onSave).toHaveBeenCalledWith('hello')
  expect(onClose).toHaveBeenCalled()
})

test('cancel closes without saving', () => {
  const onSave = jest.fn()
  const onClose = jest.fn()
  render(<NoteModal onSave={onSave} onClose={onClose} />)
  fireEvent.click(screen.getByText('Cancel'))
  expect(onClose).toHaveBeenCalled()
  expect(onSave).not.toHaveBeenCalled()
})
