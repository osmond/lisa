import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button.jsx'

test('renders children and applies class name', () => {
  render(<Button className="px-2">Click</Button>)
  const btn = screen.getByRole('button', { name: 'Click' })
  expect(btn).toHaveClass('rounded-lg')
  expect(btn).toHaveClass('px-2')
})

test('handles click events', () => {
  const onClick = jest.fn()
  render(
    <Button onClick={onClick}>Press</Button>
  )
  fireEvent.click(screen.getByRole('button', { name: 'Press' }))
  expect(onClick).toHaveBeenCalled()
})

