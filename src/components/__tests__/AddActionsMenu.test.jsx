import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddActionsMenu from '../AddActionsMenu.jsx'

test('opens menu and focuses first item', async () => {
  const user = userEvent.setup()
  render(<AddActionsMenu />)
  await user.click(screen.getByRole('button', { name: /add/i }))
  const dialog = screen.getByRole('dialog')
  expect(dialog).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /add plant/i })).toHaveFocus()
})

test('calls callback and closes menu', async () => {
  const user = userEvent.setup()
  const onAddPlant = jest.fn()
  render(<AddActionsMenu onAddPlant={onAddPlant} />)
  await user.click(screen.getByRole('button', { name: /add/i }))
  await user.click(screen.getByRole('button', { name: /add plant/i }))
  expect(onAddPlant).toHaveBeenCalled()
  expect(screen.queryByRole('dialog')).toBeNull()
})
